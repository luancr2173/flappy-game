interface HudProps {
  score: number;
  muted: boolean;
  showScore: boolean;
  onToggleMute: () => void;
}

export default function Hud({ score, muted, showScore, onToggleMute }: HudProps) {
  return (
    <>
      {showScore && <div className="score-display" aria-live="polite">{score}</div>}
      <button className="mute-button" onClick={onToggleMute} type="button" aria-label={muted ? 'Ativar som' : 'Silenciar'}>
        {muted ? '🔇' : '🔊'}
      </button>
    </>
  );
}
