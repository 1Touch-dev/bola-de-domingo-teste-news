import { readFile } from "node:fs/promises";
import path from "node:path";

export const brandImage = async (file: string) => {
  const bytes = await readFile(path.join(process.cwd(), "public", file));
  return new Response(new Uint8Array(bytes), { headers: { "Content-Type": "image/png" } });
};
