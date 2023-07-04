import {
  useCallback,
  useState,
  useMemo,
  useContext,
  createContext,
  useEffect,
} from 'react';
import { nanoid } from 'nanoid';
import { getData, setData } from '../lib/storage';
import { useDebouncedCallback } from 'use-debounce';

const CONTENT_KEY = 'opps-content';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [activeEntry, setActiveEntry] = useState(null);
  const [activeEntryTitle, setActiveEntryTitle] = useState(activeEntry?.title);

  useEffect(() => {
    const data = getData(CONTENT_KEY) ?? [];
    setEntries(data);
  }, []);

  const selectEntry = useCallback(
    (entry) => {
      setActiveEntry(entry);
      setActiveEntryTitle(entry.title);
    },
    [setActiveEntry],
  );

  const addNewEntry = useCallback(() => {
    const DEFAULT_ENTRY = {
      content: '',
      createdAt: new Date().toISOString(),
      title: '',
      id: nanoid(),
    };

    const updatedEntries = [DEFAULT_ENTRY, ...entries];

    setActiveEntry(DEFAULT_ENTRY);
    setEntries(updatedEntries);
    setActiveEntryTitle('');
  }, [entries]);

  const findAndReplaceEntry = useCallback(
    (updatedEntry) => {
      const entryIndex = entries.findIndex((entry) => entry.id === updatedEntry.id);
      let updatedEntries = entries;
      updatedEntries[entryIndex] = updatedEntry;
      return updatedEntries;
    },
    [entries],
  );

  const saveEditedContent = (editorState) => {
    const entry = {
      ...activeEntry,
      updatedAt: new Date().toISOString(),
      content: JSON.stringify(editorState),
      title: activeEntryTitle,
    };

    const updatedEntries = findAndReplaceEntry(entry);

    setData(CONTENT_KEY, updatedEntries);
    setEntries(updatedEntries);
  };

  const saveContent = (editorState) => {
    const activeEntryIndex = entries.findIndex((entry) => entry.id === activeEntry.id);

    if (activeEntryIndex !== -1) {
      saveEditedContent(editorState);
      return;
    }

    const entry = {
      id: nanoid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: JSON.stringify(editorState),
      title: activeEntryTitle,
    };

    const updatedEntries = [entry, ...entries];

    setData(CONTENT_KEY, updatedEntries);
    setEntries(updatedEntries);
  };

  const deleteEntry = useCallback(
    (entryId) => {
      const updatedEntries = entries.filter((entry) => entry.id !== entryId);

      setEntries(updatedEntries);
    },
    [entries],
  );

  const udpateActiveEntryTitle = useCallback(
    (value) => {
      setActiveEntryTitle(value);
      saveTitle();
    },
    [activeEntryTitle],
  );

  const saveTitle = useDebouncedCallback(async () => {
    const updatedEntry = {
      ...activeEntry,
      title: activeEntryTitle,
    };
    const updatedEntries = findAndReplaceEntry(updatedEntry);
    setData(CONTENT_KEY, updatedEntries);
    setEntries(updatedEntries);
    setActiveEntry(updatedEntry);
  }, 500);

  const value = useMemo(() => {
    return {
      entries,
      activeEntry,
      selectEntry,
      addNewEntry,
      saveContent,
      deleteEntry,
      activeEntryTitle,
      udpateActiveEntryTitle,
    };
  }, [entries, activeEntry, selectEntry, saveContent, addNewEntry]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppStore = () => {
  return useContext(AppContext);
};
