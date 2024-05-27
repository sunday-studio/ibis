import { MAX_SCHEMA_VERSION } from '..';

export const generateIndexSeed = ({ pinnedId = '' }) => {
  // console.log(
  //   'generateIndexSeed =>',
  //   JSON.stringify({
  //     schemaVersion: MAX_SCHEMA_VERSION,
  //     deletedEntries: [],
  //     pinnedEntries: [pinnedId],
  //     folders: {},
  //   }),
  // );
  return {
    schemaVersion: MAX_SCHEMA_VERSION,
    deletedEntries: [],
    pinnedEntries: [pinnedId],
    folders: {},
  };
};
