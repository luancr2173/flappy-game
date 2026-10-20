import type { RefObject } from 'react';

interface GameCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  onAction: () => void;
}

export default function GameCanvas({ canvasRef, onAction }: GameCanvasProps) {
  return (
    <canvas
      ref={canvasRef}
      className="game-canvas"
      width={480}
      height={800}
      aria-label="Flappy Rola: toque ou pressione Espaço para jogar"
      onPointerDown={(event) => {
        event.preventDefault();
        onAction();
      }}
    />
  );
}
