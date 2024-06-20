import { addDays, format, subDays } from 'date-fns';
import { makeAutoObservable } from 'mobx';
import { nanoid } from 'nanoid';

import { DocumentType } from '@/lib/data-engine/syncing-engine';
import { saveFileToDisk } from '@/lib/data-engine/syncing-helpers';

import { DATE_PATTERN, JOURNAL_NOTES_KEY } from '../lib/constants';
import { setData } from '../lib/storage';

export function getDateInStringFormat(date: Date, pattern = DATE_PATTERN) {
  return format(date, pattern);
}

type JournalEntry = {
  id: string;
  content: string | null;
  date: string;
};

type JournalEntries = Record<string, JournalEntry>;

class JournalStore {
  journalEntry: JournalEntry;
  journalEntries: JournalEntries | {} = {};
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
    let entryForToday: JournalEntry = allEntries[today];

    if (!entryForToday) {
      entryForToday = {
        id: nanoid(),
        content: null,
        date: today,
      };
    }

    this.journalEntry = entryForToday;
    this.journalEntries = allEntries;
  }

  saveContent(editorState: string) {
    const updatedEntry: JournalEntry = {
      ...(this.journalEntry as JournalEntry),
      content: editorState,
    };

    saveFileToDisk({
      type: DocumentType.Journal,
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

    this.journalEntry = updatedEntry;
    this.journalEntries[updatedEntry.date] = updatedEntry;
  }

  goToNextDay() {
    const nextDate = addDays(new Date(this.journalEntry.date), 1);
    this.goToDate(nextDate);
  }

  goToPreviousDay() {
    const prevDate = subDays(new Date(this.journalEntry.date), 1);

    this.goToDate(prevDate);
  }

  goToDate(date: Date) {
    const dateString = getDateInStringFormat(date);
    let entryForToday: JournalEntry = this.journalEntries[dateString];

    if (!entryForToday) {
      entryForToday = {
        id: nanoid(),
        content: null,
        date: dateString,
      };
    }
    this.journalEntry = entryForToday;
    this.journalEntries[dateString] = entryForToday;
    setData(JOURNAL_NOTES_KEY, Object.assign({}, this.journalEntries));
  }

  goToToday() {
    const currentDate = getDateInStringFormat(new Date());

    let todayEntry = this.journalEntries[currentDate];

    if (!todayEntry) {
      todayEntry = {
        id: nanoid(),
        note: null,
        date: currentDate,
      };
    }

    this.journalEntry = todayEntry;
  }

  showDotIndicator(date: Date) {
    const dateString = getDateInStringFormat(date);

    if (this.journalEntries[dateString]) {
      const note = this.journalEntries[dateString] as JournalEntry;
      return note?.content?.length > 0;
    }

    return false;
  }
}

export const journalEntryState = new JournalStore();
