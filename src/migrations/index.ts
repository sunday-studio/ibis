import { addVersionToFileSystem } from './add-version.migrate';
import { migrateJSONTOMarkdown } from './file-json-to-md.migrate';

type Function = (args: any) => any | any[];
const VERSION_INCREMENT = 0.1;

// All new migration versions must be an increment of 0.1
// All migration functions always take the total array of data passed and should always return a modified version for the next function
// the only exception to this rule is `addVersionToFileSystem` since we always run that first if you don't have a version
const FILE_VERSION_MIGRATORS: Record<number, Function> = {
  0: addVersionToFileSystem,
  0.1: migrateJSONTOMarkdown,
};

export const migrateFileSystem = async (data: any) => {
  let migratedData = data;

  const indexFile = migratedData?.find((file: any) => file.type === 'index.json');

  let currentVersion = indexFile?.fileContent?.schemaVersion;
  const maxVersion = Math.max(...Object.keys(FILE_VERSION_MIGRATORS).map((i) => Number(i)));

  // only run this once when when there's no version
  if (currentVersion === null || currentVersion === undefined) {
    FILE_VERSION_MIGRATORS[0.0]?.({ data, indexFile });
    currentVersion = 0;
  }

  while (currentVersion < maxVersion) {
    currentVersion = Number((currentVersion + VERSION_INCREMENT).toFixed(2));
    migratedData = await FILE_VERSION_MIGRATORS[currentVersion]?.({
      data: migratedData,
      updatedVersion: currentVersion,
      indexFile,
    });
  }

  await addVersionToFileSystem({
    updatedVersion: maxVersion,
    indexFile,
  });

  return migratedData;
};
