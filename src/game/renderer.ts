import { BACKDROP_WIDTH, BIRD_HITBOX_WIDTH, BIRD_START_Y, BIRD_X, COLORS, DEATH_PARTICLE_LIFETIME_FRAMES, DEATH_PARTICLE_SIZE, GAME_HEIGHT, GAME_WIDTH, GROUND_PATTERN_HEIGHT, GROUND_PATTERN_WIDTH, GROUND_Y, PIPE_GAP, PIPE_HEIGHT, PIPE_WIDTH } from '../config';
import type { GameImages } from './assets';
import type { GameEngine } from './engine';

function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string): void {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale = 1): void {
  ctx.fillStyle = '#e9fbf6';
  ctx.fillRect(x + 12 * scale, y, 32 * scale, 10 * scale);
  ctx.fillRect(x, y + 10 * scale, 64 * scale, 13 * scale);
  ctx.fillRect(x + 8 * scale, y + 23 * scale, 46 * scale, 7 * scale);
}

function drawHorizontalLayer(ctx: CanvasRenderingContext2D, image: HTMLImageElement, offset: number, y: number, height: number): void {
  const scroll = ((offset % GAME_WIDTH) + GAME_WIDTH) % GAME_WIDTH;
  for (let x = -scroll; x < GAME_WIDTH; x += GAME_WIDTH) {
    ctx.drawImage(image, x, y, GAME_WIDTH, height);
  }
}

function drawBackdrop(ctx: CanvasRenderingContext2D, engine: GameEngine, images: GameImages): void {
  rect(ctx, 0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.sky);
  if (images['bg-clouds']) {
    drawHorizontalLayer(ctx, images['bg-clouds'], engine.cloudOffset, 40, GROUND_Y - 40);
  } else {
    for (let i = 0; i < 5; i += 1) {
      const x = ((i * 139 - engine.cloudOffset) % (BACKDROP_WIDTH + 140) + BACKDROP_WIDTH + 140) % (BACKDROP_WIDTH + 140) - 70;
      drawCloud(ctx, x, 80 + (i % 3) * 95, 1 + (i % 2) * 0.15);
    }
  }
  if (images['bg-city']) {
    drawHorizontalLayer(ctx, images['bg-city'], engine.cityOffset, GROUND_Y - 220, 220);
  } else {
    for (let layer = 0; layer < 2; layer += 1) {
      const speed = layer === 0 ? 0.55 : 1;
      const offset = (engine.cityOffset * speed) % BACKDROP_WIDTH;
      for (let i = -1; i < 8; i += 1) {
        const x = i * 72 - offset;
        const height = 100 + ((i * 47 + layer * 61 + 400) % 120);
        rect(ctx, x, GROUND_Y - height, 64, height, layer === 0 ? '#9fdd88' : '#80ce6c');
        rect(ctx, x + 12, GROUND_Y - height + 20, 8, 10, '#c7ef9a');
        rect(ctx, x + 38, GROUND_Y - height + 40, 8, 10, '#c7ef9a');
        rect(ctx, x + 12, GROUND_Y - height + 57, 8, 10, '#c7ef9a');
      }
    }
  }
  if (images['bg-bushes']) {
    drawHorizontalLayer(ctx, images['bg-bushes'], engine.bushOffset, GROUND_Y - 48, 48);
  } else {
    const bushOffset = engine.bushOffset % (GROUND_PATTERN_WIDTH * 2.5);
    for (let i = -1; i < 9; i += 1) {
      const x = i * 64 - bushOffset;
      rect(ctx, x + 5, GROUND_Y - 25, 55, 28, '#55a83b');
      rect(ctx, x + 17, GROUND_Y - 38, 28, 20, '#67b941');
      rect(ctx, x + 38, GROUND_Y - 30, 26, 19, '#4b9e37');
    }
  }
}

function drawPipe(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, top: boolean, image?: HTMLImageElement): void {
  if (image) {
    ctx.drawImage(image, x, y, width, height);
    return;
  }
  const lipHeight = 28;
  const lipY = top ? y + height - lipHeight : y;
  rect(ctx, x - 3, y, width + 6, height, COLORS.pipeDark);
  rect(ctx, x + 3, y, width - 6, height, COLORS.pipe);
  rect(ctx, x + 10, y, 10, height, '#a4e85a');
  rect(ctx, x - 8, lipY, width + 16, lipHeight, COLORS.pipeDark);
  rect(ctx, x - 4, lipY + 4, width + 8, lipHeight - 8, '#7bd144');
  rect(ctx, x + 5, lipY + 5, 10, lipHeight - 10, '#b2ed64');
}

function drawBird(ctx: CanvasRenderingContext2D, engine: GameEngine, images: GameImages, x = 60, y = 400, scale = 1): void {
  const bob = engine.state === 'MENU' ? Math.sin(engine.animationTime / 190) * 8 : 0;
  const wing = Math.sin(engine.animationTime / 65) * 3;
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.rotate(engine.state === 'JOGANDO' || engine.state === 'GAME_OVER' ? engine.birdRotation : Math.sin(engine.animationTime / 250) * 0.08);
  ctx.scale(scale, scale);
  const sprite = images.bird;
  if (sprite) {
    const frameWidth = sprite.width / 2;
    const frame = Math.floor(engine.animationTime / 100) % 2;
    ctx.drawImage(sprite, frame * frameWidth, 0, frameWidth, sprite.height, -23, -16, 46, 32);
    ctx.restore();
    return;
  }
  ctx.fillStyle = '#c68023';
  ctx.fillRect(-20, -12, 36, 27);
  ctx.fillStyle = '#ffd93d';
  ctx.fillRect(-22, -17, 37, 31);
  ctx.fillRect(-15, -21, 24, 8);
  ctx.fillStyle = '#f7f2d4';
  ctx.fillRect(-3, -10, 14, 11);
  ctx.fillStyle = '#fff';
  ctx.fillRect(2, -16, 12, 13);
  ctx.fillStyle = COLORS.ink;
  ctx.fillRect(9, -12, 4, 5);
  ctx.fillStyle = '#f08a27';
  ctx.fillRect(12, -3, 14, 7);
  ctx.fillStyle = '#f8aa30';
  ctx.fillRect(-19, -2 + wing, 15, 9);
  ctx.restore();
}

function drawCharacter(ctx: CanvasRenderingContext2D, engine: GameEngine, images: GameImages, x: number, y: number, fallen = false): void {
  const sprite = images[fallen ? 'character-fallen' : 'character-flying'];
  if (sprite) {
    ctx.save();
    ctx.translate(x, y);
    const frameWidth = fallen ? sprite.width : sprite.width / 2;
    const frame = fallen ? 0 : Math.floor(engine.animationTime / 130) % 2;
    ctx.drawImage(sprite, frame * frameWidth, 0, frameWidth, sprite.height, fallen ? -50 : -34, fallen ? -36 : -45, fallen ? 100 : 68, fallen ? 72 : 90);
    ctx.restore();
    return;
  }
  ctx.save();
  ctx.translate(x, y);
  if (fallen) ctx.rotate(Math.PI / 2);
  ctx.fillStyle = '#d87525';
  ctx.fillRect(-24, -32, 47, 24);
  ctx.fillRect(-18, -41, 34, 13);
  ctx.fillStyle = '#ffd2a1';
  ctx.fillRect(-16, -21, 33, 28);
  ctx.fillStyle = '#25292a';
  ctx.fillRect(-5, -14, 13, 11);
  ctx.strokeStyle = '#25292a';
  ctx.lineWidth = 3;
  ctx.strokeRect(-8, -16, 14, 12);
  ctx.fillStyle = '#f8f4db';
  ctx.fillRect(-1, -10, 5, 3);
  ctx.fillStyle = '#416eb0';
  ctx.fillRect(-16, 7, 34, 21);
  ctx.fillStyle = '#efb578';
  ctx.fillRect(fallen ? -29 : 9, -2, 14, 7);
  drawBird(ctx, engine, images, fallen ? -28 : 26, fallen ? 1 : -1, 0.65);
  ctx.restore();
}

function drawGround(ctx: CanvasRenderingContext2D, engine: GameEngine, images: GameImages): void {
  if (images.ground) {
    drawHorizontalLayer(ctx, images.ground, engine.groundOffset, GROUND_Y, GAME_HEIGHT - GROUND_Y);
    return;
  }
  rect(ctx, 0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y, COLORS.ground);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, GROUND_Y, GAME_WIDTH, GROUND_PATTERN_HEIGHT);
  ctx.clip();
  for (let x = -50 - engine.groundOffset; x < GAME_WIDTH + 50; x += GROUND_PATTERN_WIDTH) {
    ctx.fillStyle = COLORS.grass;
    ctx.beginPath();
    ctx.moveTo(x, GROUND_Y);
    ctx.lineTo(x + GROUND_PATTERN_WIDTH / 2, GROUND_Y);
    ctx.lineTo(x - 4, GROUND_Y + GROUND_PATTERN_HEIGHT);
    ctx.lineTo(x - 28, GROUND_Y + GROUND_PATTERN_HEIGHT);
    ctx.fill();
    ctx.fillStyle = COLORS.grassLight;
    ctx.beginPath();
    ctx.moveTo(x + 22, GROUND_Y);
    ctx.lineTo(x + GROUND_PATTERN_WIDTH - 4, GROUND_Y);
    ctx.lineTo(x + 16, GROUND_Y + GROUND_PATTERN_HEIGHT);
    ctx.lineTo(x - 5, GROUND_Y + GROUND_PATTERN_HEIGHT);
    ctx.fill();
  }
  ctx.restore();
  rect(ctx, 0, GROUND_Y + GROUND_PATTERN_HEIGHT, GAME_WIDTH, 5, '#f4c65e');
}

function drawReadyCharacter(ctx: CanvasRenderingContext2D, engine: GameEngine, images: GameImages): void {
  const y = engine.birdY + 15;
  drawCharacter(ctx, engine, images, 245, y);
  ctx.font = 'bold 28px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.lineWidth = 7;
  ctx.strokeStyle = '#453026';
  ctx.strokeText('Get Ready!', 240, 283);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#fff';
  ctx.strokeText('Get Ready!', 240, 283);
  ctx.fillStyle = '#ffe632';
  ctx.fillText('Get Ready!', 240, 283);
  ctx.fillStyle = '#f39a32';
  ctx.font = 'bold 18px "Press Start 2P", monospace';
  ctx.fillText('TAP', 112, y - 5);
  ctx.fillText('TAP', 368, y - 5);
  ctx.font = '32px sans-serif';
  ctx.fillText('➜', 112, y + 27);
  ctx.fillText('⬅', 368, y + 27);
  rect(ctx, 237, y + 69, 7, 22, '#fff0cf');
  rect(ctx, 236, y + 67, 8, 6, '#fff0cf');
  rect(ctx, 234, y + 81, 12, 11, '#fff0cf');
  rect(ctx, 230, y + 79, 5, 8, '#fff0cf');
  rect(ctx, 245, y + 77, 5, 10, '#fff0cf');
  rect(ctx, 234, y + 67, 3, 25, '#594330');
  rect(ctx, 231, y + 79, 15, 3, '#594330');
  rect(ctx, 234, y + 89, 12, 3, '#594330');
}

export function renderGame(ctx: CanvasRenderingContext2D, engine: GameEngine, images: GameImages = {}): void {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  drawBackdrop(ctx, engine, images);
  for (const pipe of engine.pipes) {
    drawPipe(ctx, pipe.x, pipe.gapTop - PIPE_HEIGHT, PIPE_WIDTH, PIPE_HEIGHT, true, images['pipe-top']);
    const lowerY = pipe.gapTop + PIPE_GAP;
    drawPipe(ctx, pipe.x, lowerY, PIPE_WIDTH, PIPE_HEIGHT, false, images['pipe-bottom']);
  }
  if (engine.state === 'GET_READY') drawReadyCharacter(ctx, engine, images);
  else if (engine.state === 'GAME_OVER') {
    drawCharacter(ctx, engine, images, 126, Math.min(engine.birdY + 15, GROUND_Y - 18), true);
    for (const particle of engine.particles) {
      ctx.globalAlpha = Math.max(0, particle.life / DEATH_PARTICLE_LIFETIME_FRAMES);
      rect(ctx, particle.x, particle.y, DEATH_PARTICLE_SIZE, DEATH_PARTICLE_SIZE, '#64bc3b');
    }
    ctx.globalAlpha = 1;
  }
  else if (engine.state === 'MENU') drawBird(ctx, engine, images, GAME_WIDTH / 2, BIRD_START_Y, 1.45);
  else drawBird(ctx, engine, images, BIRD_X + BIRD_HITBOX_WIDTH / 2, engine.birdY + 15);
  drawGround(ctx, engine, images);
}

export function logicalCanvasSize(): { width: number; height: number } {
  return { width: GAME_WIDTH, height: GAME_HEIGHT };
}
