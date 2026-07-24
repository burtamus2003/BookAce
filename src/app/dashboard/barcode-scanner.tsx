"use client";

import { useEffect, useRef, useState } from "react";
import { BarcodeFormat, DecodeHintType, NotFoundException } from "@zxing/library";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";

export function BarcodeScanner({
  onScan,
  onClose,
}: {
  onScan: (isbn: string) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13, BarcodeFormat.UPC_A]);
    const reader = new BrowserMultiFormatReader(hints);

    reader
      .decodeFromVideoDevice(undefined, videoRef.current ?? undefined, (result, err, controls) => {
        if (cancelled) return;
        controlsRef.current = controls;

        if (result) {
          controls.stop();
          onScan(result.getText());
          return;
        }

        if (err && !(err instanceof NotFoundException)) {
          setError("Scanning error — try again or enter the ISBN manually.");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Couldn't access the camera. Check permissions and try again.");
        }
      });

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
    };
  }, [onScan]);

  return (
    <div className="flex flex-col gap-2 rounded border p-3">
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <p className="text-sm text-gray-500">Point the camera at the book&apos;s barcode.</p>
      )}
      <video ref={videoRef} className="w-full rounded" muted playsInline />
      <button
        type="button"
        onClick={onClose}
        className="self-start rounded border px-3 py-2 text-sm"
      >
        Cancel
      </button>
    </div>
  );
}
