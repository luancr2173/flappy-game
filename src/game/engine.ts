import {
  BIRD_HITBOX_HEIGHT,
  BIRD_HITBOX_WIDTH,
  BIRD_START_Y,
  BIRD_X,
  BACKDROP_WIDTH,
  BUSH_SPEED,
  CITY_SPEED,
  CLOUD_SPEED,
  DEATH_PARTICLE_COUNT,
  DEATH_PARTICLE_GRAVITY,
  DEATH_PARTICLE_LIFETIME_FRAMES,
  FIXED_STEP_MS,
  GROUND_Y,
  GROUND_PATTERN_WIDTH,
  GRAVITY,
  HITBOX_SHRINK,
  JUMP_VELOCITY,
  MAX_FRAME_DELTA_MS,
  PIPE_GAP,
  PIPE_GAP_MAX_Y,
  PIPE_GAP_MIN_Y,
  PIPE_SPAWN_X,
  PIPE_SPEED,
  PIPE_SPAWN_INTERVAL_FRAMES,
  PIPE_WIDTH,
} from '../config';
import { GameAudio } from './audio';

export type GameState = 'MENU' | 'GET_READY' | 'JOGANDO' | 'GAME_OVER';

export interface PipePair {
  x: number;
  gapTop: number;
  scored: boolean;
}

export interface DeathParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export interface GameSnapshot {
  state: GameState;
  score: number;
  best: number;
  newBest: boolean;
  muted: boolean;
}

const BEST_KEY = 'flappy-rola-best';

function readBest(): number {
  try {
    const value = Number(localStorage.getItem(BEST_KEY));
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch (error) {
    console.warn('Unable to read saved high score.', error);
    return 0;
  }
}

export class GameEngine {
  state: GameState = 'MENU';
  score = 0;
  best = readBest();
  newBest = false;
  birdY = BIRD_START_Y;
  birdVelocity = 0;
  birdRotation = 0;
  animationTime = 0;
  groundOffset = 0;
  cloudOffset = 0;
  cityOffset = 0;
  bushOffset = 0;
  pipes: PipePair[] = [];
  particles: DeathParticle[] = [];
  private tickCount = 0;
  private accumulator = 0;
  private lastTime = 0;
  private paused = false;
  private audio = new GameAudio();
  private onChange: (snapshot: GameSnapshot) => void;

  constructor(onChange: (snapshot: GameSnapshot) => void) {
    this.onChange = onChange;
    this.emit();
  }

  setOnChange(onChange: (snapshot: GameSnapshot) => void): void {
    this.onChange = onChange;
  }

  snapshot(): GameSnapshot {
    return { state: this.state, score: this.score, best: this.best, newBest: this.newBest, muted: this.audio.muted };
  }

  private emit(): void {
    this.onChange(this.snapshot());
  }

  startReady(): void {
    this.resetRun();
    this.state = 'GET_READY';
    this.audio.unlock();
    this.audio.play('ready');
    this.emit();
  }

  returnToMenu(): void {
    this.state = 'MENU';
    this.emit();
  }

  toggleMute(): void {
    this.audio.toggleMute();
    this.emit();
  }

  private resetRun(): void {
    this.score = 0;
    this.newBest = false;
    this.birdY = BIRD_START_Y;
    this.birdVelocity = 0;
    this.birdRotation = 0;
    this.tickCount = 0;
    this.pipes = [];
    this.particles = [];
    this.accumulator = 0;
  }

  flap(): void {
    this.audio.unlock();
    if (this.state === 'MENU') {
      this.startReady();
      this.flap();
      return;
    }
    if (this.state === 'GET_READY') {
      this.state = 'JOGANDO';
      this.birdVelocity = JUMP_VELOCITY;
      this.audio.play('flap');
      this.emit();
      return;
    }
    if (this.state === 'JOGANDO') {
      this.birdVelocity = JUMP_VELOCITY;
      this.audio.play('flap');
      return;
    }
    if (this.state === 'GAME_OVER') this.startReady();
  }

  frame(now: number): void {
    if (this.paused) {
      this.lastTime = now;
      return;
    }
    if (!this.lastTime) this.lastTime = now;
    const delta = Math.min(now - this.lastTime, MAX_FRAME_DELTA_MS);
    this.lastTime = now;
    this.animationTime += delta;
    this.accumulator += delta;
    while (this.accumulator >= FIXED_STEP_MS) {
      this.step();
      this.accumulator -= FIXED_STEP_MS;
    }
  }

  pauseClock(): void {
    this.lastTime = 0;
    this.accumulator = 0;
  }

  setPaused(paused: boolean): void {
    this.paused = paused;
    this.pauseClock();
  }

  private step(): void {
    if (this.state === 'MENU') {
      this.groundOffset = (this.groundOffset + 1) % GROUND_PATTERN_WIDTH;
      this.cloudOffset = (this.cloudOffset + CLOUD_SPEED) % BACKDROP_WIDTH;
      this.cityOffset = (this.cityOffset + CITY_SPEED) % BACKDROP_WIDTH;
      this.bushOffset = (this.bushOffset + BUSH_SPEED) % BACKDROP_WIDTH;
      return;
    }
    if (this.state === 'GET_READY') {
      this.birdY = BIRD_START_Y + Math.sin(this.animationTime / 210) * 9;
      this.groundOffset = (this.groundOffset + PIPE_SPEED) % GROUND_PATTERN_WIDTH;
      this.cloudOffset = (this.cloudOffset + CLOUD_SPEED) % BACKDROP_WIDTH;
      this.cityOffset = (this.cityOffset + CITY_SPEED) % BACKDROP_WIDTH;
      this.bushOffset = (this.bushOffset + BUSH_SPEED) % BACKDROP_WIDTH;
      return;
    }
    if (this.state !== 'JOGANDO') {
      if (this.state === 'GAME_OVER') {
        if (this.birdY < GROUND_Y - BIRD_HITBOX_HEIGHT) {
          this.birdVelocity += GRAVITY;
          this.birdY = Math.min(this.birdY + this.birdVelocity, GROUND_Y - BIRD_HITBOX_HEIGHT);
        }
        this.particles = this.particles.filter((particle) => particle.life > 0);
        for (const particle of this.particles) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vy += DEATH_PARTICLE_GRAVITY;
          particle.life -= 1;
        }
      }
      return;
    }

    this.tickCount += 1;
    this.birdVelocity += GRAVITY;
    this.birdY += this.birdVelocity;
    if (this.birdY < 0) this.birdY = 0;
    this.birdRotation = Math.min(Math.PI / 2, Math.max(-0.38, this.birdVelocity * 0.065));
    this.groundOffset = (this.groundOffset + PIPE_SPEED) % GROUND_PATTERN_WIDTH;
    this.cloudOffset = (this.cloudOffset + CLOUD_SPEED) % BACKDROP_WIDTH;
    this.cityOffset = (this.cityOffset + CITY_SPEED) % BACKDROP_WIDTH;
    this.bushOffset = (this.bushOffset + BUSH_SPEED) % BACKDROP_WIDTH;

    if (this.tickCount % PIPE_SPAWN_INTERVAL_FRAMES === 0) {
      this.pipes.push({ x: PIPE_SPAWN_X, gapTop: PIPE_GAP_MIN_Y + Math.random() * (PIPE_GAP_MAX_Y - PIPE_GAP_MIN_Y), scored: false });
    }
    for (const pipe of this.pipes) {
      pipe.x -= PIPE_SPEED;
      if (!pipe.scored && pipe.x + PIPE_WIDTH < BIRD_X) {
        pipe.scored = true;
        this.score += 1;
        this.audio.play('score');
        this.emit();
      }
    }
    this.pipes = this.pipes.filter((pipe) => pipe.x + PIPE_WIDTH > -4);

    const shrinkX = BIRD_HITBOX_WIDTH * HITBOX_SHRINK;
    const shrinkY = BIRD_HITBOX_HEIGHT * HITBOX_SHRINK;
    const bird = {
      left: BIRD_X + shrinkX,
      right: BIRD_X + BIRD_HITBOX_WIDTH - shrinkX,
      top: this.birdY + shrinkY,
      bottom: this.birdY + BIRD_HITBOX_HEIGHT - shrinkY,
    };
    const hitPipe = this.pipes.some((pipe) => {
      const overlapsX = bird.right > pipe.x && bird.left < pipe.x + PIPE_WIDTH;
      return overlapsX && (bird.top < pipe.gapTop || bird.bottom > pipe.gapTop + PIPE_GAP);
    });
    if (hitPipe || bird.bottom >= GROUND_Y) {
      this.state = 'GAME_OVER';
      this.audio.play(hitPipe ? 'hit' : 'die');
      this.particles = Array.from({ length: DEATH_PARTICLE_COUNT }, () => ({
        x: BIRD_X + BIRD_HITBOX_WIDTH / 2 + 18,
        y: GROUND_Y - 5,
        vx: (Math.random() - 0.5) * 7,
        vy: -Math.random() * 7,
        life: DEATH_PARTICLE_LIFETIME_FRAMES,
      }));
      if (this.score > this.best) {
        this.best = this.score;
        this.newBest = true;
        try {
          localStorage.setItem(BEST_KEY, String(this.best));
        } catch (error) {
          console.warn('Unable to save the high score.', error);
        }
      }
      this.emit();
    }
  }
}
