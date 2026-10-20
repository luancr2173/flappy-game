interface MenuProps {
  onPlay: () => void;
  onInfo: () => void;
  logoSrc?: string;
}

function GameButton({
  children,
  onClick,
  className = '',
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return <button className={`game-button ${className}`} onClick={onClick} type="button" disabled={disabled}>{children}</button>;
}

export default function Menu({ onPlay, onInfo, logoSrc }: MenuProps) {
  return (
    <div className="menu-overlay">
      {logoSrc ? <img className="logo-image" src={logoSrc} alt="FlappyRola" /> : <div className="logo-title">FlappyRola</div>}
      <div className="menu-bird" aria-hidden="true" />
      <GameButton className="play-button" onClick={onPlay}><span className="play-triangle" /> PLAY</GameButton>
      <GameButton className="ranking-button" disabled>🏆 RANKING</GameButton>
      <div className="menu-small-buttons">
        <GameButton onClick={onInfo} aria-label="Personagens">📦</GameButton>
        <GameButton onClick={onInfo} aria-label="Controles">🎮</GameButton>
        <GameButton onClick={onInfo} aria-label="Informações">ⓘ</GameButton>
      </div>
      <p className="menu-hint">TOQUE OU ESPAÇO PARA JOGAR</p>
    </div>
  );
}
