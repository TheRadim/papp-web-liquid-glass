import type { Object3D } from "three";
import type { Locale } from "@/content/types";
import { withBasePath } from "@/lib/site/basePath";
import type { MobilityArea, MobilityView } from "@/types/mobility-city";

export const MOBILITY_CITY_MODEL_URL = withBasePath("/models/papp-city.glb");

export const CITY_OBJECT_NAMES = {
  base: "parking",
  sensors: "PappSensor",
  cameras: "PappCamera",
  insights: "PappInsights"
} as const;

export const CITY_OBJECT_AREA_ALIASES: Record<string, MobilityArea> = {
  "parking selectable": "sensors",
  "pappsensor selectable": "sensors",
  "papp sensor selectable": "sensors",
  "PappCamera selectable": "cameras",
  "pappcamera selectable": "cameras",
  "papp camera selectable": "cameras",
  "PappCamera pole": "cameras"
};

export const MOBILITY_AREAS: MobilityArea[] = ["sensors", "cameras", "insights"];

/**
 * Boxes (in scene units, from the GLB) that the overview camera must keep in
 * frame: the ground plate (plus its soft shadow) and the floating Insights
 * panel, with a little room for its pulse. The camera distance is fitted to the canvas aspect ratio so
 * the model fills the frame on wide and narrow screens alike.
 */
export const CITY_FRAMING_BOXES: { min: [number, number, number]; max: [number, number, number] }[] = [
  { min: [-3.3, 0, -3.25], max: [2.17, 0.08, 0.88] },
  // Soft contact shadow spilling past the ground plate, so it isn't cut by the frame.
  { min: [-3.6, 0, -3.55], max: [2.5, 0, 1.2] },
  { min: [-2.15, 1.0, -1.65], max: [-1.11, 1.66, -0.5] }
];

/** How much the visitor may zoom with the wheel or a pinch, relative to the fitted overview distance. */
export const CITY_ZOOM_LIMITS = { closest: 0.62, farthest: 1.18 };

/**
 * The +1 / -1 counters above the camera are faded in code: Blender animated
 * their opacity, which glTF cannot export, so the file only carries their
 * movement. Times are seconds on the 26 s baked timeline (Blender frame / 24).
 * Each window fades in at `in`, stays visible and fades out ending at `out`.
 */
export const CITY_COUNTER_FADES: Record<string, { in: number; out: number }[]> = {
  "+1 green": [{ in: 9.0, out: 11.2 }],
  "-1red": [{ in: 17.2, out: 19.6 }]
};

export const CITY_COUNTER_FADE_SECONDS = 0.35;


export const MOBILITY_AREA_ANCHORS: Record<MobilityArea, string> = {
  sensors: "solution-sensors",
  cameras: "solution-cameras",
  insights: "solution-insights"
};

export const MOBILITY_MARKERS: Record<MobilityArea, { position: [number, number, number] }> = {
  sensors: {
    position: [-0.89, 0.16, -1.14]
  },
  cameras: {
    position: [0.40, 0.68, -1.79]
  },
  insights: {
    position: [-1.62, 1.3, -1.05]
  }
};

export const CAMERA_VIEWS: Record<MobilityView, { position: [number, number, number]; target: [number, number, number]; fov: number }> = {
  overview: {
    position: [2.16, 2.32, -7.22],
    target: [-0.84, -0.1, -0.92],
    fov: 46
  },
  // Close-up on the far sensor (-0.89, -0.78): no car parks on it during the
  // animation, unlike the near one where the grey car parks.
  sensors: {
    position: [-0.36, 0.5, -1.56],
    target: [-0.89, 0.03, -0.8],
    fov: 36
  },
  cameras: {
    position: [0.8, 1.2, -3.1],
    target: [0.4, 0.45, -1.79],
    fov: 38
  },
  insights: {
    position: [0.02, 2.34, -2.16],
    target: [-1.86, 0.84, -1.46],
    fov: 44
  }
};

export function mobilityProductPath(locale: Locale, area: MobilityArea) {
  return `/${locale}/products/${area}`;
}

export function getMobilityAreaFromObject(object: Object3D): MobilityArea | null {
  let current: Object3D | null = object;

  while (current) {
    const normalizedName = current.name.trim().toLowerCase().replace(/[_-]+/g, " ");
    const alias = CITY_OBJECT_AREA_ALIASES[current.name] ?? CITY_OBJECT_AREA_ALIASES[normalizedName];

    if (alias) {
      return alias;
    }

    const area = MOBILITY_AREAS.find((candidate) => {
      const targetName = CITY_OBJECT_NAMES[candidate];
      return current?.name === targetName || current?.name.startsWith(`${targetName}_`);
    });

    if (area) {
      return area;
    }

    current = current.parent;
  }

  return null;
}
