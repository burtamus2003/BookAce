const SIGNATURES: { ext: string; contentType: string; matches: (bytes: Uint8Array) => boolean }[] = [
  {
    ext: "jpg",
    contentType: "image/jpeg",
    matches: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    ext: "png",
    contentType: "image/png",
    matches: (b) =>
      b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 && b[4] === 0x0d,
  },
  {
    ext: "webp",
    contentType: "image/webp",
    matches: (b) =>
      b[0] === 0x52 &&
      b[1] === 0x49 &&
      b[2] === 0x46 &&
      b[3] === 0x46 &&
      b[8] === 0x57 &&
      b[9] === 0x45 &&
      b[10] === 0x42 &&
      b[11] === 0x50,
  },
];

/** Detects the real image type from file bytes, ignoring whatever the client claims it is. */
export function detectImageType(bytes: Uint8Array): { ext: string; contentType: string } | null {
  const signature = SIGNATURES.find((s) => s.matches(bytes));
  return signature ? { ext: signature.ext, contentType: signature.contentType } : null;
}
