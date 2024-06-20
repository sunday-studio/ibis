import { execa } from 'execa';
import fs from 'node:fs';

async function moveBinaries() {
  let extension = '';

  if (process.platform === 'win32') {
    extension = '.exe';
  }

  const rustInfo = (await execa('rustc', ['-vV'])).stdout;
  const targetTriple = /host: (\S+)/g.exec(rustInfo)[1];

  if (!targetTriple) {
    console.error('Failed to determine platform target triple');
  }

  fs.renameSync(
    `src-tauri/binaries/ibis-server${extension}`,
    `src-tauri/binaries/ibis-server-${targetTriple}${extension}`,
  );
}

async function main() {
  try {
    await moveBinaries();
  } catch (e) {
    throw e;
  }
}

main().catch((e) => {
  throw e;
});
