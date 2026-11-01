"use client";

import { useEffect, useRef } from "react";
import { withBasePath } from "@/lib/site/basePath";

type RoadKind = "major" | "secondary" | "road" | "ferry" | "local";

interface TrafficMapData {
  bounds: [number, number, number, number];
  outline: [number, number][][];
  roads: { k: RoadKind; p: [number, number][] }[];
}

interface Road {
  kind: RoadKind;
  points: [number, number][];
  cumulative: number[];
  length: number;
}

interface Vehicle {
  road: number;
  distance: number;
  speed: number;
  direction: 1 | -1;
  color: [number, number, number];
  size: number;
  age: number;
}

// How often each road class gets traffic, relative to its length.
const TRAFFIC_WEIGHT: Record<RoadKind, number> = {
  major: 9,
  secondary: 4,
  road: 2.4,
  ferry: 0.4,
  local: 0
};

// Kept very light: the outline carries the map, roads are only a hint.
const ROAD_STYLE: Record<RoadKind, { stroke: string; width: number }> = {
  major: { stroke: "rgba(126, 141, 156, 0.13)", width: 1 },
  secondary: { stroke: "rgba(126, 141, 156, 0.08)", width: 0.8 },
  road: { stroke: "rgba(126, 141, 156, 0.05)", width: 0.7 },
  ferry: { stroke: "rgba(0, 126, 181, 0.08)", width: 0.7 },
  local: { stroke: "rgba(0, 0, 0, 0)", width: 0 }
};

// Vehicle colours as RGB; trails fade from the head back.
const VEHICLE_COLORS: [number, number, number][] = [
  [0, 140, 205],
  [0, 140, 205],
  [0, 140, 205],
  [251, 120, 110]
];
const TRAIL_LENGTH = 16; // map units behind the head
const TRAIL_STEPS = 6;
// Dots fade in where a trip starts and dim slowly over its last stretch.
const FADE_SECONDS = 1.6;

function prepareRoads(data: TrafficMapData): Road[] {
  return data.roads.map((road) => {
    const cumulative = [0];

    for (let index = 1; index < road.p.length; index += 1) {
      const [x1, y1] = road.p[index - 1];
      const [x2, y2] = road.p[index];
      cumulative.push(cumulative[index - 1] + Math.hypot(x2 - x1, y2 - y1));
    }

    return { kind: road.k, points: road.p, cumulative, length: cumulative[cumulative.length - 1] };
  });
}

function pointAt(road: Road, distance: number): [number, number] {
  const { cumulative, points } = road;
  let low = 0;
  let high = cumulative.length - 1;

  while (high - low > 1) {
    const middle = (low + high) >> 1;

    if (cumulative[middle] <= distance) {
      low = middle;
    } else {
      high = middle;
    }
  }

  const span = cumulative[high] - cumulative[low] || 1;
  const t = Math.min(1, Math.max(0, (distance - cumulative[low]) / span));
  const [x1, y1] = points[low];
  const [x2, y2] = points[high];

  return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
}

/**
 * Quiet hero background: an outline of Denmark with its road network, and
 * small dots travelling along the roads to suggest live traffic data.
 */
export function HeroTrafficMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const context = canvas?.getContext("2d", { alpha: true });

    if (!canvas || !parent || !context) {
      return;
    }

    const canvasElement = canvas;
    const parentElement = parent;
    const drawingContext = context;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const abort = new AbortController();
    let data: TrafficMapData | null = null;
    let roads: Road[] = [];
    let vehicles: Vehicle[] = [];
    let pickTable: number[] = [];
    let pickTotal = 0;
    let base: HTMLCanvasElement | null = null;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let frame = 0;
    let lastTime = 0;
    let isVisible = true;

    function pickRoad() {
      const target = Math.random() * pickTotal;
      let low = 0;
      let high = pickTable.length - 1;

      while (low < high) {
        const middle = (low + high) >> 1;

        if (pickTable[middle] < target) {
          low = middle + 1;
        } else {
          high = middle;
        }
      }

      return low;
    }

    function spawn(anywhere: boolean): Vehicle {
      const road = pickRoad();
      const roadLength = roads[road].length;
      const direction = Math.random() < 0.5 ? 1 : -1;
      const kind = roads[road].kind;
      const fast = kind === "major" ? 1.6 : kind === "ferry" ? 0.45 : 1;

      return {
        road,
        distance: anywhere ? Math.random() * roadLength : direction === 1 ? 0 : roadLength,
        speed: (9 + Math.random() * 10) * fast,
        direction,
        color: VEHICLE_COLORS[Math.floor(Math.random() * VEHICLE_COLORS.length)],
        size: kind === "major" ? 2 : 1.6,
        age: anywhere ? FADE_SECONDS : 0
      };
    }

    function project([x, y]: [number, number]): [number, number] {
      return [offsetX + x * scale, offsetY + y * scale];
    }

    function drawBase() {
      if (!data) {
        return;
      }

      base = document.createElement("canvas");
      base.width = Math.floor(width * pixelRatio);
      base.height = Math.floor(height * pixelRatio);
      const baseContext = base.getContext("2d");

      if (!baseContext) {
        return;
      }

      baseContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      baseContext.lineJoin = "round";
      baseContext.lineCap = "round";

      baseContext.beginPath();
      for (const shape of data.outline) {
        shape.forEach((point, index) => {
          const [x, y] = project(point);
          if (index === 0) {
            baseContext.moveTo(x, y);
          } else {
            baseContext.lineTo(x, y);
          }
        });
        baseContext.closePath();
      }
      baseContext.fillStyle = "rgba(244, 247, 249, 0.4)";
      baseContext.fill();
      baseContext.strokeStyle = "rgba(150, 162, 174, 0.34)";
      baseContext.lineWidth = 1;
      baseContext.stroke();

      for (const kind of ["ferry", "road", "secondary", "major"] as RoadKind[]) {
        baseContext.beginPath();
        for (const road of roads) {
          if (road.kind !== kind) {
            continue;
          }
          road.points.forEach((point, index) => {
            const [x, y] = project(point);
            if (index === 0) {
              baseContext.moveTo(x, y);
            } else {
              baseContext.lineTo(x, y);
            }
          });
        }
        baseContext.setLineDash(kind === "ferry" ? [3, 4] : []);
        baseContext.strokeStyle = ROAD_STYLE[kind].stroke;
        baseContext.lineWidth = ROAD_STYLE[kind].width;
        baseContext.stroke();
      }
    }

    function resize() {
      const rect = parentElement.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvasElement.width = Math.floor(width * pixelRatio);
      canvasElement.height = Math.floor(height * pixelRatio);
      canvasElement.style.width = `${width}px`;
      canvasElement.style.height = `${height}px`;
      drawingContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drawingContext.lineCap = "round";

      if (!data) {
        return;
      }

      // Fit the whole country into the hero with breathing room. On narrow
      // screens, fit the mainland (Jutland to Zealand) to the width instead and
      // let Bornholm fall off the edge, so the map doesn't shrink to a stamp.
      const [minX, minY, maxX, maxY] = data.bounds;
      const mapWidth = maxX - minX;
      const mapHeight = maxY - minY;

      if (width < 760) {
        scale = Math.min((width * 1.05) / mapWidth, (height * 0.72) / mapHeight);
        offsetX = (width - mapWidth * scale) / 2 - minX * scale;
      } else {
        // Large and quiet: the country runs nearly the full height of the hero.
        scale = Math.min((width * 0.9) / mapWidth, (height * 1.02) / mapHeight);
        offsetX = (width - mapWidth * scale) / 2 - minX * scale;
      }
      offsetY = (height - mapHeight * scale) / 2 - minY * scale + height * 0.02;

      const vehicleCount = Math.round(Math.min(70, Math.max(30, (width * height) / 20000)));
      vehicles = Array.from({ length: vehicleCount }, () => spawn(true));
      drawBase();
      render(0);
    }

    function render(delta: number) {
      drawingContext.clearRect(0, 0, width, height);

      if (base) {
        drawingContext.drawImage(base, 0, 0, width, height);
      }

      for (let index = 0; index < vehicles.length; index += 1) {
        let vehicle = vehicles[index];
        const road = roads[vehicle.road];
        vehicle.distance += vehicle.speed * vehicle.direction * delta;
        vehicle.age += delta;

        if (vehicle.distance < 0 || vehicle.distance > road.length) {
          vehicle = spawn(false);
          vehicles[index] = vehicle;
        }

        const current = roads[vehicle.road];
        const [red, green, blue] = vehicle.color;
        const [x, y] = project(pointAt(current, vehicle.distance));
        const remaining = vehicle.direction === 1 ? current.length - vehicle.distance : vehicle.distance;
        const fadeIn = Math.min(1, vehicle.age / FADE_SECONDS);
        const fadeOut = Math.min(1, remaining / (vehicle.speed * FADE_SECONDS));
        const visibility = Math.max(0, Math.min(fadeIn, fadeOut));
        if (visibility <= 0.01) continue;

        // Fading trail: short segments behind the head, each fainter and thinner.
        let [previousX, previousY] = [x, y];
        for (let step = 1; step <= TRAIL_STEPS; step += 1) {
          const back = Math.min(current.length, Math.max(0, vehicle.distance - vehicle.direction * (TRAIL_LENGTH * step) / TRAIL_STEPS));
          const [trailX, trailY] = project(pointAt(current, back));
          const fade = 1 - step / (TRAIL_STEPS + 1);
          drawingContext.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${0.26 * fade * visibility})`;
          drawingContext.lineWidth = vehicle.size * 1.5 * fade + 0.4;
          drawingContext.beginPath();
          drawingContext.moveTo(previousX, previousY);
          drawingContext.lineTo(trailX, trailY);
          drawingContext.stroke();
          [previousX, previousY] = [trailX, trailY];
        }

        // Soft glow, then the head.
        drawingContext.fillStyle = `rgba(${red}, ${green}, ${blue}, ${0.08 * visibility})`;
        drawingContext.beginPath();
        drawingContext.arc(x, y, vehicle.size * 3, 0, Math.PI * 2);
        drawingContext.fill();
        drawingContext.fillStyle = `rgba(${red}, ${green}, ${blue}, ${0.5 * visibility})`;
        drawingContext.beginPath();
        drawingContext.arc(x, y, vehicle.size, 0, Math.PI * 2);
        drawingContext.fill();
      }

      drawingContext.globalAlpha = 1;
    }

    function tick(time: number) {
      frame = window.requestAnimationFrame(tick);

      // ~30 fps is plenty for slow traffic and keeps the hero cheap.
      if (!isVisible || document.hidden || time - lastTime < 32) {
        if (!isVisible || document.hidden) {
          lastTime = time;
        }
        return;
      }

      const delta = lastTime ? Math.min(0.1, (time - lastTime) / 1000) : 0;
      lastTime = time;
      render(delta);
    }

    function start() {
      window.cancelAnimationFrame(frame);
      lastTime = 0;

      if (!reducedMotion.matches) {
        frame = window.requestAnimationFrame(tick);
      } else {
        render(0);
      }
    }

    fetch(withBasePath("/data/denmark-traffic.json"), { signal: abort.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((json: TrafficMapData) => {
        data = json;
        roads = prepareRoads(json);
        pickTable = [];
        pickTotal = 0;
        for (const road of roads) {
          pickTotal += road.length * TRAFFIC_WEIGHT[road.kind];
          pickTable.push(pickTotal);
        }
        resize();
        parentElement.classList.add("is-ready");
        start();
      })
      .catch(() => {
        // The hero stays plain white if the map can't load.
      });

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? true;
    });
    const resizeObserver = new ResizeObserver(() => resize());

    observer.observe(parentElement);
    resizeObserver.observe(parentElement);
    reducedMotion.addEventListener("change", start);

    return () => {
      abort.abort();
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      reducedMotion.removeEventListener("change", start);
    };
  }, []);

  return (
    <div className="hero-motion-field hero-traffic-map" aria-hidden="true">
      <canvas className="hero-wave-canvas" ref={canvasRef} />
    </div>
  );
}
