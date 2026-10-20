const SFX_PATHS = {
  flap: '/assets/audio/flap.ogg',
  score: '/assets/audio/score.ogg',
  hit: '/assets/audio/hit.ogg',
  die: '/assets/audio/die.ogg',
} as const;

type GameEvent = keyof typeof SFX_PATHS | 'ready';
type SfxEvent = keyof typeof SFX_PATHS;

function isSfxEvent(event: GameEvent): event is SfxEvent {
  return event !== 'ready';
}

const VOICE_PATHS: Record<GameEvent, string[]> = {
  ready: ['/assets/audio/voices/ready.ogg'],
  flap: ['/assets/audio/voices/flap.ogg'],
  score: ['/assets/audio/voices/score.ogg'],
  hit: ['/assets/audio/voices/hit.ogg'],
  die: ['/assets/audio/voices/die.ogg'],
};
const STORAGE_KEY = 'flappy-rola-muted';
const MUSIC_PATH = '/assets/audio/music.ogg';

export class GameAudio {
  private enabled = false;
  private readonly sounds = new Map<string, HTMLAudioElement>();
  private readonly failedSources = new Set<string>();
  private music: HTMLAudioElement | null = null;
  private mutedValue = this.readMuted();

  private readMuted(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch (error) {
      console.warn('Unable to read saved audio preferences.', error);
      return false;
    }
  }

  get muted(): boolean {
    return this.mutedValue;
  }

  unlock(): void {
    if (this.enabled) return;
    this.enabled = true;
    if (!this.music) {
      this.music = new Audio(MUSIC_PATH);
      this.music.loop = true;
      this.music.volume = 0.25;
    }
    if (!this.mutedValue) this.playFile(MUSIC_PATH);
  }

  toggleMute(): boolean {
    this.mutedValue = !this.mutedValue;
    try {
      localStorage.setItem(STORAGE_KEY, String(this.mutedValue));
    } catch (error) {
      console.warn('Unable to save audio preferences.', error);
    }
    if (this.music) {
      if (this.mutedValue) this.music.pause();
      else if (this.enabled) this.playFile(MUSIC_PATH);
    }
    return this.mutedValue;
  }

  private playFile(source: string): void {
    if (!this.enabled || this.mutedValue || this.failedSources.has(source)) return;
    if (source !== MUSIC_PATH && !this.sounds.has(source)) this.sounds.set(source, new Audio(source));
    const audio = source === MUSIC_PATH ? this.music : this.sounds.get(source);
    if (!audio) return;
    if (source !== MUSIC_PATH) audio.currentTime = 0;
    void audio.play().catch((error: unknown) => {
      this.failedSources.add(source);
      console.warn(`Unable to play optional audio asset: ${source}`, error);
    });
  }

  play(event: GameEvent): void {
    if (isSfxEvent(event)) this.playFile(SFX_PATHS[event]);
    const voices = VOICE_PATHS[event];
    if (voices.length) this.playFile(voices[Math.floor(Math.random() * voices.length)]);
  }
}
