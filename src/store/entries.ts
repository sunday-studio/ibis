// @ts-nocheck
import { saveFileToDisk } from '@/lib/data-engine/syncing-helpers';
import { makeAutoObservable, runInAction } from 'mobx';
import { nanoid } from 'nanoid';

import { CONTENT_KEY, PINNED_KEY, TRASH_KEY } from '../lib/constants';
import { mobxDebounce } from '../lib/mobx-debounce';
import { getData, setData } from '../lib/storage';
import { formatDuplicatedTitle } from '../lib/utils.ts';

export interface Entry {
  title: string;
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isDuplicate?: boolean;
  tags?: string[];
}

class Entries {
  entries: Entry[] | [] = [];
  deletedEntries: Entry[] | [] = [];
  pinnedEntriesId: string[] | [] = [];
  activeEntry?: Entry | null = null;
  activeEntryTitle?: string | null = this.activeEntry?.title;

  constructor() {
    makeAutoObservable(this);
  }

  loadLocalData(data) {
    const entryData = data.filter((e) => e.content).map((e) => e.content);
    setData(CONTENT_KEY, entryData);

    this.entries = entryData;
    this.deletedEntries = [];
    this.pinnedEntriesId = [];
  }

  load() {
    const entryData = getData(CONTENT_KEY) ?? [];
    // const pinnedData = getData(PINNED_KEY) ?? [];
    // const deletedData = getData(TRASH_KEY) ?? [];
    // this.deletedEntries = deletedData;

    this.entries = entryData;
    // this.pinnedEntriesId = pinnedData;
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
    this.activeEntry = entry;
    this.activeEntryTitle = entry.title;
  }

  removeActiveEntry() {
    this.activeEntry = null;
    this.activeEntryTitle = null;
  }

  saveEditedContent(editorState) {
    const entry: Entry = {
      ...this.activeEntry,
      updatedAt: new Date().toISOString(),
      content: JSON.stringify(editorState),
      title: this.activeEntryTitle!,
    } as Entry;

    saveFileToDisk({
      type: 'entry',
      data: entry,
    });

    const updatedEntries = this.findAndReplaceEntry(entry);

    this.entries = updatedEntries;
    setData(CONTENT_KEY, updatedEntries);
  }

  addNewEntry() {
    const DEFAULT_ENTRY: Entry = {
      content: null,
      createdAt: new Date().toISOString(),
      title: '',
      id: nanoid(),
      // TODO: always set the first tag to private
      tags: [''],
    };

    const updatedEntries = [DEFAULT_ENTRY, ...this.entries];

    runInAction(() => {
      this.activeEntry = DEFAULT_ENTRY;
      this.entries = updatedEntries;
      this.activeEntryTitle = '';
    });

    return DEFAULT_ENTRY.id;
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

    saveFileToDisk({
      type: 'entry',
      data: entry,
    });

    const updatedEntries = [entry, ...this.entries];

    setData(CONTENT_KEY, updatedEntries);
    this.entries = updatedEntries;
  }

  updateActiveEntryTags(tags: string[]) {
    const currentTags = this?.activeEntry?.tags ?? [];

    const updateEntry = {
      ...this.activeEntry,
      tags: tags?.filter(Boolean),
    };

    const updatedEntries = this.findAndReplaceEntry(updateEntry);
    this.activeEntry = updateEntry;
    setData(CONTENT_KEY, updatedEntries);
  }

  deleteEntry(entryId: string) {
    const updatedEntries = this.entries.filter((entry) => entry.id !== entryId);
    const deletedEntry = this.entries.filter((entry) => entry.id === entryId);

    if (entryId === this.activeEntry?.id) {
      this.activeEntry = null;
    }

    const updatedDeletedEntry = [...deletedEntry, ...this.deletedEntries];

    this.entries = updatedEntries;
    this.deletedEntries = updatedDeletedEntry;

    setData(TRASH_KEY, updatedDeletedEntry);
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

  saveTitle = mobxDebounce(() => {
    const updatedEntry = {
      ...this.activeEntry,
      title: this.activeEntryTitle!,
    } as Entry;

    const updatedEntries = this.findAndReplaceEntry(updatedEntry);

    runInAction(() => {
      this.activeEntry = updatedEntry;
      this.entries = updatedEntries;
    });

    setData(CONTENT_KEY, updatedEntries);
  }, 500);

  updateActiveEntireTitle(title: string) {
    this.activeEntryTitle = title;
    this.saveTitle();
  }

  restoreEntry(entryId: string) {
    const restoredEntry = this.deletedEntries.filter((entry) => entry.id === entryId);
    const updatedDeletedEntries = this.deletedEntries.filter((entry) => entry.id !== entryId);

    const updatedEntries = [...this.entries, ...restoredEntry];

    this.entries = updatedEntries;
    this.deletedEntries = updatedDeletedEntries;

    setData(TRASH_KEY, updatedDeletedEntries);
    setData(CONTENT_KEY, updatedEntries);
  }

  permanentDelete(entryId: string) {
    const updatedDeletedEntries = this.deletedEntries.filter((entry) => entry.id !== entryId);
    const updatedDeletedEntry = [...updatedDeletedEntries];

    this.deletedEntries = updatedDeletedEntry;
    setData(TRASH_KEY, updatedDeletedEntry);
  }
}

export const entriesStore = new Entries();
