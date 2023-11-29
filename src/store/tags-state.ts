import { saveFileToDisk } from '@/lib/data-engine/syncing-helpers';
import { makeAutoObservable } from 'mobx';
import { nanoid } from 'nanoid';

type Tag = {
  label: string;
  value: string;
};

export type TagsMap = Record<string, Tag>;

const DEFAULT_MAP_TAGS = {
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

  get tags() {
    return Object.values(this.tagsMap);
  }

  createNewTag(tagLabel: string) {
    const value = `${tagLabel.replace(' ', '-').toLocaleLowerCase()}_${nanoid()}`;

    const newTag = {
      value,
      label: tagLabel,
    };

    this.tagsMap[value] = newTag;

    saveFileToDisk({
      type: 'tags',
      // @ts-ignore
      data: this.tagsMap,
    });

    return value;
  }

  loadLocalData(tags: any) {
    const localTags = tags?.content || {};
    this.tagsMap = localTags;

    console.log('localTags => ', localTags);
  }

  make() {
    const tags = ['Private', 'Today', 'Highlights'];
    const s = tags.map((t) => {
      const value = `${t.replace(' ', '-').toLocaleLowerCase()}_${nanoid()}`;
      this.tagsMap[value] = {
        value,
        label: t,
      };

      return {
        value,
        label: t,
      };
    });

    console.log(JSON.stringify(s, null, 2));
    console.log(JSON.stringify(this.tagsMap, null, 2));
  }
}

export const tagsState = new Tags();
