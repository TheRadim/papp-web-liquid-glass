import type { Object3D } from "three";

/**
 * Small shared state between the city model and the boards: the model
 * registers the animated grey car here so the live board can read whether it
 * is parked, without re-rendering React every frame.
 */
export const mobilityCityRuntime: { greyCar: Object3D | null } = {
  greyCar: null
};
