import type { Session } from "next-auth";
import type { CSSProperties, ReactNode } from "react";
import { getPalette } from "@/lib/palettes";
import { NavBar } from "./nav-bar";

export function AppShell({
  session,
  paletteKey,
  children,
}: {
  session: Session | null;
  paletteKey: string;
  children: ReactNode;
}) {
  const palette = getPalette(paletteKey);

  const style: CSSProperties | undefined = palette.colors
    ? ({
        "--background": palette.colors.background,
        "--foreground": palette.colors.foreground,
        "--accent": palette.colors.accent,
        "--accent-foreground": palette.colors.accentForeground,
      } as CSSProperties)
    : undefined;

  return (
    <div style={style} className="min-h-screen bg-background text-foreground">
      <NavBar session={session} />
      {children}
    </div>
  );
}
