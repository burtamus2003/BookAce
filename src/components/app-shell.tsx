import type { Session } from "next-auth";
import type { CSSProperties, ReactNode } from "react";
import type { PaletteColors } from "@/lib/palettes";
import { NavBar } from "./nav-bar";

export function AppShell({
  session,
  paletteColors,
  children,
}: {
  session: Session | null;
  /** Fully-resolved colors to apply, or null to use the system light/dark default (no override). */
  paletteColors: PaletteColors | null;
  children: ReactNode;
}) {
  const style: CSSProperties | undefined = paletteColors
    ? ({
        "--background": paletteColors.background,
        "--foreground": paletteColors.foreground,
        "--accent": paletteColors.accent,
        "--accent-foreground": paletteColors.accentForeground,
      } as CSSProperties)
    : undefined;

  return (
    <div style={style} className="min-h-screen bg-background text-foreground">
      <NavBar session={session} />
      {children}
    </div>
  );
}
