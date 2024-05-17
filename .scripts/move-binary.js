import { execa } from 'execa';
import fs from 'fs';

let extension = '';
if (process.platform === 'win32') {
  extension = '.exe';
}

async function main() {
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

main().catch((e) => {
  throw e;
});
