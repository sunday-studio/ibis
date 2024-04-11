import { addVersionToFileSystem } from './add-version.migrate';
import { migrateJSONTOMarkdown } from './file-json-to-md.migrate';

const FILE_VERSION_MIGRATORS = {
  0.0: addVersionToFileSystem,
  0.1: migrateJSONTOMarkdown,
};

export const migrateFileSystem = (version: keyof typeof FILE_VERSION_MIGRATORS, data: any) => {
  // console.log('data =>', version);

  if (!version) {
    FILE_VERSION_MIGRATORS[0.0]?.({ data });
  }

  // if (FILE_VERSION_MIGRATORS[version]) {
  //   FILE_VERSION_MIGRATORS[version]?.();
  // }
};
