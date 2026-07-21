"use client";

import { useState, useTransition } from "react";
import { PALETTES, CLASSIC_FALLBACK_COLORS, type PaletteColors } from "@/lib/palettes";
import { contrastRatio } from "@/lib/contrast";
import { updateColorPalette, updateCustomPalette } from "./actions";

function ContrastNote({ ratio, label }: { ratio: number; label: string }) {
  const ok = ratio >= 4.5;
  return (
    <p className={`text-xs ${ok ? "text-gray-500" : "text-red-600"}`}>
      {label}: {ratio.toFixed(2)}:1 {ok ? "" : "— hard to read, aim for 4.5:1 or higher"}
    </p>
  );
}

export function PalettePicker({
  currentKey,
  currentColors,
}: {
  /** null when a custom palette is active (no preset selected) */
  currentKey: string | null;
  currentColors: PaletteColors;
}) {
  const [isPending, startTransition] = useTransition();
  const [colors, setColors] = useState<PaletteColors>(currentColors);
  const [saved, setSaved] = useState(false);

  function handleSelectPreset(paletteKey: string) {
    setSaved(false);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("paletteKey", paletteKey);
      await updateColorPalette(formData);
    });
  }

  function handleSaveCustom() {
    setSaved(false);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("background", colors.background);
      formData.set("foreground", colors.foreground);
      formData.set("accent", colors.accent);
      formData.set("accentForeground", colors.accentForeground);
      await updateCustomPalette(formData);
      setSaved(true);
    });
  }

  function updateColor(key: keyof PaletteColors, value: string) {
    setSaved(false);
    setColors((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {PALETTES.map((palette) => {
          const isSelected = palette.key === currentKey;
          const preview = palette.colors ?? CLASSIC_FALLBACK_COLORS;

          return (
            <button
              key={palette.key}
              type="button"
              disabled={isPending}
              onClick={() => handleSelectPreset(palette.key)}
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

      <div className="border-t pt-6">
        <h2 className="mb-1 font-medium">Customize your own</h2>
        <p className="mb-4 text-sm text-gray-500">
          Start from a preset above, then adjust any of these. Saving here always overrides the
          preset — pick a preset again any time to reset.
        </p>

        <div
          className="mb-4 flex h-16 items-center justify-center rounded border"
          style={{ background: colors.background }}
        >
          <span
            className="rounded px-3 py-1.5 text-sm"
            style={{ background: colors.accent, color: colors.accentForeground }}
          >
            Preview
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Background
            <input
              type="color"
              value={colors.background}
              onChange={(e) => updateColor("background", e.target.value)}
              className="h-9 w-full rounded border"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Text
            <input
              type="color"
              value={colors.foreground}
              onChange={(e) => updateColor("foreground", e.target.value)}
              className="h-9 w-full rounded border"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Accent (buttons/links)
            <input
              type="color"
              value={colors.accent}
              onChange={(e) => updateColor("accent", e.target.value)}
              className="h-9 w-full rounded border"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Text on accent
            <input
              type="color"
              value={colors.accentForeground}
              onChange={(e) => updateColor("accentForeground", e.target.value)}
              className="h-9 w-full rounded border"
            />
          </label>
        </div>

        <div className="mt-3 flex flex-col gap-1">
          <ContrastNote
            ratio={contrastRatio(colors.background, colors.foreground)}
            label="Background/text contrast"
          />
          <ContrastNote
            ratio={contrastRatio(colors.accent, colors.accentForeground)}
            label="Accent button contrast"
          />
        </div>

        <button
          type="button"
          onClick={handleSaveCustom}
          disabled={isPending}
          className="mt-4 rounded bg-accent px-4 py-2 text-sm text-accent-foreground disabled:opacity-50"
        >
          Save custom palette
        </button>
        {saved && <span className="ml-3 text-sm text-green-700">Saved!</span>}
      </div>
    </div>
  );
}
