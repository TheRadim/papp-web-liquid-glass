"use client";

/* eslint-disable react-hooks/immutability -- three.js objects are mutated per frame by design */

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BoxGeometry,
  CanvasTexture,
  CylinderGeometry,
  Group,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  QuadraticBezierCurve3,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Texture,
  TubeGeometry,
  Vector3
} from "three";
import { CAMERA_VIEWS, CITY_DATA } from "@/config/mobility-city";
import type { Locale } from "@/content/types";
import { DASHBOARD_CANVAS, drawFreeSign, drawGlow, drawInsightsDashboard, SIGN_CANVAS, type DashboardState } from "@/components/hero/mobilityCityBoardArt";
import { mobilityCityRuntime } from "@/components/hero/mobilityCityRuntime";

type Vec3 = [number, number, number];

const TRAIL = 14;
const DASHBOARD_FPS = 8;
const HISTORY_LENGTH = 36;

/** The sign faces the designed overview camera. */
const FACING_YAW = (() => {
  const { position, target } = CAMERA_VIEWS.overview;
  return Math.atan2(position[0] - target[0], position[2] - target[2]);
})();

function ignoreRaycast(object: Object3D) {
  // Decoration only: never catches hover or clicks.
  object.traverse((child) => {
    child.raycast = () => undefined;
  });
}

function makeCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return { context: canvas.getContext("2d"), texture };
}

function makeSign(texture: Texture) {
  const { position, size, pole } = CITY_DATA.sign;
  const [width, height] = size;
  const depth = 0.022;
  const group = new Group();
  group.position.set(...position);
  group.rotation.y = FACING_YAW;

  const body = new Mesh(new BoxGeometry(width, height, depth), new MeshStandardMaterial({ color: "#2a2f34", roughness: 0.6 }));
  body.position.y = pole + height / 2;
  body.castShadow = true;
  group.add(body);

  const face = new Mesh(new PlaneGeometry(width * 0.98, height * 0.96), new MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false }));
  face.position.set(0, pole + height / 2, depth / 2 + 0.001);
  group.add(face);

  const post = new Mesh(new CylinderGeometry(0.008, 0.008, pole, 10), new MeshStandardMaterial({ color: "#8a939a", metalness: 0.6, roughness: 0.4 }));
  post.position.y = pole / 2;
  post.castShadow = true;
  group.add(post);

  return group;
}

interface Beam {
  curve: QuadraticBezierCurve3;
  tube: Mesh;
  trail: Sprite[];
  duration: number;
  /** Seconds since the pulse left; null when idle. */
  progress: number | null;
  onArrive: (() => void) | null;
  lastPulse: number;
  heartbeatOffset: number;
}

/**
 * An airy, barely-there beam with a soft comet of light that travels along it
 * now and then: data being sent from a source to where it's shown.
 */
function makeBeam(from: Vec3, to: Vec3, lift: number, color: string, duration: number, glow: Texture, parent: Group, heartbeatOffset: number): Beam {
  const start = new Vector3(...from);
  const end = new Vector3(...to);
  const middle = start.clone().lerp(end, 0.5);
  middle.y += lift;
  const curve = new QuadraticBezierCurve3(start, middle, end);

  const tube = new Mesh(new TubeGeometry(curve, 48, 0.0045, 6, false), new MeshBasicMaterial({ color, transparent: true, opacity: 0.14, depthWrite: false }));
  parent.add(tube);

  const trail = Array.from({ length: TRAIL }, (_, index) => {
    const sprite = new Sprite(new SpriteMaterial({ map: glow, color, transparent: true, depthWrite: false, opacity: 0 }));
    const fade = 1 - index / TRAIL;
    sprite.scale.setScalar(0.075 * (0.35 + 0.65 * fade));
    sprite.visible = false;
    parent.add(sprite);
    return sprite;
  });

  return { curve, tube, trail, duration, progress: null, onArrive: null, lastPulse: 0, heartbeatOffset };
}

function sendPulse(beam: Beam, time: number, onArrive: (() => void) | null) {
  // A new pulse on a busy beam delivers the previous one straight away.
  beam.onArrive?.();
  beam.progress = 0;
  beam.onArrive = onArrive;
  beam.lastPulse = time;
}

function updateBeam(beam: Beam, delta: number, scratch: Vector3) {
  if (beam.progress === null) return;
  beam.progress += delta / beam.duration;
  const head = beam.progress;

  beam.trail.forEach((sprite, index) => {
    const along = head - index * 0.022;
    if (along < 0 || along > 1) {
      sprite.visible = false;
      return;
    }
    beam.curve.getPoint(along, scratch);
    sprite.position.copy(scratch);
    sprite.visible = true;
    const edgeFade = Math.min(1, along * 8, (1 - along) * 8);
    (sprite.material as SpriteMaterial).opacity = 0.55 * (1 - index / TRAIL) * edgeFade;
  });

  if (head - TRAIL * 0.022 > 1) {
    beam.progress = null;
    beam.trail.forEach((sprite) => (sprite.visible = false));
  }
  if (head >= 1 && beam.onArrive) {
    const arrive = beam.onArrive;
    beam.onArrive = null;
    arrive();
  }
}

function crossed(previous: number, current: number, at: number) {
  // Handles the timeline wrapping from 26 s back to 0.
  return previous <= current ? previous < at && at <= current : previous < at || at <= current;
}

export function MobilityCityDataLayer({ locale, reducedMotion }: { locale: Locale; reducedMotion: boolean }) {
  const { invalidate } = useThree();
  const sign = useMemo(() => makeCanvas(SIGN_CANVAS.width, SIGN_CANVAS.height), []);
  const dashboard = useMemo(() => {
    const canvas = makeCanvas(DASHBOARD_CANVAS.width, DASHBOARD_CANVAS.height);
    // The panel is a glTF mesh: its UVs expect an un-flipped image.
    canvas.texture.flipY = false;
    return canvas;
  }, []);
  const glow = useMemo(() => {
    const canvas = makeCanvas(64, 64);
    if (canvas.context) drawGlow(canvas.context, 64);
    canvas.texture.needsUpdate = true;
    return canvas.texture;
  }, []);

  const scene = useMemo(() => {
    const root = new Group();
    root.add(makeSign(sign.texture));

    const { sensors } = CITY_DATA.frontLot;
    const signTop: Vec3 = [CITY_DATA.sign.position[0], CITY_DATA.sign.position[1] + CITY_DATA.sign.pole + CITY_DATA.sign.size[1], CITY_DATA.sign.position[2]];
    const beams = new Group();
    const sensorToSign = makeBeam(sensors, signTop, 0.18, "#3fbf86", 0.8, glow, beams, 0);
    const sensorToInsights = makeBeam(sensors, CITY_DATA.insightsInlet, 0.42, "#3fa9e0", 1.5, glow, beams, 2.3);
    const cameraToInsights = makeBeam(CITY_DATA.camera.position, CITY_DATA.insightsInlet, 0.5, "#3fa9e0", 1.7, glow, beams, 4.6);
    root.add(beams);
    ignoreRaycast(root);

    return { root, beams: { sensorToSign, sensorToInsights, cameraToInsights } };
  }, [glow, sign.texture]);

  const live = useRef({
    measuredParked: null as boolean | null,
    signFree: CITY_DATA.frontLot.totalSpots,
    frontParked: false,
    frontOccupancy: 0,
    vehicles: CITY_DATA.camera.startCount,
    entries: CITY_DATA.camera.startEntries,
    history: [] as number[],
    lastSample: -1,
    lastDraw: -1,
    lastTimeline: 0,
    flashFront: 0,
    flashMain: 0,
    drawnSign: -1
  });
  const parkedSpot = useMemo(() => new Vector3(CITY_DATA.frontLot.parkedAt[0], 0, CITY_DATA.frontLot.parkedAt[1]), []);
  const scratch = useMemo(() => new Vector3(), []);

  // Put the live dashboard on the Insights panel in place of the static art.
  useEffect(() => {
    let restore: (() => void) | null = null;
    let attempts = 0;
    const attach = () => {
      const panel = mobilityCityRuntime.insightsPanel;
      if (!panel) {
        if (attempts++ < 60) handle = window.setTimeout(attach, 100);
        return;
      }
      const swapped: { material: MeshStandardMaterial; map: Texture | null }[] = [];
      panel.traverse((child) => {
        if (!(child instanceof Mesh)) return;
        (Array.isArray(child.material) ? child.material : [child.material]).forEach((material: Material) => {
          const standard = material as MeshStandardMaterial;
          if (!standard.map) return;
          swapped.push({ material: standard, map: standard.map });
          standard.map = dashboard.texture;
          standard.needsUpdate = true;
        });
      });
      restore = () => {
        swapped.forEach(({ material, map }) => {
          material.map = map;
          material.needsUpdate = true;
        });
      };
      invalidate();
    };
    let handle = window.setTimeout(attach, 0);
    return () => {
      window.clearTimeout(handle);
      restore?.();
    };
  }, [dashboard.texture, invalidate]);

  useEffect(() => {
    live.current.drawnSign = -1;
    live.current.lastDraw = -1;
  }, [locale]);

  useEffect(() => {
    return () => {
      scene.root.traverse((child) => {
        if (child instanceof Mesh || child instanceof Sprite) {
          child.geometry.dispose();
          (child.material as Material).dispose();
        }
      });
      [sign.texture, dashboard.texture, glow].forEach((texture) => texture.dispose());
    };
  }, [dashboard.texture, glow, scene, sign.texture]);

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();
    const state = live.current;
    const { sensorToSign, sensorToInsights, cameraToInsights } = scene.beams;
    const animate = !reducedMotion && mobilityCityRuntime.animating;
    const step = Math.min(delta, 0.1);

    // Front lot: is the grey car parked on its sensor spot?
    const car = mobilityCityRuntime.greyCar;
    let parked = false;
    if (car) {
      car.getWorldPosition(scratch);
      scratch.y = 0;
      parked = scratch.distanceTo(parkedSpot) < CITY_DATA.frontLot.parkedRadius;
    }
    const free = CITY_DATA.frontLot.totalSpots - (parked ? 1 : 0);

    if (state.measuredParked === null || !animate) {
      state.measuredParked = parked;
      state.signFree = free;
      state.frontParked = parked;
    } else if (parked !== state.measuredParked) {
      // The sensor reports the change: the sign and Insights update when the pulse arrives.
      state.measuredParked = parked;
      sendPulse(sensorToSign, time, () => {
        state.signFree = free;
      });
      sendPulse(sensorToInsights, time, () => {
        state.frontParked = parked;
        state.flashFront = 1;
      });
    }

    // Main lot: the camera counts cars in (+1) and out (-1).
    const timeline = mobilityCityRuntime.timelineTime;
    if (animate) {
      CITY_DATA.camera.events.forEach(({ at, delta: change }) => {
        if (!crossed(state.lastTimeline, timeline, at)) return;
        sendPulse(cameraToInsights, time, () => {
          state.vehicles += change;
          if (change > 0) state.entries += 1;
          state.flashMain = 1;
        });
      });

      // Occasional quiet heartbeat so the links read as live even between events.
      [sensorToSign, sensorToInsights, cameraToInsights].forEach((beam) => {
        if (beam.progress === null && time - beam.lastPulse > CITY_DATA.heartbeatSeconds + beam.heartbeatOffset) {
          sendPulse(beam, time, null);
          beam.heartbeatOffset = (beam.heartbeatOffset * 1.7 + 1.3) % 5;
        }
      });
      [sensorToSign, sensorToInsights, cameraToInsights].forEach((beam) => updateBeam(beam, step, scratch));
    }
    state.lastTimeline = timeline;

    // Sign
    if (sign.context && state.drawnSign !== state.signFree) {
      drawFreeSign(sign.context, state.signFree, CITY_DATA.sign.label[locale]);
      sign.texture.needsUpdate = true;
      state.drawnSign = state.signFree;
      invalidate();
    }

    // Dashboard values
    const targetOccupancy = state.frontParked ? 1 / CITY_DATA.frontLot.totalSpots : 0;
    state.frontOccupancy += (targetOccupancy - state.frontOccupancy) * Math.min(1, step * (animate ? 4 : 60));
    state.flashFront = Math.max(0, state.flashFront - step * 1.2);
    state.flashMain = Math.max(0, state.flashMain - step * 1.2);
    if (state.lastSample < 0 || time - state.lastSample >= 1) {
      state.history.push(state.vehicles);
      if (state.history.length > HISTORY_LENGTH) state.history.shift();
      if (state.history.length === 1) for (let fill = 1; fill < HISTORY_LENGTH; fill += 1) state.history.push(state.vehicles);
      state.lastSample = time;
    } else {
      state.history[state.history.length - 1] = state.vehicles;
    }

    if (dashboard.context && (state.lastDraw < 0 || (animate && time - state.lastDraw >= 1 / DASHBOARD_FPS))) {
      const labels = CITY_DATA.labels;
      const view: DashboardState = {
        frontOccupancy: state.frontOccupancy,
        frontFree: CITY_DATA.frontLot.totalSpots - (state.frontParked ? 1 : 0),
        frontTotal: CITY_DATA.frontLot.totalSpots,
        history: state.history,
        vehicles: state.vehicles,
        entries: state.entries,
        flashFront: state.flashFront,
        flashMain: state.flashMain,
        livePulse: Math.floor(time / 0.8) % 2 === 0,
        labels: {
          title: labels.title[locale],
          live: labels.live[locale],
          free: labels.free[locale],
          frontLot: labels.frontLot[locale],
          mainLot: labels.mainLot[locale],
          vehicles: labels.vehicles[locale],
          entries: labels.entries[locale],
          updated: labels.updated[locale]
        }
      };
      drawInsightsDashboard(dashboard.context, view);
      dashboard.texture.needsUpdate = true;
      state.lastDraw = time;
      invalidate();
    }
  });

  return <primitive object={scene.root} />;
}
