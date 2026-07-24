declare module "heic-convert" {
  interface HeicConvertOptions {
    /** The HEIC file bytes. */
    buffer: ArrayBufferLike | Uint8Array | Buffer;
    /** Output format. */
    format: "JPEG" | "PNG";
    /** JPEG compression quality, 0–1. Ignored for PNG. */
    quality?: number;
  }

  /** Converts the primary image in a HEIC file to JPEG or PNG. */
  function heicConvert(options: HeicConvertOptions): Promise<ArrayBuffer>;

  export default heicConvert;
}
