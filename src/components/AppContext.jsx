// import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// import { nanoid } from 'nanoid';
// import { useDebouncedCallback } from 'use-debounce';

// import { getData, setData } from '../lib/storage';
// import { formatDuplicatedTitle } from '../lib/utils';

// const CONTENT_KEY = 'opps-content';
// const FOLDER_KEY = 'opps-folder';
// const FAVORITE_KEY = 'opps-favorites';

// const AppContext = createContext();

// export const AppContextProvider = ({ children }) => {
//   const [entries, setEntries] = useState([]);
//   const [activeEntry, setActiveEntry] = useState(null);
//   const [activeEntryTitle, setActiveEntryTitle] = useState(activeEntry?.title);
//   const [favorites, setFavorites] = useState([]);

//   useEffect(() => {
//     const entryData = getData(CONTENT_KEY) ?? [];
//     const favoriteData = getData(FAVORITE_KEY) ?? [];
//     setEntries(entryData);
//     setFavorites(favoriteData);
//   }, []);

//   const selectEntry = useCallback(
//     (entry) => {
//       setActiveEntry(entry);
//       setActiveEntryTitle(entry.title);
//     },
//     [setActiveEntry],
//   );

//   const addNewEntry = useCallback(() => {
//     const DEFAULT_ENTRY = {
//       content: '',
//       createdAt: new Date().toISOString(),
//       title: '',
//       id: nanoid(),
//     };
//     const updatedEntries = [DEFAULT_ENTRY, ...entries];
//     setActiveEntry(DEFAULT_ENTRY);
//     setEntries(updatedEntries);
//     setActiveEntryTitle('');
//   }, [entries]);

//   // const findAndReplaceEntry = useCallback(
//   //   (updatedEntry) => {
//   //     const entryIndex = entries.findIndex((entry) => entry.id === updatedEntry.id);
//   //     let updatedEntries = entries;
//   //     updatedEntries[entryIndex] = updatedEntry;
//   //     return updatedEntries;
//   //   },
//   //   [entries],
//   // );

//   // const saveEditedContent = (editorState) => {
//   //   const entry = {
//   //     ...activeEntry,
//   //     updatedAt: new Date().toISOString(),
//   //     content: JSON.stringify(editorState),
//   //     title: activeEntryTitle,
//   //   };

//   //   const updatedEntries = findAndReplaceEntry(entry);

//   //   setEntries(updatedEntries);
//   //   setData(CONTENT_KEY, updatedEntries);
//   // };

//   // const saveContent = (editorState) => {
//   //   const activeEntryIndex = entries.findIndex((entry) => entry.id === activeEntry.id);

//   //   if (activeEntryIndex !== -1) {
//   //     saveEditedContent(editorState);
//   //     return;
//   //   }

//   //   const entry = {
//   //     id: nanoid(),
//   //     createdAt: new Date().toISOString(),
//   //     updatedAt: new Date().toISOString(),
//   //     content: JSON.stringify(editorState),
//   //     title: activeEntryTitle,
//   //   };

//   //   const updatedEntries = [entry, ...entries];

//   //   setData(CONTENT_KEY, updatedEntries);
//   //   setEntries(updatedEntries);
//   // };

//   // const deleteEntry = useCallback(
//   //   (entryId) => {
//   //     const updatedEntries = entries.filter((entry) => entry.id !== entryId);

//   //     if (entryId === activeEntry?.id) {
//   //       setActiveEntry(null);
//   //     }

//   //     setEntries(updatedEntries);
//   //     setData(CONTENT_KEY, updatedEntries);
//   //   },
//   //   [entries, activeEntry],
//   // );

//   const udpateActiveEntryTitle = useCallback(
//     (value) => {
//       setActiveEntryTitle(value);
//       saveTitle();
//     },
//     [activeEntryTitle],
//   );

//   const saveTitle = useDebouncedCallback(async () => {
//     const updatedEntry = {
//       ...activeEntry,
//       title: activeEntryTitle,
//     };
//     const updatedEntries = findAndReplaceEntry(updatedEntry);
//     setData(CONTENT_KEY, updatedEntries);
//     setEntries(updatedEntries);
//     setActiveEntry(updatedEntry);
//   }, 500);

//   // const updateFavories = useCallback(
//   //   ({ id, type }) => {
//   //     if (type === 'ADD') {
//   //       const updatedList = [...favorites, id];
//   //       setFavorites(updatedList);
//   //       setData(FAVORITE_KEY, updatedList);
//   //       return;
//   //     }
//   //     if (type === 'REMOVE') {
//   //       const updatedList = [...favorites].filter((i) => i != id);
//   //       setFavorites(updatedList);
//   //       setData(FAVORITE_KEY, updatedList);
//   //       return;
//   //     }
//   //   },
//   //   [favorites],
//   // );

//   // const duplicateEntry = useCallback(
//   //   (entry) => {
//   //     const duplicatedEntry = {
//   //       ...entry,
//   //       id: nanoid(),
//   //       title: formatDuplicatedTitle(entry.title, entry?.isDuplicate),
//   //       isDuplicate: true,
//   //     };

//   //     const updatedEntries = [duplicatedEntry, ...entries];
//   //     setData(CONTENT_KEY, updatedEntries);
//   //     setEntries(updatedEntries);
//   //   },
//   //   [entries],
//   // );

//   // const onReorder = useCallback(
//   //   (values) => {
//   //     // setData(CONTENT_KEY, values);
//   //     setEntries(values);
//   //   },
//   //   [entries, favorites, activeEntry],
//   // );

//   const value = useMemo(() => {
//     return {
//       entries,
//       activeEntry,
//       selectEntry,
//       addNewEntry,
//       saveContent,
//       deleteEntry,
//       activeEntryTitle,
//       udpateActiveEntryTitle,
//       favorites,
//       updateFavories,
//       duplicateEntry,
//       onReorder,
//     };
//   }, [
//     entries,
//     activeEntry,
//     selectEntry,
//     addNewEntry,
//     saveContent,
//     deleteEntry,
//     activeEntryTitle,
//     udpateActiveEntryTitle,
//     favorites,
//     updateFavories,
//     duplicateEntry,
//     onReorder,
//   ]);

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

// export const useAppStore = () => {
//   return useContext(AppContext);
// };
