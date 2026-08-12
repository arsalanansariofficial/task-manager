import { unlink } from 'node:fs/promises';

import { env } from '@/lib/config';

export async function bufferFromFile(name: string) {
  return Buffer.from(await Bun.file(`${env.UPLOAD_DIR}/${name}`).arrayBuffer());
}

export async function removeFile(name: undefined | string) {
  if (name) await unlink(`${env.UPLOAD_DIR}/${name}`);
}
