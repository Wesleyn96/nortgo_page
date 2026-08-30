import { ImageResponse } from "next/og";

// Imagem social gerada em build (estática, servida de /opengraph-image).
// Paleta espelha os tokens de globals.css — tema claro, cobre como acento.
export const alt =
  "NortGo: rotina, tarefas, notas, agenda, finanças e saúde num só sistema pessoal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(1200px 520px at 50% -10%, #fbeee2 0%, #ffffff 60%, #ffffff 100%)",
          color: "#1c1613",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "30px",
            letterSpacing: "-0.01em",
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "9999px",
              background: "#c9682c",
            }}
          />
          NortGo
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "78px",
              fontWeight: 800,
              lineHeight: 1.05,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              maxWidth: "900px",
            }}
          >
            <div style={{ display: "flex" }}>Tudo da sua vida.</div>
            <div style={{ display: "flex", color: "#8f3f15" }}>
              No mesmo lugar.
            </div>
          </div>
          <div style={{ fontSize: "30px", color: "#665c54", maxWidth: "820px" }}>
            Rotina, tarefas, notas, agenda, finanças e saúde num único sistema
            pessoal que mostra só o que merece sua atenção agora.
          </div>
        </div>

        <div
          style={{
            fontSize: "22px",
            color: "#978b82",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Em breve · Web · App Store · Google Play
        </div>
      </div>
    ),
    { ...size },
  );
}
