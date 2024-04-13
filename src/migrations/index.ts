import { addVersionToFileSystem } from './add-version.migrate';
import { migrateJSONTOMarkdown } from './file-json-to-md.migrate';

type Function = (args: any) => void;
const VERSION_INCREMENT = 0.1;

// All new migration versions must be an increment of 0.1
const FILE_VERSION_MIGRATORS: Record<number, Function> = {
  0.0: addVersionToFileSystem,
  0.1: migrateJSONTOMarkdown,
};

export const migrateFileSystem = (version: keyof typeof FILE_VERSION_MIGRATORS, data: any) => {
  let currentVersion = version;

  const maxVersion = Math.max(...Object.keys(FILE_VERSION_MIGRATORS).map((i) => Number(i)));

  while (currentVersion <= maxVersion) {
    FILE_VERSION_MIGRATORS[currentVersion]?.({ data });
    currentVersion = Number(Number(currentVersion + VERSION_INCREMENT).toFixed(2));
  }
};
