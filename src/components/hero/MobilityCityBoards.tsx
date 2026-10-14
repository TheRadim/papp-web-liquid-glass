"use client";

/* eslint-disable react-hooks/immutability -- three.js objects are mutated per frame by design */

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  CylinderGeometry,
  Group,
  Line,
  LineDashedMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  QuadraticBezierCurve3,
  SphereGeometry,
  SRGBColorSpace,
  Vector3
} from "three";
import { CAMERA_VIEWS, CITY_BOARDS } from "@/config/mobility-city";
import type { Locale } from "@/content/types";
import { BOARD_CANVAS, drawHubTag, drawLiveBoard, drawStatsBoard, HUB_CANVAS } from "@/components/hero/mobilityCityBoardArt";
import { mobilityCityRuntime } from "@/components/hero/mobilityCityRuntime";

type Vec3 = [number, number, number];

const FLOW_DOTS = 3;
const FLOW_SPEED = 0.22;
const PULSE_SECONDS = 0.6;

/** Boards face the designed overview camera. */
const BOARD_YAW = (() => {
  const { position, target } = CAMERA_VIEWS.overview;
  return Math.atan2(position[0] - target[0], position[2] - target[2]);
})();

function ignoreRaycast(object: Object3D) {
  // Boards and flows are decoration: they must not catch hover or clicks.
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
  return { canvas, context: canvas.getContext("2d"), texture };
}

function makeBoard(position: Vec3, texture: CanvasTexture) {
  const [width, height] = CITY_BOARDS.size;
  const pole = CITY_BOARDS.pole;
  const depth = 0.035;
  const group = new Group();
  group.position.set(...position);
  group.rotation.y = BOARD_YAW;

  const body = new Mesh(new BoxGeometry(width, height, depth), new MeshStandardMaterial({ color: "#2a2f34", roughness: 0.6 }));
  body.position.y = pole + height / 2;
  body.castShadow = true;
  group.add(body);

  const face = new Mesh(new PlaneGeometry(width * 0.98, height * 0.98), new MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false }));
  face.position.set(0, pole + height / 2, depth / 2 + 0.001);
  group.add(face);

  const post = new Mesh(new CylinderGeometry(0.012, 0.012, pole, 12), new MeshStandardMaterial({ color: "#8a939a", metalness: 0.6, roughness: 0.4 }));
  post.position.y = pole / 2;
  post.castShadow = true;
  group.add(post);

  ignoreRaycast(group);
  return group;
}

interface Flow {
  curve: QuadraticBezierCurve3;
  dots: Mesh[];
}

/** A dashed arc with small dots travelling along it: data moving from a source to a target. */
function makeFlow(from: Vec3, to: Vec3, lift: number, color: string, parent: Group): Flow {
  const start = new Vector3(...from);
  const end = new Vector3(...to);
  const middle = start.clone().lerp(end, 0.5);
  middle.y += lift;
  const curve = new QuadraticBezierCurve3(start, middle, end);

  const line = new Line(
    new BufferGeometry().setFromPoints(curve.getPoints(48)),
    new LineDashedMaterial({ color, dashSize: 0.04, gapSize: 0.03, transparent: true, opacity: 0.7 })
  );
  line.computeLineDistances();
  parent.add(line);

  const dotGeometry = new SphereGeometry(0.018, 12, 8);
  const dotMaterial = new MeshBasicMaterial({ color, toneMapped: false });
  const dots = Array.from({ length: FLOW_DOTS }, (_, index) => {
    const dot = new Mesh(dotGeometry, dotMaterial);
    dot.position.copy(curve.getPoint((index + 0.5) / FLOW_DOTS));
    parent.add(dot);
    return dot;
  });

  return { curve, dots };
}

export function MobilityCityBoards({ locale, reducedMotion }: { locale: Locale; reducedMotion: boolean }) {
  const { invalidate } = useThree();
  const live = useMemo(() => makeCanvas(BOARD_CANVAS.width, BOARD_CANVAS.height), []);
  const stats = useMemo(() => makeCanvas(BOARD_CANVAS.width, BOARD_CANVAS.height), []);
  const hub = useMemo(() => makeCanvas(HUB_CANVAS.width, HUB_CANVAS.height), []);
  const shown = useRef<{ spots: number; pulse: boolean } | null>(null);
  const parked = useMemo(() => new Vector3(CITY_BOARDS.live.parkedAt[0], 0, CITY_BOARDS.live.parkedAt[1]), []);
  const carPosition = useMemo(() => new Vector3(), []);

  const scene = useMemo(() => {
    const root = new Group();
    const { pole, size } = CITY_BOARDS;
    const liveSpec = CITY_BOARDS.live;
    const statsSpec = CITY_BOARDS.stats;

    root.add(makeBoard(liveSpec.position, live.texture));
    root.add(makeBoard(statsSpec.position, stats.texture));

    const tag = new Mesh(new PlaneGeometry(...CITY_BOARDS.hub.tagSize), new MeshBasicMaterial({ map: hub.texture, transparent: true, toneMapped: false }));
    tag.position.set(...CITY_BOARDS.hub.tag);
    tag.rotation.y = BOARD_YAW;
    root.add(tag);

    const above = (position: Vec3, height: number): Vec3 => [position[0], position[1] + height, position[2]];
    const liveFoot = above(liveSpec.position, pole);
    const liveTop = above(liveSpec.position, pole + size[1]);
    const statsTop = above(statsSpec.position, pole + size[1]);

    const flowGroup = new Group();
    const flows = [
      ...liveSpec.sensors.map((sensor, index) => makeFlow(sensor, liveFoot, 0.22 + index * 0.04, "#46c86e", flowGroup)),
      makeFlow(statsSpec.camera, statsTop, 0.25, "#ff9f1a", flowGroup),
      makeFlow(liveTop, CITY_BOARDS.hub.inlet, 0.35, "#58bfe9", flowGroup),
      makeFlow(statsTop, CITY_BOARDS.hub.inlet, 0.6, "#58bfe9", flowGroup)
    ];
    root.add(flowGroup);
    ignoreRaycast(root);

    return { root, flows };
  }, [hub.texture, live.texture, stats.texture]);

  // Static faces: stats board and hub tag (redrawn when the language changes).
  useEffect(() => {
    if (stats.context) {
      drawStatsBoard(stats.context, CITY_BOARDS.stats.value, CITY_BOARDS.stats.bars, {
        title: CITY_BOARDS.stats.title[locale],
        source: CITY_BOARDS.stats.source[locale]
      });
      stats.texture.needsUpdate = true;
    }
    if (hub.context) {
      drawHubTag(hub.context, CITY_BOARDS.hub.text[locale]);
      hub.texture.needsUpdate = true;
    }
    shown.current = null;
    invalidate();
  }, [hub, invalidate, locale, stats]);

  useEffect(() => {
    return () => {
      scene.root.traverse((child) => {
        if (child instanceof Mesh || child instanceof Line) {
          child.geometry.dispose();
          const material = child.material as MeshBasicMaterial | MeshBasicMaterial[];
          (Array.isArray(material) ? material : [material]).forEach((item) => item.dispose());
        }
      });
      [live, stats, hub].forEach(({ texture }) => texture.dispose());
    };
  }, [hub, live, scene, stats]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Live board: one spot is taken while the grey car is parked on a sensor.
    const car = mobilityCityRuntime.greyCar;
    let carParked = false;
    if (car) {
      car.getWorldPosition(carPosition);
      carPosition.y = 0;
      carParked = carPosition.distanceTo(parked) < CITY_BOARDS.live.parkedRadius;
    }
    const spots = CITY_BOARDS.live.totalSpots - (carParked ? 1 : 0);
    const pulse = reducedMotion ? true : Math.floor(time / PULSE_SECONDS) % 2 === 0;

    if (live.context && (!shown.current || shown.current.spots !== spots || shown.current.pulse !== pulse)) {
      drawLiveBoard(live.context, spots, { title: CITY_BOARDS.live.title[locale], source: CITY_BOARDS.live.source[locale] }, pulse);
      live.texture.needsUpdate = true;
      shown.current = { spots, pulse };
      invalidate();
    }

    if (reducedMotion) return;

    scene.flows.forEach(({ curve, dots }, flowIndex) => {
      dots.forEach((dot, index) => {
        const progress = (time * FLOW_SPEED + index / dots.length + flowIndex * 0.13) % 1;
        curve.getPoint(progress, dot.position);
        // Grow in at the source, shrink into the target.
        dot.scale.setScalar(Math.min(1, progress * 6, (1 - progress) * 6));
      });
    });
  });

  return <primitive object={scene.root} />;
}
