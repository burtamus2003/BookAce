const SPINES: { w: number; h: number; color: string; band: string }[] = [
  { w: 18, h: 150, color: "#7a1f2a", band: "#5a1620" },
  { w: 14, h: 172, color: "#c9a227", band: "#a3810f" },
  { w: 22, h: 140, color: "#1f4d3d", band: "#163a2d" },
  { w: 16, h: 186, color: "#e8dfc0", band: "#cfc39a" },
  { w: 20, h: 155, color: "#1b2a44", band: "#131f34" },
  { w: 15, h: 176, color: "#8a4a1f", band: "#693916" },
  { w: 24, h: 145, color: "#4a1f4d", band: "#391739" },
  { w: 18, h: 166, color: "#2b2b2b", band: "#1a1a1a" },
  { w: 16, h: 190, color: "#b8860b", band: "#8f6a08" },
  { w: 20, h: 150, color: "#7a1f2a", band: "#5a1620" },
  { w: 14, h: 180, color: "#1f4d3d", band: "#163a2d" },
  { w: 22, h: 160, color: "#c9a227", band: "#a3810f" },
  { w: 18, h: 145, color: "#1b2a44", band: "#131f34" },
  { w: 16, h: 172, color: "#8a4a1f", band: "#693916" },
  { w: 24, h: 156, color: "#e8dfc0", band: "#cfc39a" },
  { w: 20, h: 140, color: "#4a1f4d", band: "#391739" },
  { w: 15, h: 184, color: "#2b2b2b", band: "#1a1a1a" },
  { w: 18, h: 160, color: "#b8860b", band: "#8f6a08" },
  { w: 22, h: 150, color: "#7a1f2a", band: "#5a1620" },
  { w: 16, h: 175, color: "#1f4d3d", band: "#163a2d" },
];

const TILE_HEIGHT = 220;
const SHELF_HEIGHT = 18;
const GAP = 3;

function ShelfRow() {
  let x = 0;
  const baseline = TILE_HEIGHT - SHELF_HEIGHT;

  return (
    <>
      {SPINES.map((book, i) => {
        const spineX = x;
        x += book.w + GAP;
        const top = baseline - book.h;
        const bandHeight = Math.max(8, Math.round(book.h * 0.08));

        return (
          <g key={i}>
            <rect x={spineX} y={top} width={book.w} height={book.h} fill={book.color} />
            <rect x={spineX} y={top} width={book.w} height={bandHeight} fill={book.band} />
            <rect
              x={spineX}
              y={baseline - bandHeight}
              width={book.w}
              height={Math.max(4, bandHeight / 2)}
              fill={book.band}
            />
          </g>
        );
      })}
    </>
  );
}

export function BookshelfBackground() {
  const tileWidth = SPINES.reduce((sum, b) => sum + b.w + GAP, 0);

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="shelfRow"
          width={tileWidth}
          height={TILE_HEIGHT}
          patternUnits="userSpaceOnUse"
        >
          <rect width={tileWidth} height={TILE_HEIGHT} fill="#0a0a0a" />
          <ShelfRow />
          <rect
            x={0}
            y={TILE_HEIGHT - SHELF_HEIGHT}
            width={tileWidth}
            height={SHELF_HEIGHT}
            fill="#3b2a1e"
          />
          <rect x={0} y={TILE_HEIGHT - SHELF_HEIGHT} width={tileWidth} height={2} fill="#5a3f2b" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#shelfRow)" />
    </svg>
  );
}
