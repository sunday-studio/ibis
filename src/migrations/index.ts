import { addVersionToFileSystem } from './add-version.migrate';
import { migrateJSONTOMarkdown } from './file-json-to-md.migrate';

type Function = (args: any) => void;
const VERSION_INCREMENT = 0.1;

// All new migration versions must be an increment of 0.1
const FILE_VERSION_MIGRATORS: Record<number, Function> = {
  0: addVersionToFileSystem,
  0.1: migrateJSONTOMarkdown,
};

export const migrateFileSystem = async (data: any) => {
  const indexFile = data?.find((file: any) => file.type === 'index.json');

  let currentVersion = indexFile?.fileContent?.schemaVersion;
  const maxVersion = Math.max(...Object.keys(FILE_VERSION_MIGRATORS).map((i) => Number(i)));

  // only run this once when when there's no version
  if (currentVersion === null || currentVersion === undefined) {
    FILE_VERSION_MIGRATORS[0.0]?.({ data, indexFile });
    currentVersion = 0;
  }

  while (currentVersion < maxVersion) {
    currentVersion = Number((currentVersion + VERSION_INCREMENT).toFixed(2));
    FILE_VERSION_MIGRATORS[currentVersion]?.({ data, updatedVersion: currentVersion, indexFile });
  }

  addVersionToFileSystem({
    updatedVersion: maxVersion,
    indexFile,
  });
};
