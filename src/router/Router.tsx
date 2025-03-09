import { Route, Routes } from 'react-router';

import { MappedThoughtsScene } from '@/features/canvas/ThoughtsScene';
import { JournalScene } from '@/features/journal/JournalScene';
import { NotesEmptyState } from '@/features/notes/EmptyState';
import { NoteEditor } from '@/features/notes/NoteEditor';
import { NotesScene } from '@/features/notes/NotesScene';
import { SettingsScene } from '@/features/settings/SettingsScene';
import { TasksScene } from '@/features/tasks/TasksScene';
import { TrashScene } from '@/features/trash/TrashScene';

import { AppLayout } from '../components/AppLayout';

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/notes" element={<NotesScene />}>
          <Route index element={<NotesEmptyState />} />
          <Route path="/notes/:noteId" element={<NoteEditor />} />
        </Route>
        <Route path="/journal" element={<JournalScene />} />
        <Route path="/tasks" element={<TasksScene />} />
        <Route path="/thoughts" element={<MappedThoughtsScene />} />
        <Route path="/settings" element={<SettingsScene />} />
        <Route path="/trash" element={<TrashScene />} />
      </Route>
    </Routes>
  );
};
