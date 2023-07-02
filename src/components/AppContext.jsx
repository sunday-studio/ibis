import {
  useCallback,
  useState,
  useMemo,
  useContext,
  createContext,
  useEffect,
} from 'react';
import { getData } from '../lib/storage';

const CONTENT_KEY = 'opps-content';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [activeEntry, setActiveEntry] = useState(null);

  useEffect(() => {
    const data = getData(CONTENT_KEY) ?? [];
    setEntries(data);
    // setCurrentContentState(data?.[0]);
  }, []);

  const selectEntry = useCallback(
    (entry) => {
      setActiveEntry(entry);
    },
    [setActiveEntry],
  );

  const value = useMemo(() => {
    return {
      entries,
      activeEntry,
      selectEntry,
    };
  }, [entries, activeEntry, selectEntry]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppStore = () => {
  return useContext(AppContext);
};
