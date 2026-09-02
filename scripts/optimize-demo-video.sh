#!/usr/bin/env bash
# Reencoda o vídeo de demonstração do hero.
#
# POR QUÊ: public/nortgo-demo.mp4 tem ~23,5 MB (1524×980, 30 s, ~6 Mbps) e roda
# com autoplay no hero — o navegador baixa o arquivo inteiro no load, competindo
# com o LCP. Um screencast de UI cabe em ~2 MB sem perda visível.
#
# PRÉ-REQUISITO: ffmpeg no PATH.
#   Windows:  winget install --id Gyan.FFmpeg -e
#   macOS:    brew install ffmpeg
#   Linux:    apt install ffmpeg  (ou o gerenciador da distro)
#
# USO:  bash scripts/optimize-demo-video.sh [entrada.mp4]
# Gera:
#   public/nortgo-demo.mp4        H.264, compat. universal
#   public/nortgo-demo.webm       VP9, menor, navegadores modernos
#   public/nortgo-demo-poster.jpg 1º quadro (usar como poster={} no <video>)
#
# Depois de rodar, no IpadMockup.tsx troque o <video src=...> por <source>s
# (webm antes do mp4) e adicione poster="/nortgo-demo-poster.jpg".

set -euo pipefail

SRC="${1:-public/nortgo-demo-original.mp4}"
OUT_DIR="public"
# Largura de exibição real é ~860 CSS px; 1200 cobre telas retina com folga.
SCALE="scale='min(1200,iw)':-2"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg não encontrado no PATH — veja o cabeçalho deste script." >&2
  exit 1
fi

if [ ! -f "$SRC" ]; then
  echo "Entrada '$SRC' não existe." >&2
  echo "Guarde o arquivo grande como public/nortgo-demo-original.mp4 (git-ignored)" >&2
  echo "ou passe o caminho: bash scripts/optimize-demo-video.sh caminho/do/video.mp4" >&2
  exit 1
fi

echo "→ H.264 (mp4)…"
ffmpeg -y -i "$SRC" -vf "$SCALE,fps=24" \
  -c:v libx264 -profile:v high -preset slow -crf 30 -pix_fmt yuv420p \
  -movflags +faststart -an "$OUT_DIR/nortgo-demo.mp4"

echo "→ VP9 (webm)…"
ffmpeg -y -i "$SRC" -vf "$SCALE,fps=24" \
  -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -an "$OUT_DIR/nortgo-demo.webm"

echo "→ poster (jpg)…"
ffmpeg -y -i "$SRC" -vf "$SCALE" -frames:v 1 -q:v 4 "$OUT_DIR/nortgo-demo-poster.jpg"

echo
echo "Tamanhos:"
ls -lh "$OUT_DIR"/nortgo-demo.mp4 "$OUT_DIR"/nortgo-demo.webm "$OUT_DIR"/nortgo-demo-poster.jpg | awk '{print "  "$9"  "$5}'
echo
echo "Meta: mp4 < 3 MB. Se passar muito, suba o -crf (32–34) e rode de novo."
