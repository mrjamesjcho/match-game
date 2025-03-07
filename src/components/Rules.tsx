export default function Rules() {
  return (
    <div className="absolute min-w-[394px] min-h-[394px] max-w-[394px] max-h-[394px] z-40 p-4">
      <p className="mb-4">1. Click on any tile to select it</p>
      <p className="mb-4">
        2. Click on one of the surrounding highlighted tiles to swap it with the
        selected tile
      </p>
      <p className="mb-4">
        the swap will succeed if the resulting swap creates a match of 3 or more
        tiles with the same color in a row or column
      </p>
    </div>
  );
}
