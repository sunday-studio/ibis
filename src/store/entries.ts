// @ts-nocheck
import { makeAutoObservable, observable, runInAction } from 'mobx';
import { nanoid } from 'nanoid';

import { deleteFile, saveFileToDisk } from '@/lib/data-engine/syncing-helpers';

import { mobxDebounce } from '../lib/mobx-debounce';
import { formatDuplicatedTitle } from '../lib/utils';
import { type Tag, tagsState } from './tags-state';

export interface Entry {
  title: string;
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isDuplicate?: boolean;
  tags?: string[];
}

export type Folder = {
  id: string;
  name: string;
  entries: Set<string>;
};

type Folders = Record<String, Folder>;

class Entries {
  entries: Entry[] | [] = [];
  deletedEntriesId: string[] | [] = [];
  pinnedEntriesId: string[] | [] = [];
  activeEntry?: Entry | null = null;
  activeEntryTitle?: string | null = this.activeEntry?.title;
  folders: Folders = {};

  constructor() {
    makeAutoObservable(this);
  }

  loadLocalData({ entries, index }) {
    const entryData = entries.filter((e) => e.content).map((e) => e.content);
    this.entries = observable(entryData);
    this.deletedEntriesId = observable(index?.content?.deletedEntries ?? []);
    this.pinnedEntriesId = observable(index?.content?.pinnedEntries ?? []);
    this.folders = observable(index?.content?.folders ?? {});
  }

  get pinnedEntries() {
    return this.entries.filter((entry: Entry) => {
      return this.pinnedEntriesId.includes(entry.id) && !this.deletedEntriesId.includes(entry.id);
    });
  }

  get privateEntries() {
    return this.entries.filter((entry: Entry) => {
      return (
        !this?.pinnedEntriesId?.includes(entry?.id) && !this.deletedEntriesId.includes(entry.id)
      );
    });
  }

  get deletedEntries() {
    return this.deletedEntriesId.map((id) => this.entries.find((entry) => entry.id === id));
  }

  updatePinned({ id, type }) {
    if (type === 'ADD') {
      const updatedList = [...this.pinnedEntriesId, id];
      this.pinnedEntriesId = updatedList;

      saveFileToDisk({
        type: 'index',
        data: {
          pinnedEntries: updatedList,
          deletedEntries: this.deletedEntriesId,
        },
      });
    }
    if (type === 'REMOVE') {
      const updatedList = [...this.pinnedEntriesId].filter((i) => i != id);
      this.pinnedEntriesId = updatedList;

      saveFileToDisk({
        type: 'index',
        data: {
          pinnedEntries: updatedList,
          deletedEntries: this.deletedEntriesId,
        },
      });
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
  }

  addNewEntry() {
    const DEFAULT_ENTRY: Entry = {
      content: null,
      createdAt: new Date().toISOString(),
      title: 'Untitled',
      id: `${new Date().toTimeString()}-${nanoid()}`,
      tags: [tagsState.tags.filter((tag: Tag) => tag.label === 'Private')?.[0]?.value],
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
    this.entries = updatedEntries;
  }

  saveIndexFileToDisk() {
    const currentData = {
      deletedEntries: this.deletedEntriesId,
      pinnedEntries: this.pinnedEntriesId,
      folders: this.folders,
    };
    saveFileToDisk({
      type: 'index',
      data: currentData,
    });
  }

  updateActiveEntryTags(tags: string[]) {
    const updateEntry = {
      ...this.activeEntry,
      tags: tags?.filter(Boolean),
    };

    const updatedEntries = this.findAndReplaceEntry(updateEntry);

    saveFileToDisk({
      type: 'entry',
      data: updateEntry,
    });

    this.entries = updatedEntries;
    this.activeEntry = updateEntry;
  }

  deleteEntry(entryId: string) {
    if (entryId === this.activeEntry?.id) {
      this.activeEntry = null;
    }

    const updatedDeletedIds = [entryId, ...this.deletedEntriesId];

    this.deletedEntriesId = updatedDeletedIds;

    saveFileToDisk({
      type: 'index',
      data: {
        deletedEntries: updatedDeletedIds,
        pinnedEntries: this.pinnedEntriesId,
      },
    });
  }

  restoreEntry(entryId: string) {
    const updatedDeletedEntries = this.deletedEntriesId.filter((id) => id !== entryId);

    this.deletedEntriesId = updatedDeletedEntries;

    saveFileToDisk({
      type: 'index',
      data: {
        deletedEntries: updatedDeletedEntries,
        pinnedEntries: this.pinnedEntriesId,
      },
    });
  }

  permanentDelete(entryId: string) {
    const updatedDeletedEntries = this.deletedEntriesId.filter((id) => id !== entryId);
    const updatedEntries = this.entries.filter((entry) => entry.id !== entryId);
    const entry = this.entries.filter((entry) => entry.id === entryId);

    this.deletedEntriesId = updatedDeletedEntries;
    this.entries = updatedEntries;

    saveFileToDisk({
      type: 'index',
      data: {
        deletedEntries: updatedDeletedEntries,
        pinnedEntries: this.pinnedEntriesId,
      },
    });

    deleteFile(entry?.[0]);
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
  }

  onReorder(entries: Entry[]) {
    console.log('entries => ', entries);
  }

  private saveTitle = mobxDebounce(() => {
    const updatedEntry = {
      ...this.activeEntry,
      title: this.activeEntryTitle!,
    } as Entry;

    saveFileToDisk({
      type: 'entry',
      data: updatedEntry,
    });

    const updatedEntries = this.findAndReplaceEntry(updatedEntry);

    runInAction(() => {
      this.activeEntry = updatedEntry;
      this.entries = updatedEntries;
    });
  }, 500);

  updateActiveEntireTitle(title: string) {
    this.activeEntryTitle = title;
    this.saveTitle();
  }

  // Folders crud
  addFolder(folder: Folder) {
    if (!this.folders[folder.id]) {
      this.folders[folder.id] = folder;
      this.saveIndexFileToDisk();
    }
  }

  addEntryToFolder(folderId: string, entryId: string) {
    if (this.folders[folderId]) {
      const folder: Folder = this.folders[folderId];
      const updatedFolder: Folder = {
        ...folder,
        entries: folder.entries.add(entryId),
      };
      this.folders[folderId] = updatedFolder;
      this.saveIndexFileToDisk();
    }
  }

  removeEntryFromFolder(folderId: string, entryId: string) {
    if (this.folders[folderId]) {
      const folder: Folder = this.folders[folderId];
      const updatedFolder: Folder = {
        ...folder,
        entries: folder.entries.delete(entryId),
      };
      this.folders[folderId] = updatedFolder;
      this.saveIndexFileToDisk();
    }
  }
}

export const entriesStore = new Entries();
