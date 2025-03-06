interface ScoreProps {
  score: number;
  highscore: number;
}

export default function Score({ score, highscore }: ScoreProps) {
  return (
    <div className="flex justify-between min-w-[394px] min-h-fit p-2">
      <div className="flex justify-between min-w-[131px]">
        <div className="font-bold">Score</div>
        <div>{score}</div>
      </div>
      <div className="flex justify-between min-w-[131px]">
        <div className="font-bold">High</div>
        <div>{highscore}</div>
      </div>
    </div>
  );
}
