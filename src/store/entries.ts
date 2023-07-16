import { makeAutoObservable, runInAction } from 'mobx';
import { nanoid } from 'nanoid';

import { CONTENT_KEY, PINNED_KEY } from '../lib/constants';
import { getData, setData } from '../lib/storage';
import { formatDuplicatedTitle } from '../lib/utils';

export interface Entry {
  title: string;
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isDuplicate?: boolean;
}

class Entries {
  entries: Entry[] | [] = [];
  pinnedEntriesId: string[] | [] = [];
  activeEntry?: Entry | null = null;
  activeEntryTitle?: string | null = this.activeEntry?.title;

  constructor() {
    makeAutoObservable(this);
  }

  load() {
    const entryData = getData(CONTENT_KEY);
    const pinnedData = getData(PINNED_KEY) ?? [];
    this.entries = entryData;
    this.pinnedEntriesId = pinnedData;
  }

  get pinnedEntries() {
    return this.entries.filter((entry: Entry) => {
      return this.pinnedEntriesId.includes(entry.id);
    });
  }

  get privateEntries() {
    return this.entries.filter((entry: Entry) => {
      return !this?.pinnedEntriesId?.includes(entry?.id);
    });
  }

  updatePinned({ id, type }) {
    if (type === 'ADD') {
      const updatedList = [...this.pinnedEntriesId, id];

      runInAction(() => (this.pinnedEntriesId = updatedList));

      setData(PINNED_KEY, updatedList);
      return;
    }
    if (type === 'REMOVE') {
      const updatedList = [...this.pinnedEntriesId].filter((i) => i != id);
      this.pinnedEntriesId = updatedList;
      setData(PINNED_KEY, updatedList);
      return;
    }
  }

  findAndReplaceEntry(updatedEntry: Entry) {
    const entryIndex = this.entries.findIndex((entry) => entry.id === updatedEntry.id);
    let updatedEntries = this.entries;
    updatedEntries[entryIndex] = updatedEntry;

    return updatedEntries;
  }

  selectEntry(entry: Entry) {
    console.log('entry =>', entry);

    runInAction(() => {
      this.activeEntry = entry;
      // this.activeEntry = entry;
      // this.activeEntryTitle = entry.title;
    });
  }

  saveEditedContent(editorState) {
    const entry: Entry = {
      ...this.activeEntry,
      updatedAt: new Date().toISOString(),
      content: JSON.stringify(editorState),
      title: this.activeEntryTitle!,
    } as Entry;

    const updatedEntries = this.findAndReplaceEntry(entry);

    this.entries = updatedEntries;
    setData(CONTENT_KEY, updatedEntries);
  }

  addNewEntry() {
    const DEFAULT_ENTRY = {
      content: '',
      createdAt: new Date().toISOString(),
      title: '',
      id: nanoid(),
    };

    const updatedEntries = [DEFAULT_ENTRY, ...this.entries];
    this.activeEntry = DEFAULT_ENTRY;
    this.entries = updatedEntries;
    this.activeEntryTitle = '';
  }

  saveContent(editorState) {
    const activeEntryIndex = this.entries.findIndex(
      (entry: Entry) => entry.id === this?.activeEntry?.id!,
    );

    if (activeEntryIndex !== -1) {
      this.saveEditedContent(editorState);
      return;
    }

    const entry = {
      id: nanoid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: JSON.stringify(editorState),
      title: this.activeEntryTitle!,
    };

    const updatedEntries = [entry, ...this.entries];

    setData(CONTENT_KEY, updatedEntries);
    this.entries = updatedEntries;
  }

  deleteEntry(entryId: string) {
    const updatedEntries = this.entries.filter((entry) => entry.id !== entryId);

    if (entryId === this.activeEntry?.id) {
      this.activeEntry = null;
    }

    this.entries = updatedEntries;
    setData(CONTENT_KEY, updatedEntries);
  }

  duplicateEntry(entry: Entry) {
    const duplicatedEntry = {
      ...entry,
      id: nanoid(),
      title: formatDuplicatedTitle(entry.title, entry?.isDuplicate!),
      isDuplicate: true,
    };

    const updatedEntries = [duplicatedEntry, ...this.entries];
    this.entries = updatedEntries;
    setData(CONTENT_KEY, updatedEntries);
  }

  onReorder(entries: Entry[]) {
    console.log('entries => ', entries);
  }

  updateActiveEntireTitle(title) {
    console.log('title => ', title);
  }
}

export const entriesStore = new Entries();
