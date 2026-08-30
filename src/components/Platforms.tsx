import Image from "next/image";
import icon from "../../public/brand/nortgo-icon.png";
import appStore from "../../public/brand/app-store.svg";
import googlePlay from "../../public/brand/google-play.svg";

export default function Platforms() {
  return (
    <section className="px-6 py-16 md:py-24">
      <div className="stores-card mx-auto max-w-4xl rounded-[2rem] px-6 py-14 text-center md:px-12 md:py-20">
        <Image
          src={icon}
          alt=""
          width={56}
          height={56}
          className="mx-auto h-12 w-12 object-contain md:h-14 md:w-14"
        />

        <p className="eyebrow mt-6 text-copper-ink">Onde você usa</p>
        <h2 className="section-title mt-3">
          <span className="text-grad">Um NortGo.</span> Onde você estiver.
        </h2>
        <p className="lead mx-auto mt-4 max-w-lg text-ink-dim">
          Web, App Store e Google Play — o mesmo sistema, no dispositivo que
          fizer sentido em cada momento do seu dia.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <span className="eyebrow rounded-lg border border-line-strong px-4 py-2.5 text-ink-dim">
            Web
          </span>
          <Image
            src={appStore}
            alt="Em breve na App Store"
            width={135}
            height={45}
          />
          <Image
            src={googlePlay}
            alt="Em breve no Google Play"
            width={135}
            height={45}
          />
        </div>
      </div>
    </section>
  );
}
