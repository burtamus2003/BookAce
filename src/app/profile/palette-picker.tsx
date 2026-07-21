"use client";

import { useTransition } from "react";
import { PALETTES } from "@/lib/palettes";
import { updateColorPalette } from "./actions";

export function PalettePicker({ currentKey }: { currentKey: string }) {
  const [isPending, startTransition] = useTransition();

  function handleSelect(paletteKey: string) {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("paletteKey", paletteKey);
      await updateColorPalette(formData);
    });
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {PALETTES.map((palette) => {
        const isSelected = palette.key === currentKey;
        const preview = palette.colors ?? {
          background: "#ffffff",
          foreground: "#171717",
          accent: "#171717",
          accentForeground: "#ffffff",
        };

        return (
          <button
            key={palette.key}
            type="button"
            disabled={isPending}
            onClick={() => handleSelect(palette.key)}
            className={`flex flex-col gap-2 rounded border p-3 text-left disabled:opacity-50 ${
              isSelected ? "ring-2 ring-accent" : ""
            }`}
          >
            <div
              className="flex h-16 items-center justify-center rounded border"
              style={{ background: preview.background }}
            >
              <span
                className="rounded px-2 py-1 text-xs"
                style={{ background: preview.accent, color: preview.accentForeground }}
              >
                Aa
              </span>
            </div>
            <span className="text-sm font-medium">{palette.name}</span>
            {isSelected && <span className="text-xs text-gray-500">Current</span>}
          </button>
        );
      })}
    </div>
  );
}
