// @ts-nocheck
import { addDays, format, subDays } from 'date-fns';
import { makeAutoObservable } from 'mobx';
import { nanoid } from 'nanoid';

import { saveFileToDisk } from '@/lib/data-engine/syncing-helpers';

import { DAILY_NOTES_KEY, DATE_PATTERN } from '../lib/constants';
import { setData } from '../lib/storage';

export function getDateInStringFormat(date: Date, pattern = DATE_PATTERN) {
  return format(date, pattern);
}

export type DailyEntry = {
  id: string;
  content: string | null;
  date: string;
};

type DailyNotes = Record<string, DailyEntry>;

class DailyStore {
  dailyEntry: DailyEntry = {};
  dailyEntries: DailyNotes | {} = {};
  intervalId = null;

  constructor() {
    makeAutoObservable(this);
  }

  localLocalData(data: any[]) {
    const allEntries = data.reduce((acc, obj) => {
      const dateString = getDateInStringFormat(new Date(obj.fileContent?.data?.date));

      if (!acc[dateString]) {
        acc[dateString] = {};
      }
      acc[dateString] = {
        content: obj.fileContent?.markdown,
        id: obj.fileContent.data?.id,
        date: obj.fileContent.data?.date,
      };
      return acc;
    }, {});

    const today = getDateInStringFormat(new Date());
    let entryForToday: DailyEntry = allEntries[today];

    if (!entryForToday) {
      entryForToday = {
        id: nanoid(),
        content: null,
        date: today,
      };
    }

    this.dailyEntry = entryForToday;
    this.dailyEntries = allEntries;
  }

  saveContent(editorState: string) {
    const updatedEntry: DailyEntry = {
      ...(this.dailyEntry as DailyEntry),
      content: editorState,
    };

    saveFileToDisk({
      type: 'today',
      data: {
        date: updatedEntry.date,
        content: `---
id: ${updatedEntry.id}
date: ${updatedEntry.date}
---
${updatedEntry.content}
        `,
      },
    });

    this.dailyEntry = updatedEntry;
    this.dailyEntries[updatedEntry.date] = updatedEntry;
  }

  goToNextDay() {
    const nextDate = addDays(new Date(this.dailyEntry.date), 1);
    this.goToDate(nextDate);
  }

  goToPreviousDay() {
    const prevDate = subDays(new Date(this.dailyEntry.date), 1);

    this.goToDate(prevDate);
  }

  goToDate(date: Date) {
    const dateString = getDateInStringFormat(date);
    let entryForToday: DailyEntry = this.dailyEntries[dateString];

    if (!entryForToday) {
      entryForToday = {
        id: nanoid(),
        noteContent: null,
        todos: [],
        date: dateString,
      };
    }
    this.dailyEntry = entryForToday;
    this.dailyEntries[dateString] = entryForToday;
    setData(DAILY_NOTES_KEY, Object.assign({}, this.dailyEntries));
  }

  goToToday() {
    const currentDate = getDateInStringFormat(new Date());

    let todayEntry = this.dailyEntries[currentDate];

    if (!todayEntry) {
      todayEntry = {
        id: nanoid(),
        note: null,
        date: currentDate,
      };
    }

    this.dailyEntry = todayEntry;
  }

  showDotIndicator(date: Date) {
    const dateString = getDateInStringFormat(date);

    if (this.dailyEntries[dateString]) {
      const note = this.dailyEntries[dateString] as DailyEntry;
      console.log('note =>', note);
      // return Boolean(note.content);
    }

    return false;
  }
}

export const dailyEntryState = new DailyStore();
