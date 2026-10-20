interface GameOverProps {
  score: number;
  best: number;
  newBest: boolean;
  onRestart: () => void;
  onMenu: () => void;
  medalFaceSrc?: string;
  panelSrc?: string;
  newBadgeSrc?: string;
}

export default function GameOver({ score, best, newBest, onRestart, onMenu, medalFaceSrc, panelSrc, newBadgeSrc }: GameOverProps) {
  return (
    <div className="game-over-overlay">
      <section
        className={`results-panel${panelSrc ? ' has-panel-sprite' : ''}`}
        aria-label="Resultado da partida"
        style={panelSrc ? { backgroundImage: `url("${panelSrc}")` } : undefined}
      >
        <h1>Game Over</h1>
        <div className="results-columns">
          <div className="medal-column">
            <strong>MEDAL</strong>
            <div className="medal-token">
              {medalFaceSrc && <img src={medalFaceSrc} alt="" />}
            </div>
            <button className="restart-action" onClick={onRestart} type="button">RESTART</button>
            <button className="menu-action" onClick={onMenu} type="button">MENU</button>
          </div>
          <div className="scores-column">
            <strong>SCORE</strong>
            <span className="result-number">{score}</span>
            <strong>BEST</strong>
            <span className="result-number best-number">{best}</span>
            {newBest && (newBadgeSrc
              ? <img className="new-badge-image" src={newBadgeSrc} alt="Novo recorde" />
              : <span className="new-badge">NEW</span>)}
          </div>
        </div>
      </section>
    </div>
  );
}
