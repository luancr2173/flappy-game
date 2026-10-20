export interface Character {
  id: string;
  nome: string;
  sprite: string;
  frames: number;
  hitbox: { width: number; height: number };
  gravity?: number;
  jumpForce?: number;
  habilidade?: string;
  vozes: Partial<Record<'ready' | 'flap' | 'score' | 'hit' | 'die', string[]>>;
}

export const CHARACTERS: Character[] = [
  {
    id: 'tomelirolla',
    nome: 'Tomelirolla',
    sprite: '/assets/sprites/character-flying.png',
    frames: 2,
    hitbox: { width: 45, height: 30 },
    vozes: {
      ready: ['/assets/audio/voices/ready.ogg'],
      flap: ['/assets/audio/voices/flap.ogg'],
      score: ['/assets/audio/voices/score.ogg'],
      hit: ['/assets/audio/voices/hit.ogg'],
      die: ['/assets/audio/voices/die.ogg'],
    },
  },
];

export const DEFAULT_CHARACTER = CHARACTERS[0];
