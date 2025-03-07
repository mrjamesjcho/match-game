interface GameoverProps {
  onPlayAgainClick: () => void;
}

export default function Gameover({ onPlayAgainClick }: GameoverProps) {
  return (
    <div className="absolute flex flex-col justify-center items-center min-w-[394px] min-h-[394px] max-w-[394px] max-h-[394px] z-40 p-4">
      <p className="mb-4">Game Over</p>
      <p
        className="mb-4 cursor-pointer hover:brightness-50"
        onClick={onPlayAgainClick}
      >
        Play Again
      </p>
    </div>
  );
}
