export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 800;
export const GROUND_Y = 710;
export const BIRD_X = 60;
export const BIRD_START_Y = 400;
export const BIRD_HITBOX_WIDTH = 45;
export const BIRD_HITBOX_HEIGHT = 30;
export const PIPE_WIDTH = 85;
export const PIPE_HEIGHT = 640;
export const PIPE_GAP = 200;
export const PIPE_SPACING = 480;
export const PIPE_SPAWN_INTERVAL_FRAMES = 90;
export const PIPE_SPAWN_X = 500;
export const PIPE_GAP_MIN_Y = 160;
export const PIPE_GAP_MAX_Y = 480;
export const GRAVITY = 1.25;
export const JUMP_VELOCITY = -11.25;
export const PIPE_SPEED = 5.33;
export const FIXED_STEP_MS = 1000 / 60;
export const HITBOX_SHRINK = 0;
export const MAX_FRAME_DELTA_MS = 250;
export const GROUND_SPEED = PIPE_SPEED;
export const CLOUD_SPEED = 0.35;
export const CITY_SPEED = 1.1;
export const BUSH_SPEED = 2.1;
export const OPTIONAL_OBSTACLE_FREQUENCY = 0;
export const BACKDROP_WIDTH = GAME_WIDTH;
export const GROUND_PATTERN_WIDTH = 48;
export const GROUND_PATTERN_HEIGHT = 23;
export const DEATH_PARTICLE_COUNT = 12;
export const DEATH_PARTICLE_GRAVITY = 0.35;
export const DEATH_PARTICLE_LIFETIME_FRAMES = 48;
export const DEATH_PARTICLE_SIZE = 6;

export const COLORS = {
  sky: '#65d7ed',
  ground: '#fddb7e',
  grass: '#7dce43',
  grassLight: '#b7e747',
  pipe: '#76c83c',
  pipeDark: '#386d32',
  ink: '#342c26',
  cream: '#fde8a0',
  orange: '#f28b32',
} as const;

// Equivalent measurements in the 360x640 reference viewport: gravity 1 px/frame²,
// flap -9 px/frame, pipe speed 4 px/frame, gap 160 px, gap-top range 128–384 px,
// floor y=568 and 360 px between pipes (90 frames at 60 Hz). They are measured
// gameplay targets, not claims about the original game's internal source constants.
