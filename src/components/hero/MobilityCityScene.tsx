"use client";

/* eslint-disable react-hooks/immutability */

import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { PerspectiveCamera, PMREMGenerator, Vector3 } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { CAMERA_VIEWS, CITY_FRAMING_BOXES, CITY_ZOOM_LIMITS, MOBILITY_AREAS, MOBILITY_MARKERS } from "@/config/mobility-city";
import type { Locale } from "@/content/types";
import { getMobilityCityProduct, pickMobilityText } from "@/content/mobility-city/mobility-city";
import type { MobilityView } from "@/types/mobility-city";
import { MobilityCityModel } from "@/components/hero/MobilityCityModel";
import { MobilityCityBoards } from "@/components/hero/MobilityCityBoards";
import type { MobilityArea, MobilityModelStatus } from "@/types/mobility-city";

interface MobilityCitySceneProps {
  hoveredArea: MobilityArea | null;
  selectedArea: MobilityArea | null;
  view: MobilityView;
  reducedMotion: boolean;
  resetSignal: number;
  onAreaHover: (area: MobilityArea | null) => void;
  onAreaSelect: (area: MobilityArea) => void;
  onStatusChange: (status: MobilityModelStatus) => void;
  showMarkers: boolean;
  locale: Locale;
}

interface OrbitControllerHandle {
  enabled: boolean;
  target: Vector3;
  minDistance: number;
  maxDistance: number;
  update: () => void;
}

interface CameraPose {
  position: Vector3;
  target: Vector3;
  fov: number;
}

const TWEEN_SECONDS = 1.15;
const FIT_MARGIN_X = 0.94;
const FIT_MARGIN_Y = 0.9;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const BOUNDS_CORNERS = CITY_FRAMING_BOXES.flatMap(({ min, max }) => {
  const corners: Vector3[] = [];
  [min[0], max[0]].forEach((x) => [min[1], max[1]].forEach((y) => [min[2], max[2]].forEach((z) => corners.push(new Vector3(x, y, z)))));
  return corners;
});

/** Smallest camera distance along `direction` from `target` that keeps the framing boxes inside the frame. */
function fitDistance(target: Vector3, direction: Vector3, aspect: number, fov: number, probe = new PerspectiveCamera(fov, aspect, 0.05, 200)) {
  probe.fov = fov;
  probe.aspect = aspect;
  probe.updateProjectionMatrix();

  const fits = (distance: number) => {
    const box = measureFrame(probe, target, direction, distance);
    return (box.maxX - box.minX) / 2 <= FIT_MARGIN_X && (box.maxY - box.minY) / 2 <= FIT_MARGIN_Y;
  };

  let near = 0.5;
  let far = 40;
  for (let step = 0; step < 24; step += 1) {
    const middle = (near + far) / 2;
    if (fits(middle)) far = middle;
    else near = middle;
  }
  return far;
}

const projected = new Vector3();

function measureFrame(probe: PerspectiveCamera, target: Vector3, direction: Vector3, distance: number) {
  probe.position.copy(target).addScaledVector(direction, distance);
  probe.lookAt(target);
  probe.updateMatrixWorld();
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  BOUNDS_CORNERS.forEach((corner) => {
    projected.copy(corner).project(probe);
    minX = Math.min(minX, projected.x);
    maxX = Math.max(maxX, projected.x);
    minY = Math.min(minY, projected.y);
    maxY = Math.max(maxY, projected.y);
  });
  return { minX, maxX, minY, maxY };
}

/**
 * Places the overview camera along the designed viewing direction, at the
 * distance (and with the small sideways shift) that makes the model fill the
 * canvas for its current aspect ratio.
 */
function fitOverview(aspect: number): { pose: CameraPose; distance: number } {
  const base = CAMERA_VIEWS.overview;
  const target = new Vector3(...base.target);
  const direction = new Vector3(...base.position).sub(target).normalize();
  const probe = new PerspectiveCamera(base.fov, aspect, 0.05, 200);
  let distance = fitDistance(target, direction, aspect, base.fov, probe);

  // Shift the look-at point so the model sits in the middle of the frame.
  for (let pass = 0; pass < 2; pass += 1) {
    const box = measureFrame(probe, target, direction, distance);
    const centerX = (box.minX + box.maxX) / 2;
    const centerY = (box.minY + box.maxY) / 2;
    const halfHeight = Math.tan((base.fov * Math.PI) / 360) * distance;
    const right = new Vector3().setFromMatrixColumn(probe.matrixWorld, 0);
    const up = new Vector3().setFromMatrixColumn(probe.matrixWorld, 1);
    target.addScaledVector(right, centerX * halfHeight * aspect).addScaledVector(up, centerY * halfHeight);
    distance = fitDistance(target, direction, aspect, base.fov, probe);
  }

  return {
    pose: { position: target.clone().addScaledVector(direction, distance), target, fov: base.fov },
    distance
  };
}

function CameraController({
  view,
  reducedMotion,
  resetSignal,
  debug,
  controlsRef
}: {
  view: MobilityView;
  reducedMotion: boolean;
  resetSignal: number;
  debug: boolean;
  controlsRef: MutableRefObject<OrbitControllerHandle | null>;
}) {
  const { camera, size, invalidate } = useThree();
  const aspect = size.width / Math.max(1, size.height);

  const poses = useMemo(() => {
    const overview = fitOverview(aspect);
    const baseOverview = CAMERA_VIEWS.overview;
    const baseDistance = new Vector3(...baseOverview.position).distanceTo(new Vector3(...baseOverview.target));
    // On narrow screens the overview has to pull back; pull the close-ups back
    // by the same amount so they don't crop.
    const pullBack = Math.max(1, overview.distance / baseDistance);

    const detail = (area: MobilityArea): CameraPose => {
      const designed = CAMERA_VIEWS[area];
      const target = new Vector3(...designed.target);
      const position = new Vector3(...designed.position).sub(target).multiplyScalar(pullBack).add(target);
      return { position, target, fov: designed.fov };
    };

    return {
      distance: overview.distance,
      views: {
        overview: overview.pose,
        sensors: detail("sensors"),
        cameras: detail("cameras"),
        insights: detail("insights")
      } as Record<MobilityView, CameraPose>
    };
  }, [aspect]);

  const lookAt = useRef(poses.views.overview.target.clone());
  const tween = useRef<{ from: CameraPose; to: CameraPose; elapsed: number } | null>(null);
  const initialised = useRef(false);

  const applyPose = useCallback(
    (pose: CameraPose) => {
      camera.position.copy(pose.position);
      lookAt.current.copy(pose.target);
      camera.lookAt(lookAt.current);
      if (camera instanceof PerspectiveCamera) {
        camera.fov = pose.fov;
        camera.updateProjectionMatrix();
      }
    },
    [camera]
  );

  const settle = useCallback(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.target.copy(lookAt.current);
    controls.enabled = view === "overview" || debug;
    if (controls.enabled) controls.update();
  }, [controlsRef, debug, view]);

  // Wheel / pinch zoom limits, relative to the fitted overview distance.
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.minDistance = poses.distance * CITY_ZOOM_LIMITS.closest;
    controls.maxDistance = poses.distance * CITY_ZOOM_LIMITS.farthest;
  }, [controlsRef, poses.distance]);

  // Move to the requested view: straight away on first load or with reduced
  // motion, otherwise (view change, reset, resize) with an eased glide that
  // lands exactly on the pose, so there is no jump at the end.
  useEffect(() => {
    const destination = poses.views[view];

    if (!initialised.current || reducedMotion) {
      initialised.current = true;
      tween.current = null;
      applyPose(destination);
      settle();
      invalidate();
      return;
    }

    if (controlsRef.current) {
      controlsRef.current.enabled = false;
      lookAt.current.copy(controlsRef.current.target);
    }

    tween.current = {
      from: {
        position: camera.position.clone(),
        target: lookAt.current.clone(),
        fov: camera instanceof PerspectiveCamera ? camera.fov : destination.fov
      },
      to: destination,
      elapsed: 0
    };
    invalidate();
  }, [applyPose, camera, controlsRef, invalidate, poses, reducedMotion, resetSignal, settle, view]);

  useFrame((_, delta) => {
    const active = tween.current;
    if (!active) return;

    active.elapsed = Math.min(TWEEN_SECONDS, active.elapsed + Math.min(delta, 0.05));
    const progress = easeInOutCubic(active.elapsed / TWEEN_SECONDS);

    camera.position.lerpVectors(active.from.position, active.to.position, progress);
    lookAt.current.lerpVectors(active.from.target, active.to.target, progress);
    camera.lookAt(lookAt.current);
    if (camera instanceof PerspectiveCamera) {
      camera.fov = active.from.fov + (active.to.fov - active.from.fov) * progress;
      camera.updateProjectionMatrix();
    }

    if (active.elapsed >= TWEEN_SECONDS) {
      tween.current = null;
      settle();
    }

    invalidate();
  });

  return null;
}

/** Soft studio reflections so metal parts (camera housing) aren't black, without downloading an HDR. */
function StudioEnvironment({ intensity }: { intensity: number }) {
  const { gl, scene } = useThree();

  useEffect(() => {
    const generator = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const texture = generator.fromScene(room, 0.04).texture;
    const previous = scene.environment;
    const previousIntensity = scene.environmentIntensity;
    scene.environment = texture;
    scene.environmentIntensity = intensity;

    return () => {
      scene.environment = previous;
      scene.environmentIntensity = previousIntensity;
      texture.dispose();
      room.dispose();
      generator.dispose();
    };
  }, [gl, intensity, scene]);

  return null;
}

function MobilityCityMarkers({
  hoveredArea,
  selectedArea,
  locale,
  onAreaHover,
  onAreaSelect
}: {
  hoveredArea: MobilityArea | null;
  selectedArea: MobilityArea | null;
  locale: Locale;
  onAreaHover: (area: MobilityArea | null) => void;
  onAreaSelect: (area: MobilityArea) => void;
}) {
  if (selectedArea) {
    return null;
  }

  return (
    <>
      {MOBILITY_AREAS.map((area) => {
        const product = getMobilityCityProduct(area);
        const active = hoveredArea === area;

        return (
          <Html key={area} position={MOBILITY_MARKERS[area].position} center zIndexRange={[6, 0]} className="mobility-city-marker-host">
            <button
              type="button"
              className={`mobility-city-marker mobility-city-marker--${area} ${active ? "is-active" : ""}`}
              aria-label={pickMobilityText(locale, product.name)}
              onPointerEnter={() => onAreaHover(area)}
              onPointerLeave={() => onAreaHover(null)}
              onFocus={() => onAreaHover(area)}
              onBlur={() => onAreaHover(null)}
              onPointerDown={(event) => {
                event.stopPropagation();
                onAreaSelect(area);
              }}
              onClick={(event) => {
                event.stopPropagation();
                onAreaSelect(area);
              }}
            >
              <span className="mobility-city-marker__dot" aria-hidden="true" />
              <span className="mobility-city-marker__label">{pickMobilityText(locale, product.name)}</span>
            </button>
          </Html>
        );
      })}
    </>
  );
}

export function MobilityCityScene({
  hoveredArea,
  selectedArea,
  view,
  reducedMotion,
  resetSignal,
  onAreaHover,
  onAreaSelect,
  onStatusChange,
  showMarkers,
  locale
}: MobilityCitySceneProps) {
  const debug = process.env.NEXT_PUBLIC_DEBUG_MOBILITY_CITY === "true";
  const controlsRef = useRef<OrbitControllerHandle | null>(null);

  return (
    <>
      {/* Lighting: raise ambient / hemisphere for overall brightness, the
          directional light for the sun and shadows, and StudioEnvironment for
          reflections. Exposure is set on the renderer in MobilityCityCanvas. */}
      <ambientLight intensity={0.35} color="#f8fbff" />
      <hemisphereLight args={["#ffffff", "#cbdbe3", 0.95]} />
      <StudioEnvironment intensity={0.3} />
      <directionalLight
        castShadow
        position={[4.8, 7.2, -4.6]}
        intensity={2.6}
        color="#fff5ea"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-5.4}
        shadow-camera-right={5.4}
        shadow-camera-top={5.4}
        shadow-camera-bottom={-5.4}
        shadow-camera-near={0.2}
        shadow-camera-far={18}
        shadow-bias={-0.00022}
        shadow-normalBias={0.035}
      />
      <ContactShadows position={[0, -0.015, 0]} opacity={0.28} scale={8.5} blur={2.8} far={4.5} resolution={512} color="#52616a" frames={1} />
      <CameraController view={view} reducedMotion={reducedMotion} resetSignal={resetSignal} debug={debug} controlsRef={controlsRef} />
      <MobilityCityModel
        hoveredArea={hoveredArea}
        selectedArea={selectedArea}
        reducedMotion={reducedMotion}
        onAreaHover={onAreaHover}
        onAreaSelect={onAreaSelect}
        onStatusChange={onStatusChange}
      />
      <MobilityCityBoards locale={locale} reducedMotion={reducedMotion} />
      {showMarkers ? (
        <MobilityCityMarkers
          hoveredArea={hoveredArea}
          selectedArea={selectedArea}
          locale={locale}
          onAreaHover={onAreaHover}
          onAreaSelect={onAreaSelect}
        />
      ) : null}
      <OrbitControls
        ref={(controls) => {
          controlsRef.current = controls;
        }}
        enableDamping
        enablePan={false}
        enableZoom
        zoomSpeed={0.6}
        dampingFactor={0.08}
        rotateSpeed={0.35}
        minPolarAngle={0.95}
        maxPolarAngle={1.32}
        makeDefault
      />
    </>
  );
}
