export interface AssetEntry {
  id: string;
  path: string;
  kind: 'image' | 'audio' | 'font';
  optional?: boolean;
}

export const ASSETS: AssetEntry[] = [
  { id: 'pixel-font', path: '/assets/PressStart2P-Regular.woff2', kind: 'font', optional: true },
  { id: 'logo', path: '/assets/sprites/logo.png', kind: 'image' },
  { id: 'bird', path: '/assets/sprites/bird.png', kind: 'image' },
  { id: 'character-flying', path: '/assets/sprites/character-flying.png', kind: 'image' },
  { id: 'character-fallen', path: '/assets/sprites/character-fallen.png', kind: 'image' },
  { id: 'pipe-top', path: '/assets/sprites/pipe-top.png', kind: 'image' },
  { id: 'pipe-bottom', path: '/assets/sprites/pipe-bottom.png', kind: 'image' },
  { id: 'bg-clouds', path: '/assets/sprites/bg-clouds.png', kind: 'image' },
  { id: 'bg-city', path: '/assets/sprites/bg-city.png', kind: 'image' },
  { id: 'bg-bushes', path: '/assets/sprites/bg-bushes.png', kind: 'image' },
  { id: 'ground', path: '/assets/sprites/ground.png', kind: 'image' },
  { id: 'buttons', path: '/assets/sprites/buttons.png', kind: 'image' },
  { id: 'medal-face-0', path: '/assets/sprites/medal-face-0.png', kind: 'image' },
  { id: 'medal-face-1', path: '/assets/sprites/medal-face-1.png', kind: 'image' },
  { id: 'medal-face-2', path: '/assets/sprites/medal-face-2.png', kind: 'image' },
  { id: 'medal-face-3', path: '/assets/sprites/medal-face-3.png', kind: 'image' },
  { id: 'badge-new', path: '/assets/sprites/badge-new.png', kind: 'image' },
  { id: 'panel', path: '/assets/sprites/panel.png', kind: 'image' },
  { id: 'sfx-flap', path: '/assets/audio/flap.ogg', kind: 'audio' },
  { id: 'sfx-score', path: '/assets/audio/score.ogg', kind: 'audio' },
  { id: 'sfx-hit', path: '/assets/audio/hit.ogg', kind: 'audio' },
  { id: 'sfx-die', path: '/assets/audio/die.ogg', kind: 'audio' },
  { id: 'voice-ready', path: '/assets/audio/voices/ready.ogg', kind: 'audio', optional: true },
  { id: 'voice-flap', path: '/assets/audio/voices/flap.ogg', kind: 'audio', optional: true },
  { id: 'voice-score', path: '/assets/audio/voices/score.ogg', kind: 'audio', optional: true },
  { id: 'voice-hit', path: '/assets/audio/voices/hit.ogg', kind: 'audio', optional: true },
  { id: 'voice-die', path: '/assets/audio/voices/die.ogg', kind: 'audio', optional: true },
  { id: 'music', path: '/assets/audio/music.ogg', kind: 'audio', optional: true },
];

export const ASSET_BY_ID = Object.fromEntries(ASSETS.map((asset) => [asset.id, asset])) as Record<string, AssetEntry>;
