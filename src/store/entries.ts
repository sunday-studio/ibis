// @ts-nocheck
import { te } from 'date-fns/locale';
import { makeAutoObservable, observable, runInAction, toJS } from 'mobx';
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
  entriesInFolders: Set[] = new Set([]);

  constructor() {
    makeAutoObservable(this);
  }

  loadLocalData({ entries, index }) {
    const entryData = entries
      .filter((e) => e.fileContent)
      .map((e) => {
        return {
          ...e.fileContent?.data,
          content: e.fileContent?.markdown,
          tags: e.fileContent?.data?.tags?.split(','),
        };
      });

    this.entries = observable(entryData);
    this.deletedEntriesId = observable(index?.fileContent?.deletedEntries ?? []);
    this.pinnedEntriesId = observable(index?.fileContent?.pinnedEntries ?? []);

    let temFolders = {};
    let temEntriesInFolders = [];

    Object.keys(index?.fileContent?.folders ?? {}).forEach((folderKey) => {
      const currentFolder = index.fileContent.folders[folderKey];

      temFolders[folderKey] = {
        ...currentFolder,
        entries: new Set(currentFolder?.entries ?? []),
      };
      temEntriesInFolders = temEntriesInFolders.concat(currentFolder?.entries ?? []);
    });

    this.folders = observable(temFolders);
    this.entriesInFolders = observable(new Set(temEntriesInFolders));
  }

  get pinnedEntries() {
    return this.entries.filter((entry: Entry) => {
      return this.pinnedEntriesId.includes(entry.id) && !this.deletedEntriesId.includes(entry.id);
    });
  }

  get privateEntries() {
    return this.entries.filter((entry: Entry) => {
      const entryIsInFolder = this.entriesInFolders.has(entry.id);
      return (
        !this?.pinnedEntriesId?.includes(entry?.id) &&
        !this.deletedEntriesId.includes(entry.id) &&
        !entryIsInFolder
      );
    });
  }

  get deletedEntries() {
    return this.deletedEntriesId.map((id) => this.entries.find((entry) => entry.id === id));
  }

  get foldersWithEntries() {
    const folders = Object.values<Folder>(this.folders);
    return folders.map((folder: Folder) => {
      const entries = [...folder.entries]?.map((entryId) => {
        return this.entries.find((entry: Entry) => entry.id === entryId);
      });
      return {
        folder,
        entries,
      };
    });
  }

  updatePinned({ id, type }: { id: string; type: 'ADD' | 'REMOVE' }) {
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

  addNewEntry() {
    const DEFAULT_ENTRY: Entry = {
      content: null,
      createdAt: new Date().toISOString(),
      title: 'Untitled',

      // TODO: before moving this to toISOString string. implement migrator to move all the existing data to new format
      // TOOD: standardize this date formatting stuff also

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

  saveEditedContent(editorState: string) {
    const entry: Entry = {
      ...this.activeEntry,
      updatedAt: new Date().toISOString(),
      content: editorState,
      title: this.activeEntryTitle!,
    } as Entry;

    saveFileToDisk({
      type: 'entry',
      data: {
        createdAt: entry.createdAt,
        content: `---
id: ${entry?.id}
createdAt: ${entry?.createdAt}
updatedAt: ${entry?.updatedAt ?? content?.createdAt ?? ''}
tags: ${entry?.tags || []}
title: ${entry?.title || 'Untitled'}        
---

${editorState}
        `,
      },
    });

    const updatedEntries = this.findAndReplaceEntry(entry);

    this.entries = updatedEntries;
  }

  // TODO: merge with saveEditedContent
  saveContent(editorState: string) {
    const activeEntryIndex = this.entries.findIndex(
      (entry: Entry) => entry.id === this?.activeEntry?.id,
    );

    if (activeEntryIndex !== -1) {
      this.saveEditedContent(editorState);
      return;
    }

    console.log('I am called', activeEntryIndex);

    return;

    const entry = {
      id: nanoid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: editorState,
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
    this.saveIndexFileToDisk();
  }

  restoreEntry(entryId: string) {
    const updatedDeletedEntries = this.deletedEntriesId.filter((id) => id !== entryId);

    this.deletedEntriesId = updatedDeletedEntries;
    this.saveIndexFileToDisk();
  }

  permanentDelete(entryId: string) {
    const updatedDeletedEntries = this.deletedEntriesId.filter((id) => id !== entryId);
    const updatedEntries = this.entries.filter((entry) => entry.id !== entryId);
    const entry = this.entries.filter((entry) => entry.id === entryId);

    this.deletedEntriesId = updatedDeletedEntries;
    this.entries = updatedEntries;
    this.saveIndexFileToDisk();
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
  addFolder(folder: Folder, entryId: string) {
    if (!this.folders[folder.id]) {
      this.folders[folder.id] = folder;
      this.tagEntryWithFolder(entryId, 'ADD');
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

      this.tagEntryWithFolder(entryId, 'ADD');
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

      runInAction(() => {
        this.tagEntryWithFolder(entryId, 'REMOVE');
      });
      this.folders[folderId] = updatedFolder;
      this.saveIndexFileToDisk();
    }
  }

  tagEntryWithFolder(entryId: string, actionType: 'ADD' | 'REMOVE') {
    if (actionType === 'ADD') {
      this.entriesInFolders.add(entryId);
    } else {
      this.entriesInFolders.delete(entryId);
    }
  }
}

export const entriesStore = new Entries();
