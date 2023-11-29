import { makeAutoObservable } from 'mobx';
import { nanoid } from 'nanoid';

type Tag = {
  label: string;
  value: string;
};

type TagsMap = Record<string, Tag>;

const DEFAULT_TAGS: Tag[] = [
  {
    value: 'private_5SggNEXrXhrhh6bA_9veW',
    label: 'Private',
  },
  {
    value: 'today_hzwpYBFRBIfc3YsgGi1cx',
    label: 'Today',
  },
  {
    value: 'highlights_0bDK41N9R5a0G5EOWl5Nc',
    label: 'Highlights',
  },
];

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
  tags: Tag[] | [] = DEFAULT_TAGS;
  tagsMap: TagsMap = DEFAULT_MAP_TAGS;

  constructor() {
    makeAutoObservable(this);
  }

  createNewTag(tagLabel: string) {
    const value = `${tagLabel.replace(' ', '-').toLocaleLowerCase()}_${nanoid()}`;

    const newTag = {
      value,
      label: tagLabel,
    };

    this.tags = [
      ...this.tags,
      {
        value,
        label: tagLabel,
      },
    ];

    this.tagsMap[value] = newTag;

    return value;
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
