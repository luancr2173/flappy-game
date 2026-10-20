import { useEffect, useState } from 'react';
import AssetCheck from './components/AssetCheck';
import GameCanvas from './components/GameCanvas';
import GameOver from './components/GameOver';
import GetReady from './components/GetReady';
import Hud from './components/Hud';
import Menu from './components/Menu';
import { useGameLoop } from './hooks/useGameLoop';

export default function App() {
  const { canvasRef, snapshot, images, act, startReady, returnToMenu, toggleMute } = useGameLoop();
  const [info, setInfo] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        if (event.repeat || event.target instanceof HTMLButtonElement) return;
        event.preventDefault();
        act();
      } else if (event.code === 'Escape' && snapshot.state !== 'MENU') {
        returnToMenu();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [act, returnToMenu, snapshot.state]);

  useEffect(() => {
    let lastTouchEnd = 0;
    const preventDoubleTap = (event: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) event.preventDefault();
      lastTouchEnd = now;
    };
    document.addEventListener('touchend', preventDoubleTap, { passive: false });
    return () => document.removeEventListener('touchend', preventDoubleTap);
  }, []);

  return (
    <main className="page-shell">
      <section className="game-frame" aria-label="Flappy Rola">
        <GameCanvas canvasRef={canvasRef} onAction={act} />
        <Hud score={snapshot.score} muted={snapshot.muted} showScore={snapshot.state !== 'MENU'} onToggleMute={toggleMute} />
        {snapshot.state === 'MENU' && (
          <Menu onPlay={startReady} onInfo={() => setInfo(true)} logoSrc={images.logo?.src} />
        )}
        {snapshot.state === 'GET_READY' && <GetReady />}
        {snapshot.state === 'GAME_OVER' && (
          <GameOver
            score={snapshot.score}
            best={snapshot.best}
            newBest={snapshot.newBest}
            onRestart={startReady}
            onMenu={returnToMenu}
            medalFaceSrc={images[`medal-face-${snapshot.score >= 10 ? 3 : snapshot.score >= 5 ? 2 : snapshot.score > 0 ? 1 : 0}`]?.src}
            panelSrc={images.panel?.src}
            newBadgeSrc={images['badge-new']?.src}
          />
        )}
        {info && (
          <div className="info-overlay" role="dialog" aria-modal="true" aria-label="Como jogar">
            <section>
              <button type="button" className="close-info" onClick={() => setInfo(false)} aria-label="Fechar">×</button>
              <h2>Como jogar</h2>
              <p>Toque, clique ou pressione Espaço / ↑ para voar entre os canos.</p>
              <p>Personagem e ranking são espaço reservado para futuras atualizações.</p>
            </section>
          </div>
        )}
      </section>
      <AssetCheck />
    </main>
  );
}
