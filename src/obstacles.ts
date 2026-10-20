export interface OptionalObstacle {
  id: string;
  sprite: string;
  hitbox: { width: number; height: number };
  frequency: number;
}

// Extra obstacle spawns are disabled until their presence and frequency are
// verified against the reference game.
export const OPTIONAL_OBSTACLES: OptionalObstacle[] = [];
export const OPTIONAL_OBSTACLE_FREQUENCY = 0;
