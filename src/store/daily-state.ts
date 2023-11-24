// @ts-nocheck
import { addDays, format, subDays } from 'date-fns';
import { makeAutoObservable } from 'mobx';
import { nanoid } from 'nanoid';

import { DAILY_NOTES_KEY } from '../lib/constants';
import { getData, setData } from '../lib/storage';

export function getDateInStringFormat(date: Date, pattern = 'y-MM-dd') {
  return format(date, pattern);
}

type DailyEntry = {
  id: string;
  noteContent?: string | null;
  todos: Todo[] | [];
  date: string;
};

type Todo = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  checked?: boolean;
};

type DailyNotes = Record<string, DailyEntry>;

class DailyStore {
  dailyEntry: DailyEntry = {};
  dailyEntries: DailyNotes | {} = {};

  constructor() {
    makeAutoObservable(this);
  }

  localLocalData(data) {
    const allEntries = data.reduce((acc, obj) => {
      if (!acc[obj.content?.date]) {
        acc[obj.content?.date] = {};
      }
      acc[obj.content?.date] = obj.content;
      return acc;
    }, {});
    const today = getDateInStringFormat(new Date());
    let entryForToday: DailyEntry = allEntries[today];

    if (!entryForToday) {
      entryForToday = {
        id: nanoid(),
        noteContent: null,
        todos: [],
        date: today,
      };
    }

    this.dailyEntry = entryForToday;
    this.dailyEntries = allEntries;
  }

  load() {
    const allEntries = getData(DAILY_NOTES_KEY) ?? {};
    const today = getDateInStringFormat(new Date());

    let entryForToday: DailyEntry = allEntries[today];

    if (!entryForToday) {
      entryForToday = {
        id: nanoid(),
        noteContent: null,
        todos: [],
        date: today,
      };
    }

    this.dailyEntry = entryForToday;
    this.dailyEntries = allEntries;
  }

  saveNoteContent(editorState) {
    const updatedEntry: DailyEntry = {
      ...(this.dailyEntry as DailyEntry),
      noteContent: JSON.stringify(editorState),
    };

    this.dailyEntry = updatedEntry;
    this.dailyEntries[updatedEntry.date] = updatedEntry;

    setData(DAILY_NOTES_KEY, Object.assign({}, this.dailyEntries));
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
}

export const dailyEntryState = new DailyStore();
