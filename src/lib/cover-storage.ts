import "server-only";
import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = process.env.COVER_UPLOAD_DIR ?? "/app/uploads";
export const MAX_COVER_BYTES = 5 * 1024 * 1024; // 5MB

export async function saveCoverFile(bytes: Buffer, ext: string): Promise<string> {
  await mkdir(/* turbopackIgnore: true */ UPLOAD_DIR, { recursive: true });
  const filename = `${randomUUID()}.${ext}`;
  await writeFile(path.join(/* turbopackIgnore: true */ UPLOAD_DIR, filename), bytes);
  return filename;
}

export async function readCoverFile(filename: string): Promise<Buffer> {
  // path.basename strips any directory components, so a crafted filename
  // like "../../etc/passwd" can't escape the upload directory.
  const safeName = path.basename(filename);
  return readFile(path.join(/* turbopackIgnore: true */ UPLOAD_DIR, safeName));
}
