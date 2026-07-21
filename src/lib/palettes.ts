export interface Palette {
  key: string;
  name: string;
  /** null means "use the system light/dark default" — no CSS override applied. */
  colors: {
    background: string;
    foreground: string;
    accent: string;
    accentForeground: string;
  } | null;
}

export const PALETTES: Palette[] = [
  { key: "classic", name: "Classic (default)", colors: null },
  {
    key: "slate-modern",
    name: "Slate Modern",
    colors: {
      background: "#f7f8fa",
      foreground: "#1e2433",
      accent: "#3b5bfd",
      accentForeground: "#ffffff",
    },
  },
  {
    key: "warm-terracotta",
    name: "Warm Terracotta",
    colors: {
      background: "#fdf6f0",
      foreground: "#402e26",
      accent: "#b8532a",
      accentForeground: "#ffffff",
    },
  },
  {
    key: "sage-morning",
    name: "Sage Morning",
    colors: {
      background: "#f4f7f3",
      foreground: "#26332b",
      accent: "#4a6b52",
      accentForeground: "#ffffff",
    },
  },
  {
    key: "amethyst-dusk",
    name: "Amethyst Dusk",
    colors: {
      background: "#f8f6fc",
      foreground: "#2c1f3d",
      accent: "#7c4dff",
      accentForeground: "#ffffff",
    },
  },
  {
    key: "graphite-night",
    name: "Graphite Night",
    colors: {
      background: "#14161a",
      foreground: "#e8e6e3",
      accent: "#c9a227",
      accentForeground: "#14161a",
    },
  },
];

export function getPalette(key: string): Palette {
  return PALETTES.find((p) => p.key === key) ?? PALETTES[0];
}
