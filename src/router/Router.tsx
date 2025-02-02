import { Routes, Route } from 'react-router';
import { AppLayout } from '../components/AppLayout';
import { NotesScene } from '@/features/notes/NotesScene';
import { JournalScene } from '@/features/journal/JournalScene';
import { TasksScene } from '@/features/tasks/TasksScene';
import { MappedThoughtsScene } from '@/features/thought/ThoughtsScene';
export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/notes" element={<NotesScene />} />
        <Route path="/journal" element={<JournalScene />} />
        <Route path="/tasks" element={<TasksScene />} />
        <Route path="/thoughts" element={<MappedThoughtsScene />} />
      </Route>
    </Routes>
  );
};
