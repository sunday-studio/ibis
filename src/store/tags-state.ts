import { makeAutoObservable, observable } from 'mobx';
import { nanoid } from 'nanoid';

import { DocumentType } from '@/lib/data-engine/syncing-engine';
import { saveFileToDisk } from '@/lib/data-engine/syncing-helpers';

export type Tag = {
  label: string;
  value: string;
};

type TagsMap = Record<string, Tag>;

// TODO: create these at the initial folder creation stage
export const DEFAULT_MAP_TAGS = {
  private_5SggNEXrXhrhh6bA_9veW: {
    value: 'private_5SggNEXrXhrhh6bA_9veW',
    label: 'Private',
  },
  today_hzwpYBFRBIfc3YsgGi1cx: {
    value: 'today_hzwpYBFRBIfc3YsgGi1cx',
    label: 'Today',
  },
  highlights_0bDK41N9R5a0G5EOWl5Nc: {
    value: 'highlights_0bDK41N9R5a0G5EOWl5Nc',
    label: 'Highlights',
  },
};

class Tags {
  tagsMap: TagsMap = DEFAULT_MAP_TAGS;

  constructor() {
    makeAutoObservable(this);
  }

  loadLocalData(tags: any) {
    const localTags = tags?.fileContent || {};
    Object.assign(this.tagsMap, localTags);
  }

  get tags() {
    return Object.values(this.tagsMap);
  }

  createNewTag(tagLabel: string) {
    const value = `${tagLabel.replace(' ', '-').toLocaleLowerCase()}_${nanoid()}`;

    const newTag = {
      value,
      label: tagLabel,
    };

    this.tagsMap[value] = observable(newTag);

    saveFileToDisk({
      type: DocumentType.Tags,
      data: this.tagsMap,
    });

    return value;
  }
}

export const tagsState = new Tags();
