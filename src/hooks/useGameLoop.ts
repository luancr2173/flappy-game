import { useCallback, useEffect, useRef, useState } from 'react';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import { loadGameImages, type GameImages } from '../game/assets';
import { GameEngine, type GameSnapshot } from '../game/engine';
import { renderGame } from '../game/renderer';

export function useGameLoop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [snapshot, setSnapshot] = useState<GameSnapshot>({
    state: 'MENU',
    score: 0,
    best: 0,
    newBest: false,
    muted: false,
  });
  const [images, setImages] = useState<GameImages>({});

  const act = useCallback(() => engineRef.current?.flap(), []);
  const startReady = useCallback(() => engineRef.current?.startReady(), []);
  const returnToMenu = useCallback(() => engineRef.current?.returnToMenu(), []);
  const toggleMute = useCallback(() => engineRef.current?.toggleMute(), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const engine = new GameEngine(setSnapshot);
    engineRef.current = engine;
    const loadedImages = loadGameImages((loaded) => setImages({ ...loaded }));
    const resize = () => {
      const ratio = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.round(GAME_WIDTH * ratio);
      canvas.height = Math.round(GAME_HEIGHT * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    let requestId = 0;
    const animate = (now: number) => {
      engine.frame(now);
      renderGame(ctx, engine, loadedImages.images);
      requestId = window.requestAnimationFrame(animate);
    };
    requestId = window.requestAnimationFrame(animate);

    const onVisibility = () => {
      engine.setPaused(document.hidden);
    };
    const onBlur = () => engine.setPaused(true);
    const onFocus = () => engine.setPaused(false);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    return () => {
      window.cancelAnimationFrame(requestId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      loadedImages.dispose();
      engineRef.current = null;
    };
  }, []);

  return { canvasRef, snapshot, images, act, startReady, returnToMenu, toggleMute };
}
