import lunr from 'lunr';
import removeMarkdown from 'markdown-to-text';

import { Entry, entriesStore } from '@/store';

class SearchIndex {
  index = null;

  loadLocalData(entries, journalEntries) {
    try {
      this.index = lunr((builder) => {
        builder.ref('id');
        builder.field('title');
        builder.field('content');

        for (let index = 0; index < entries.length; index++) {
          const entry = entries[index];

          let doc = {
            id: entry?.fileContent?.data?.id,
            title: entry?.fileContent?.data?.title,
            content: removeMarkdown(entry.fileContent.markdown),
          };

          builder.add(doc);
        }
      });
    } catch (error) {
      console.error('Unable to add entries and journalEntries to search index', error);
    }
  }

  search(term: string) {
    // return this.index.search(term);
    let results = [];

    const matches = this.index.search(term);

    results = matches.map((match) => {
      // find match in entries
      // TODO: after migrating entries to dict, this should be an key find
      return entriesStore.entries.filter((entry: Entry) => entry.id === match.ref)?.[0];
    });

    return results;
  }
}

// export

export const searchEngine = new SearchIndex();
