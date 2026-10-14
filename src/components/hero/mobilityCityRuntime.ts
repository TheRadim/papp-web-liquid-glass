import type { Object3D } from "three";

/**
 * Shared state between the city model and the live data layer, read every
 * frame without re-rendering React: the animated grey car, the floating
 * Insights panel and the current time on the baked animation timeline.
 */
export const mobilityCityRuntime: {
  greyCar: Object3D | null;
  insightsPanel: Object3D | null;
  timelineTime: number;
  animating: boolean;
} = {
  greyCar: null,
  insightsPanel: null,
  timelineTime: 0,
  animating: false
};
