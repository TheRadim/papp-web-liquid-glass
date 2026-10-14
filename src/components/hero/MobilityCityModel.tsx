"use client";

import { useGLTF } from "@react-three/drei";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { AnimationMixer, Color, Group, LoopRepeat, Material, Mesh, MeshStandardMaterial, Object3D, PropertyBinding } from "three";
import {
  CITY_COUNTER_FADE_SECONDS,
  CITY_COUNTER_FADES,
  CITY_OBJECT_NAMES,
  getMobilityAreaFromObject,
  MOBILITY_AREAS,
  MOBILITY_CITY_MODEL_URL
} from "@/config/mobility-city";
import type { MobilityArea, MobilityModelStatus } from "@/types/mobility-city";

interface MobilityCityModelProps {
  hoveredArea: MobilityArea | null;
  selectedArea: MobilityArea | null;
  reducedMotion: boolean;
  onAreaHover: (area: MobilityArea | null) => void;
  onAreaSelect: (area: MobilityArea) => void;
  onStatusChange: (status: MobilityModelStatus) => void;
}

interface MaterialSnapshot {
  color?: MeshStandardMaterial["color"];
  emissive?: MeshStandardMaterial["emissive"];
  emissiveIntensity?: number;
  opacity?: number;
  transparent?: boolean;
}

const AREA_COLORS: Record<MobilityArea, Color> = {
  sensors: new Color("#58bfe9"),
  cameras: new Color("#6dcaf0"),
  insights: new Color("#50b7e4")
};

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

function rememberMaterial(material: Material) {
  const standard = material as MeshStandardMaterial;

  if (standard.userData.mobilityOriginal) {
    return standard.userData.mobilityOriginal as MaterialSnapshot;
  }

  const snapshot: MaterialSnapshot = {
    color: standard.color?.clone(),
    emissive: standard.emissive?.clone(),
    emissiveIntensity: standard.emissiveIntensity,
    opacity: standard.opacity,
    transparent: standard.transparent
  };

  standard.userData.mobilityOriginal = snapshot;
  return snapshot;
}

function applyMaterialState(material: Material, active: boolean, muted: boolean, activeColor: Color, mutedOpacity = 0.5) {
  const standard = material as MeshStandardMaterial;
  const snapshot = rememberMaterial(standard);

  if (snapshot.color && standard.color) {
    standard.color.copy(snapshot.color);

    if (active) {
      standard.color.lerp(activeColor, 0.58);
    }
  }

  if (snapshot.emissive && standard.emissive) {
    standard.emissive.copy(snapshot.emissive);

    if (active) {
      standard.emissive.copy(activeColor);
      standard.emissiveIntensity = 0.36;
    } else {
      standard.emissiveIntensity = snapshot.emissiveIntensity ?? 0;
    }
  }

  if (typeof snapshot.opacity === "number") {
    standard.opacity = muted ? Math.max(mutedOpacity, snapshot.opacity * mutedOpacity) : snapshot.opacity;
    standard.transparent = muted || Boolean(snapshot.transparent);
  }

  standard.needsUpdate = true;
}

function namedObject(scene: Object3D, objectName: string) {
  return scene.getObjectByName(objectName) ?? null;
}

function isSelectableHelper(object: Object3D) {
  return object.name.toLowerCase().includes("selectable");
}

/** Opacity of a counter at time `t` on the baked timeline, from its fade windows. */
function counterOpacity(windows: { in: number; out: number }[], t: number) {
  const fade = CITY_COUNTER_FADE_SECONDS;
  let opacity = 0;

  windows.forEach((window) => {
    if (t < window.in || t > window.out) return;
    const fadeIn = Math.min(1, (t - window.in) / fade);
    const fadeOut = Math.min(1, (window.out - t) / fade);
    opacity = Math.max(opacity, Math.min(fadeIn, fadeOut));
  });

  return opacity;
}

export function MobilityCityModel({
  hoveredArea,
  selectedArea,
  reducedMotion,
  onAreaHover,
  onAreaSelect,
  onStatusChange
}: MobilityCityModelProps) {
  const gltf = useGLTF(MOBILITY_CITY_MODEL_URL);
  const { invalidate } = useThree();

  const model = useMemo(() => {
    const clone = gltf.scene.clone(true) as Group;

    clone.traverse((object) => {
      if (object instanceof Mesh) {
        object.material = cloneMaterial(object.material);
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    return clone;
  }, [gltf.scene]);

  // The +1 / -1 counters come out of Blender fully transparent (their fade
  // was an opacity animation glTF can't carry), so we drive their opacity here.
  const counters = useMemo(() => {
    const found: { materials: MeshStandardMaterial[]; windows: { in: number; out: number }[] }[] = [];

    Object.entries(CITY_COUNTER_FADES).forEach(([name, windows]) => {
      // GLTFLoader sanitises node names ("+1 green" becomes "+1_green").
      const object = model.getObjectByName(name) ?? model.getObjectByName(PropertyBinding.sanitizeNodeName(name));
      if (!object) return;

      const materials: MeshStandardMaterial[] = [];
      object.traverse((child) => {
        if (!(child instanceof Mesh)) return;
        child.castShadow = false;
        child.renderOrder = 2;
        eachMaterial(child.material, (material) => {
          const standard = material as MeshStandardMaterial;
          standard.transparent = true;
          standard.alphaTest = 0;
          standard.depthWrite = false;
          standard.opacity = 0;
          if (standard.emissive) {
            standard.emissive.copy(standard.color);
            standard.emissiveIntensity = 0.55;
          }
          standard.needsUpdate = true;
          materials.push(standard);
        });
      });

      found.push({ materials, windows });
    });

    return found;
  }, [model]);

  const timelineDuration = useMemo(() => gltf.animations.reduce((longest, clip) => Math.max(longest, clip.duration), 0), [gltf.animations]);

  const roots = useMemo(() => {
    return MOBILITY_AREAS.reduce<Record<MobilityArea, Object3D | null>>(
      (accumulator, area) => {
        accumulator[area] = namedObject(model, CITY_OBJECT_NAMES[area]);
        return accumulator;
      },
      { sensors: null, cameras: null, insights: null }
    );
  }, [model]);

  const baseScales = useMemo(() => {
    return MOBILITY_AREAS.reduce<Record<MobilityArea, Object3D["scale"] | null>>(
      (accumulator, area) => {
        accumulator[area] = roots[area]?.scale.clone() ?? null;
        return accumulator;
      },
      { sensors: null, cameras: null, insights: null }
    );
  }, [roots]);

  // Objects whose scale is driven by the baked animation (the Insights pulse)
  // must not be eased back to their rest scale every frame.
  const scaleAnimatedNames = useMemo(() => {
    const names = new Set<string>();
    gltf.animations.forEach((clip) => {
      clip.tracks.forEach((track) => {
        const dot = track.name.lastIndexOf(".");
        if (dot > 0 && track.name.slice(dot + 1) === "scale") {
          names.add(track.name.slice(0, dot));
        }
      });
    });
    return names;
  }, [gltf.animations]);

  const mixer = useMemo(() => new AnimationMixer(model), [model]);

  useEffect(() => {
    if (reducedMotion || gltf.animations.length === 0) {
      return undefined;
    }

    // The model ships one baked timeline split into a clip per object, all the
    // same length. Play them forward at real speed and loop them together so
    // the cars, counters and Insights pulse stay in sync.
    const actions = gltf.animations.map((clip) => {
      const action = mixer.clipAction(clip);
      action.reset();
      action.setLoop(LoopRepeat, Infinity);
      action.timeScale = 1;
      action.clampWhenFinished = false;
      action.enabled = true;
      action.paused = false;
      action.setEffectiveWeight(1);
      action.setEffectiveTimeScale(action.timeScale);
      action.play();
      return action;
    });

    invalidate();

    return () => {
      actions.forEach((action) => action.stop());
      mixer.stopAllAction();
      mixer.uncacheRoot(model);
    };
  }, [gltf.animations, invalidate, mixer, model, reducedMotion]);

  useEffect(() => {
    onStatusChange("ready");
  }, [onStatusChange]);

  useEffect(() => {
    const activeArea = selectedArea ? null : hoveredArea;

    model.traverse((child) => {
      if (!(child instanceof Mesh)) {
        return;
      }

      const area = getMobilityAreaFromObject(child);

      if (!area || isSelectableHelper(child)) {
        return;
      }

      const active = area === activeArea;

      eachMaterial(child.material, (material) => applyMaterialState(material, active, false, AREA_COLORS[area]));
    });
    invalidate();
  }, [hoveredArea, invalidate, model, selectedArea]);

  function getAreaFromPointer(event: ThreeEvent<PointerEvent | MouseEvent>) {
    return getMobilityAreaFromObject(event.object);
  }

  useFrame((_, delta) => {
    let needsAnotherFrame = !reducedMotion && gltf.animations.length > 0;

    if (needsAnotherFrame) {
      mixer.update(delta);
    }

    const timelineTime = timelineDuration > 0 ? mixer.time % timelineDuration : 0;
    counters.forEach(({ materials, windows }) => {
      const opacity = needsAnotherFrame ? counterOpacity(windows, timelineTime) : 0;
      materials.forEach((material) => {
        material.opacity = opacity;
        material.visible = opacity > 0.001;
      });
    });

    MOBILITY_AREAS.forEach((area) => {
      const object = roots[area];
      const baseScale = baseScales[area];

      if (!object || !baseScale || (!reducedMotion && scaleAnimatedNames.has(object.name))) {
        return;
      }

      const factor = reducedMotion ? 1 : 0.14;
      const targetX = baseScale.x;
      const targetY = baseScale.y;
      const targetZ = baseScale.z;
      const scaleDelta = Math.max(Math.abs(object.scale.x - targetX), Math.abs(object.scale.y - targetY), Math.abs(object.scale.z - targetZ));
      object.scale.x += (targetX - object.scale.x) * factor;
      object.scale.y += (targetY - object.scale.y) * factor;
      object.scale.z += (targetZ - object.scale.z) * factor;

      if (scaleDelta > 0.002) {
        needsAnotherFrame = true;
      }
    });

    if (needsAnotherFrame) {
      invalidate();
    }
  });

  function handlePointerEnter(event: ThreeEvent<PointerEvent>) {
    const area = getAreaFromPointer(event);

    if (!area) {
      return;
    }

    event.stopPropagation();
    document.body.style.cursor = "pointer";
    onAreaHover(area);
  }

  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    const area = getAreaFromPointer(event);

    if (!area || area === hoveredArea) {
      return;
    }

    event.stopPropagation();
    document.body.style.cursor = "pointer";
    onAreaHover(area);
  }

  function handlePointerLeave(event: ThreeEvent<PointerEvent>) {
    const area = getMobilityAreaFromObject(event.object);

    if (!area) {
      return;
    }

    // Only the nearest thing under the pointer counts. Checking every hit
    // along the ray kept the label on when an area was merely behind the
    // ground the pointer had moved onto.
    const nearest = event.intersections.find((hit) => hit.object !== event.object);
    if (nearest && getMobilityAreaFromObject(nearest.object) === area) {
      return;
    }

    event.stopPropagation();
    document.body.style.cursor = "";
    onAreaHover(null);
  }

  function handleClick(event: ThreeEvent<MouseEvent>) {
    const area = getAreaFromPointer(event);

    if (!area) {
      return;
    }

    event.stopPropagation();
    onAreaSelect(area);
  }

  return <primitive object={model} onPointerOver={handlePointerEnter} onPointerMove={handlePointerMove} onPointerOut={handlePointerLeave} onClick={handleClick} />;
}

useGLTF.preload(MOBILITY_CITY_MODEL_URL);
