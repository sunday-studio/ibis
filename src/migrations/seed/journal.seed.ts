import { writeTextFile } from '@tauri-apps/api/fs';
import { nanoid } from 'nanoid';

import { generateTodayPath } from '@/lib/data-engine/syncing-helpers';
import { getDateInStringFormat } from '@/store';

export const seedDefaultJournal = async (name: string) => {
  const today = new Date();
  const todayDate = getDateInStringFormat(today);

  const [path, journalPath] = generateTodayPath(today.toISOString(), name);

  const defaultJournalMarkdown = `---
id: ${nanoid()}
date: ${todayDate}
---

Welcome to Your Journal 🌟

Your journal awaits you with daily ready to capture your thoughts, tasks, reflections and everything inbetween.

Express yourself in markdown format – bold, italicize, and organize your notes just the way you like. 

**Happy journaling!** 
`;

  await writeTextFile(`${path}/${journalPath}`, defaultJournalMarkdown);
};
