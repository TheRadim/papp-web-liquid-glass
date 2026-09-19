"use client";

import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box3, Group, Material, Mesh, MeshStandardMaterial, Object3D, Vector3 } from "three";
import type { Locale } from "@/content/types";
import { withBasePath } from "@/lib/site/basePath";

type SensorPartName = "base" | "lid" | "core";

interface SensorStep {
  part: SensorPartName;
  title: string;
  body: string;
}

interface PartSnapshot {
  position: Vector3;
  rotation: { x: number; y: number; z: number };
}

const copy: Record<Locale, { eyebrow: string; title: string; intro: string; statementTitle: string; statementBody: string; steps: SensorStep[] }> = {
  en: {
    eyebrow: "Sensor Hardware",
    title: "A parking sensor designed as part of the full data chain.",
    intro:
      "The sensor is the physical starting point: a compact unit that can sit in a parking space, collect occupancy signals and feed them into Papp Insights.",
    statementTitle: "Precise occupancy data, built from the ground up.",
    statementBody:
      "Papp sensors are developed in-house for projects where every space matters. They are designed for reliable spot-level measurement, smaller coverage areas and locations where teams need to understand exactly which bays are used, when pressure builds and how behaviour changes over time.",
    steps: [
      {
        part: "core",
        title: "Core",
        body:
          "The sealed core combines energy-efficient vehicle detection and connectivity in one protected unit. Its robust exterior works with the base to withstand weather and daily vehicle traffic."
      },
      {
        part: "base",
        title: "Base",
        body: "The base holds the whole sensor in place, designed to be sturdy yet flexible through daily pressure, weather and installation conditions."
      }
    ]
  },
  da: {
    eyebrow: "Sensorhardware",
    title: "En parkeringssensor designet som del af hele datakæden.",
    intro:
      "Sensoren er det fysiske udgangspunkt: en kompakt enhed, der kan sidde i en parkeringsplads, indsamle belægningssignaler og sende dem videre til Papp Insights.",
    statementTitle: "Præcise belægningsdata, bygget fra bunden.",
    statementBody:
      "Papps sensorer er udviklet internt til projekter, hvor hver enkelt plads betyder noget. De er skabt til stabil punktmåling, mindre dækningsområder og steder, hvor teams skal forstå præcist hvilke pladser der bruges, hvornår presset opstår, og hvordan adfærden ændrer sig over tid.",
    steps: [
      {
        part: "core",
        title: "Kerne",
        body:
          "Den forseglede kerne samler energieffektiv bilregistrering og forbindelse i én beskyttet enhed. Den robuste overflade arbejder sammen med basen for at modstå vejr og daglig trafik."
      },
      {
        part: "base",
        title: "Base",
        body: "Basen holder hele sensoren på plads og er designet til at være robust, men fleksibel under daglig belastning, vejr og installation."
      }
    ]
  }
};

export function SensorAssemblySection({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const clearHoverFrame = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [highlightedPart, setHighlightedPart] = useState<SensorPartName | null>(null);
  const highlightedStep = highlightedPart ? text.steps.findIndex((step) => step.part === highlightedPart) : -1;
  const activeStep = highlightedStep;

  useEffect(() => {
    let frame = 0;

    function updateProgress() {
      frame = 0;
      const stage = stageRef.current;
      const layout = layoutRef.current ?? sectionRef.current;
      if (!stage || !layout) return;

      const stageRect = stage.getBoundingClientRect();
      const layoutRect = layout.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const stageTopRatio = stageRect.top / viewportHeight;
      const layoutBottomRatio = layoutRect.bottom / viewportHeight;
      const opening = 1 - smoothstep(0.32, 0.42, stageTopRatio);
      const closing = smoothstep(0.54, 0.74, layoutBottomRatio);
      const nextProgress = Math.min(opening, closing);
      setProgress(nextProgress);
    }

    function requestUpdate() {
      if (frame) return;
      frame = window.requestAnimationFrame(updateProgress);
    }

    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  const setSensorHighlight = useCallback((part: SensorPartName | null) => {
    if (clearHoverFrame.current) {
      window.clearTimeout(clearHoverFrame.current);
      clearHoverFrame.current = null;
    }

    if (part) {
      setHighlightedPart(part === "lid" ? "core" : part);
      return;
    }

    clearHoverFrame.current = window.setTimeout(() => {
      setHighlightedPart(null);
      clearHoverFrame.current = null;
    }, 60);
  }, []);

  useEffect(
    () => () => {
      if (clearHoverFrame.current) window.clearTimeout(clearHoverFrame.current);
    },
    []
  );

  return (
    <section className="sensor-product-lab papp-section" ref={sectionRef}>
      <div className="container">
        <div className="sensor-product-lab__heading section-heading section-heading--center">
          <p className="eyebrow">{text.eyebrow}</p>
          <h2>{text.title}</h2>
          <p>{text.intro}</p>
        </div>
        <div className="sensor-product-lab__layout" ref={layoutRef}>
          <div
            className="sensor-product-lab__stage"
            ref={stageRef}
            aria-label={locale === "da" ? "3D-model af Papp sensor" : "3D model of Papp sensor"}
          >
            <Canvas
              className="sensor-product-lab__canvas"
              camera={{ position: [3.2, 2.35, 4.4], fov: 38 }}
              dpr={[1, 1.6]}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              shadows
            >
              <ambientLight intensity={0.58} />
              <hemisphereLight args={["#ffffff", "#dce8ef", 1.05]} />
              <directionalLight
                castShadow
                position={[3, 5, 4]}
                intensity={1.8}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-bias={-0.0002}
              />
              <SensorCameraSetup />
              <SensorModel activePart={highlightedPart} progress={progress} onPartHover={setSensorHighlight} />
              <Environment preset="city" environmentIntensity={0.24} />
              <OrbitControls
                enableDamping
                enablePan={false}
                enableZoom={false}
                dampingFactor={0.08}
                rotateSpeed={0.5}
                minDistance={2.1}
                maxDistance={6.5}
                minPolarAngle={0}
                maxPolarAngle={Math.PI}
              />
            </Canvas>
          </div>
          <div className="sensor-product-lab__copy" onPointerLeave={() => setSensorHighlight(null)}>
            <ol role="list">
              {text.steps.map((step, index) => (
                <li className={activeStep === index ? "is-active" : ""} key={step.title}>
                  <button
                    type="button"
                    onBlur={() => setSensorHighlight(null)}
                    onClick={() => setSensorHighlight(step.part)}
                    onFocus={() => setSensorHighlight(step.part)}
                    onPointerEnter={() => setSensorHighlight(step.part)}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="sensor-product-lab__statement">
          <h3>{text.statementTitle}</h3>
          <p>{text.statementBody}</p>
        </div>
      </div>
    </section>
  );
}

function smoothstep(start: number, end: number, value: number) {
  if (start === end) return value >= end ? 1 : 0;
  const amount = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return amount * amount * (3 - 2 * amount);
}

function SensorCameraSetup() {
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

function cloneMaterial(material: Material | Material[]) {
  return Array.isArray(material) ? material.map((item) => item.clone()) : material.clone();
}

function eachMaterial(material: Material | Material[], callback: (material: Material) => void) {
  if (Array.isArray(material)) {
    material.forEach(callback);
    return;
  }

  callback(material);
}

function getSensorPartFromObject(object: Object3D): SensorPartName | null {
  let current: Object3D | null = object;

  while (current) {
    const name = current.name.toLowerCase();

    if (name.includes("base")) return "base";
    if (name.includes("lid")) return "core";
    if (name.includes("perry") || name.includes("core")) return "core";

    current = current.parent;
  }

  return null;
}

function SensorModel({
  activePart,
  progress,
  onPartHover
}: {
  activePart: SensorPartName | null;
  progress: number;
  onPartHover: (part: SensorPartName | null) => void;
}) {
  const gltf = useGLTF(withBasePath("/models/sensor/parking-sensor.glb"));
  const groupRef = useRef<Group>(null);
  const parts = useRef<Partial<Record<SensorPartName, Object3D>>>({});
  const snapshots = useRef(new Map<Object3D, PartSnapshot>());
  const smoothedOpen = useRef(0);
  const opacity = useRef({ base: 1, core: 1 });
  const hoveredModelPart = useRef<SensorPartName | null>(null);

  const scene = useMemo(() => {
    const clone = gltf.scene.clone(true) as Group;
    const box = new Box3().setFromObject(clone);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const normalized = new Group();

    clone.position.sub(center);
    normalized.add(clone);
    normalized.scale.setScalar(1.8 / maxAxis);
    normalized.rotation.set(0, -0.58, 0.03);

    normalized.traverse((object) => {
      if (!(object instanceof Mesh)) return;

      object.material = cloneMaterial(object.material);
      object.castShadow = true;
      object.receiveShadow = true;

      eachMaterial(object.material, (material) => {
        const standard = material as MeshStandardMaterial;
        standard.transparent = true;
        standard.opacity = 1;
        standard.depthWrite = true;
        standard.emissiveIntensity = 0;

        if (standard.roughness !== undefined) {
          standard.roughness = Math.max(standard.roughness, 0.58);
          standard.metalness *= 0.4;
        }
      });
    });

    return normalized;
  }, [gltf.scene]);

  useEffect(() => {
    const nextParts: Partial<Record<SensorPartName, Object3D>> = {};
    const nextSnapshots = new Map<Object3D, PartSnapshot>();

    scene.traverse((object) => {
      const name = object.name.toLowerCase();

      if (name.includes("base")) nextParts.base = object;
      if (name.includes("lid")) nextParts.lid = object;
      if (name.includes("perry") || name.includes("core")) nextParts.core = object;
    });

    Object.values(nextParts).forEach((part) => {
      if (!part) return;
      nextSnapshots.set(part, {
        position: part.position.clone(),
        rotation: { x: part.rotation.x, y: part.rotation.y, z: part.rotation.z }
      });
    });

    parts.current = nextParts;
    snapshots.current = nextSnapshots;

  }, [scene]);

  useFrame((_, delta) => {
    const targetOpen = Math.min(1, Math.max(0, progress * 1.08));
    smoothedOpen.current += (targetOpen - smoothedOpen.current) * Math.min(1, delta * 5);
    const eased = smoothedOpen.current * smoothedOpen.current * (3 - 2 * smoothedOpen.current);
    // The imported model's parent rotates local -Z onto the vertical Y axis.
    // Both meshes keep their assembled offset and lift as one sealed core.
    for (const part of [parts.current.core, parts.current.lid]) {
      if (!part) continue;
      const snapshot = snapshots.current.get(part);
      if (snapshot) part.position.z = snapshot.position.z - eased * 0.075;
    }

    const blend = 1 - Math.exp(-delta * 8);
    for (const part of ["base", "core"] as const) {
      const target = !activePart || activePart === part ? 1 : 0.1;
      opacity.current[part] += (target - opacity.current[part]) * blend;
      if (Math.abs(opacity.current[part] - target) < 0.001) opacity.current[part] = target;
    }

    (["base", "core", "lid"] as SensorPartName[]).forEach((partName) => {
      const publicPart = partName === "lid" ? "core" : partName;
      parts.current[partName]?.traverse((object) => {
        if (!(object instanceof Mesh)) return;
        eachMaterial(object.material, (material) => {
          const standard = material as MeshStandardMaterial;
          if (!standard.emissive) return;
          standard.opacity = opacity.current[publicPart];
          standard.emissive.set("#47b2e4");
          const intensity = activePart === publicPart ? 0.12 : 0;
          standard.emissiveIntensity += (intensity - standard.emissiveIntensity) * Math.min(1, delta * 5.5);
        });
      });
    });
  });

  function handlePointerOver(event: ThreeEvent<PointerEvent>) {
    const part = getSensorPartFromObject(event.object);

    if (!part) {
      return;
    }

    event.stopPropagation();
    if (hoveredModelPart.current !== part) {
      hoveredModelPart.current = part;
      onPartHover(part);
    }
  }

  function handlePointerOut(event: ThreeEvent<PointerEvent>) {
    if (!getSensorPartFromObject(event.object)) {
      return;
    }

    const stillOverSensorPart = event.intersections.some((hit) => hit.object !== event.object && getSensorPartFromObject(hit.object));

    if (stillOverSensorPart) {
      return;
    }

    event.stopPropagation();
    hoveredModelPart.current = null;
    onPartHover(null);
  }

  return (
    <group ref={groupRef} position={[0, -0.22, 0]} onPointerOver={handlePointerOver} onPointerMove={handlePointerOver} onPointerOut={handlePointerOut}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(withBasePath("/models/sensor/parking-sensor.glb"));
