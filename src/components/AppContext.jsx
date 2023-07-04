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

const CONTENT_KEY = 'opps-content';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [activeEntry, setActiveEntry] = useState(null);

  useEffect(() => {
    const data = getData(CONTENT_KEY) ?? [];
    setEntries(data);
  }, []);

  const selectEntry = useCallback(
    (entry) => {
      setActiveEntry(entry);
    },
    [setActiveEntry],
  );

  const addNewEntry = useCallback(() => {
    console.log('called');
    setActiveEntry({
      content: '',
      createdAt: new Date().toISOString(),
      title: 'Undefined',
      id: nanoid(),
    });
  }, []);

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
    const firstTextChild =
      editorState?.root?.children?.[0]?.children?.[0]?.text ?? new Date().toISOString();

    const entry = {
      ...activeEntry,
      updatedAt: new Date().toISOString(),
      content: JSON.stringify(editorState),
      title: firstTextChild,
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

    const firstTextChild =
      editorState?.root?.children?.[0]?.children?.[0]?.text ?? new Date().toISOString();

    const entry = {
      id: nanoid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: JSON.stringify(editorState),
      title: firstTextChild,
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

  const value = useMemo(() => {
    return {
      entries,
      activeEntry,
      selectEntry,
      addNewEntry,
      saveContent,
      deleteEntry,
    };
  }, [entries, activeEntry, selectEntry, saveContent, addNewEntry]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppStore = () => {
  return useContext(AppContext);
};
