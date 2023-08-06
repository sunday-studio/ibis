// @ts-nocheck
import { addDays, format, subDays } from 'date-fns';
import { makeAutoObservable, runInAction } from 'mobx';
import { nanoid } from 'nanoid';

import { DAILY_NOTES_KEY } from '../lib/constants';
import { getData, setData } from '../lib/storage';

function getDateInStringFormat(date: Date) {
  return format(date, 'y-MM-dd');
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
    const nextDate = getDateInStringFormat(addDays(new Date(this.dailyEntry.date), 1));
    let entryForToday: DailyEntry = this.dailyEntries[nextDate];

    if (!entryForToday) {
      entryForToday = {
        id: nanoid(),
        noteContent: null,
        todos: [],
        date: nextDate,
      };
    }

    this.dailyEntry = entryForToday;
    this.dailyEntries[nextDate] = entryForToday;

    setData(DAILY_NOTES_KEY, Object.assign({}, this.dailyEntries));
  }

  goToPreviousDay() {
    const prevDate = getDateInStringFormat(subDays(new Date(this.dailyEntry.date), 1));

    let entryForToday: DailyEntry = this.dailyEntries[prevDate];

    if (!entryForToday) {
      entryForToday = {
        id: nanoid(),
        noteContent: null,
        todos: [],
        date: prevDate,
      };
    }

    this.dailyEntry = entryForToday;
    this.dailyEntries[prevDate] = entryForToday;
    setData(DAILY_NOTES_KEY, Object.assign({}, this.dailyEntries));
  }
}

export const dailyEntryState = new DailyStore();
