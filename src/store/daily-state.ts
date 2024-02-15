// @ts-nocheck
import { addDays, format, subDays } from 'date-fns';
import { makeAutoObservable } from 'mobx';
import { nanoid } from 'nanoid';

import { saveFileToDisk } from '@/lib/data-engine/syncing-helpers';
import { getDayPercentageCompleted } from '@/lib/utils';

import { DAILY_NOTES_KEY, DATE_PATTERN } from '../lib/constants';
import { setData } from '../lib/storage';

export function getDateInStringFormat(date: Date, pattern = DATE_PATTERN) {
  return format(date, pattern);
}

export type DailyEntry = {
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
  intervalId = null;

  //

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

    saveFileToDisk({
      type: 'today',
      data: updatedEntry,
    });

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

  goToToday() {
    const currentDate = getDateInStringFormat(new Date());

    let todayEntry = this.dailyEntries[currentDate];

    if (!todayEntry) {
      todayEntry = {
        id: nanoid(),
        noteContent: null,
        todos: [],
        date: currentDate,
      };
    }

    this.dailyEntry = todayEntry;
  }
}

export const dailyEntryState = new DailyStore();
