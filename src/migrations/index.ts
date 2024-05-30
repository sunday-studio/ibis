import { addVersionToFileSystem } from './add-version.migrate';
import { migrateJSONTOMarkdown } from './file-json-to-md.migrate';
import { removeDateStringsFromIndex } from './remove-datestring-from-ids.migrate';

export type MigrationReturnType = {
  data?: any[];
  indexFile?: any;
};

type MigrationFunction = (args: any) => Promise<MigrationReturnType>;
const VERSION_INCREMENT = 0.1;

// All new migration versions must be an increment of 0.1
// All migration functions always take the total array of data passed and should always return a modified version for the next function
// the only exception to this rule is `addVersionToFileSystem` since we always run that first if you don't have a version
const FILE_VERSION_MIGRATORS: Record<number, MigrationFunction> = {
  0: addVersionToFileSystem,
  0.1: migrateJSONTOMarkdown,
  0.2: removeDateStringsFromIndex,
};

export const MAX_SCHEMA_VERSION: number = Math.max(
  ...Object.keys(FILE_VERSION_MIGRATORS).map((i) => Number(i)),
);

export const migrateFileSystem = async (data: any) => {
  let migratedData = data;
  const indexFile = migratedData?.find((file: any) => file.type === 'index.json');

  let migratedIndex = indexFile;

  let currentVersion = indexFile?.fileContent?.schemaVersion;

  // only run this once when when there's no version
  if (currentVersion === null || currentVersion === undefined) {
    FILE_VERSION_MIGRATORS[0.0]?.({ data, indexFile });
    currentVersion = 0;
  }

  while (currentVersion < MAX_SCHEMA_VERSION) {
    currentVersion = Number((currentVersion + VERSION_INCREMENT).toFixed(2));
    const currentMigrationData = await FILE_VERSION_MIGRATORS[currentVersion]?.({
      data: migratedData,
      updatedVersion: currentVersion,
      indexFile: migratedIndex,
    });

    migratedIndex = currentMigrationData.indexFile ?? indexFile;
    migratedData = currentMigrationData?.data ?? data;
  }

  await addVersionToFileSystem({
    updatedVersion: MAX_SCHEMA_VERSION,
    indexFile: migratedIndex,
  });

  return migratedData;
};
