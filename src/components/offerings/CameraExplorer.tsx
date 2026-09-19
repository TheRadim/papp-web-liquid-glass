"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/content/types";
import { withBasePath } from "@/lib/site/basePath";

const FRAME_COUNT = 96;
const ARROW_STEP = FRAME_COUNT / 4;
const frameUrl = (frame: number) => withBasePath(`/images/camera/rotation/${frame}.webp`);
const content = {
  en: {
    eyebrow: "A closer look", title: "One camera. A wider perspective.",
    intro: "Explore the camera from different angles, then see how camera measurements help explain activity across a whole area.",
    drag: "Drag to explore the camera", angle: "Camera viewing angle", previous: "Previous angle", next: "Next angle",
    features: [
      { title: "Number plates and vehicle details", body: "Einar processes number plates on the camera using Carmen® recognition. It also supports vehicle make, model, colour and category recognition." },
      { title: "Movement and direction", body: "Built-in vehicle detection supports two lanes, travel direction and speeds up to 80 km/h, helping capture movement at entrances and along urban roads." },
      { title: "Built for outdoor measurement", body: "A weatherproof aluminium housing, integrated illumination and motorised zoom support outdoor use and low-light capture. PoE+ combines power and data in one cable." }
    ]
  },
  da: {
    eyebrow: "Kom tættere på", title: "Ét kamera. Et bredere perspektiv.",
    intro: "Se kameraet fra forskellige vinkler, og udforsk, hvordan kameramålinger hjælper med at forklare aktiviteten i et helt område.",
    drag: "Træk for at udforske kameraet", angle: "Kameraets synsvinkel", previous: "Forrige vinkel", next: "Næste vinkel",
    features: [
      { title: "Nummerplader og køretøjsdetaljer", body: "Einar behandler nummerplader direkte i kameraet med Carmen®-genkendelse. Kameraet understøtter også genkendelse af køretøjets mærke, model, farve og kategori." },
      { title: "Bevægelse og retning", body: "Indbygget køretøjsregistrering understøtter to vognbaner, kørselsretning og hastigheder op til 80 km/t til måling ved indkørsler og langs byveje." },
      { title: "Bygget til udendørs måling", body: "Et vejrbestandigt aluminiumshus, integreret belysning og motoriseret zoom understøtter udendørs brug og optagelser i svagt lys. PoE+ samler strøm og data i ét kabel." }
    ]
  }
};

export function CameraExplorer({ locale }: { locale: Locale }) {
  const text = content[locale];
  const [frame, setFrame] = useState(0);
  const [ready, setReady] = useState(false);
  const drag = useRef<{ x: number; frame: number } | null>(null);
  const animation = useRef(0);
  const animationVersion = useRef(0);
  const images = useRef(new Map<number, Promise<void>>());

  function cancelAnimation() {
    animationVersion.current += 1;
    window.cancelAnimationFrame(animation.current);
  }

  function loadFrame(index: number) {
    let loaded = images.current.get(index);
    if (!loaded) {
      const image = new window.Image();
      image.src = frameUrl(index);
      loaded = image.decode();
      images.current.set(index, loaded);
      loaded.catch(() => images.current.delete(index));
    }
    return loaded;
  }

  async function rotate(direction: number) {
    cancelAnimation();
    const version = animationVersion.current;
    const sequence = Array.from({ length: ARROW_STEP }, (_, index) => wrap(frame + direction * (index + 1)));
    try {
      await Promise.all(sequence.map(loadFrame));
    } catch {
      return;
    }
    if (version !== animationVersion.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFrame(sequence[sequence.length - 1]);
      return;
    }
    let previousTime = 0;
    let index = 0;
    function advance(time: number) {
      if (version !== animationVersion.current) return;
      if (time - previousTime >= 24) {
        setFrame(sequence[index++]);
        previousTime = time;
      }
      if (index < sequence.length) animation.current = window.requestAnimationFrame(advance);
    }
    animation.current = window.requestAnimationFrame(advance);
  }

  useEffect(() => () => {
    animationVersion.current += 1;
    window.cancelAnimationFrame(animation.current);
  }, []);

  const wrap = (value: number) => (value % FRAME_COUNT + FRAME_COUNT) % FRAME_COUNT;

  useEffect(() => {
    if (!ready) return;
    // Decode the next quarter-turn in either direction before interaction.
    for (let offset = -ARROW_STEP; offset <= ARROW_STEP; offset++) {
      void loadFrame(wrap(frame + offset)).catch(() => {});
    }
  }, [frame, ready]);

  return (
    <section className="camera-explorer papp-section">
      <div className="container">
        <div className="section-heading section-heading--center">
          <p className="eyebrow">{text.eyebrow}</p>
          <h2>{text.title}</h2>
          <p>{text.intro}</p>
        </div>
        <div className="camera-explorer__layout">
          <div className="camera-explorer__viewer">
            <div className="camera-explorer__spin"
              onPointerDown={(event) => {
                if (event.button !== 0) return;
                cancelAnimation();
                drag.current = { x: event.clientX, frame };
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                if (drag.current) setFrame(wrap(drag.current.frame + Math.round((event.clientX - drag.current.x) / 7)));
              }}
              onPointerUp={() => { drag.current = null; }}
              onPointerCancel={() => { drag.current = null; }}
              onLostPointerCapture={() => { drag.current = null; }}
            >
              <Image src={frameUrl(frame)} alt={locale === "da" ? "Kamera set fra den valgte vinkel" : "Camera shown from the selected angle"}
                width={1000} height={563} sizes="(max-width: 992px) 85vw, 650px" draggable={false} unoptimized onLoad={() => setReady(true)} />
            </div>
            <p className="camera-explorer__hint">{text.drag} <a href="#camera-model-credit" aria-label={locale === "da" ? "Kreditering af kameramodel" : "Camera model attribution"}><sup>*</sup></a></p>
            <div className="camera-explorer__controls">
              <button type="button" aria-label={text.previous} onClick={() => void rotate(-1)}>←</button>
              <input type="range" min="0" max={FRAME_COUNT - 1} value={frame} aria-label={text.angle} onChange={(event) => { cancelAnimation(); setFrame(Number(event.target.value)); }} />
              <button type="button" aria-label={text.next} onClick={() => void rotate(1)}>→</button>
            </div>
          </div>
          <div className="camera-explorer__features">
            {text.features.map((feature, index) => (
              <article key={feature.title}>
                <h3><span>{String(index + 1).padStart(2, "0")}</span>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
