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

// HEIC files are ISOBMFF containers: bytes 4–7 are "ftyp", 8–11 are the major brand.
// iPhone photos use one of these HEVC-in-HEIF brands (AVIF's "avif"/"avis" are deliberately excluded).
const HEIC_BRANDS = new Set(["heic", "heix", "heim", "heis", "hevc", "hevx", "mif1", "msf1"]);

/** True if the bytes look like an Apple HEIC photo (needs converting before we can store it). */
export function isHeic(bytes: Uint8Array): boolean {
  if (bytes.length < 12) return false;
  if (bytes[4] !== 0x66 || bytes[5] !== 0x74 || bytes[6] !== 0x79 || bytes[7] !== 0x70) return false;
  const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
  return HEIC_BRANDS.has(brand);
}
