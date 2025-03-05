interface ScoreProps {
  score: number;
  highscore: number;
}

export default function Score({ score, highscore }: ScoreProps) {
  return (
    <div className="flex justify-between min-w-[394px] min-h-fit p-2">
      <div className="flex">
        <div className="font-bold">Score</div>
        <div className="ml-1">{score}</div>
      </div>
      <div className="flex">
        <div className="font-bold">Highscore</div>
        <div className="ml-1">{highscore}</div>
      </div>
    </div>
  );
}
