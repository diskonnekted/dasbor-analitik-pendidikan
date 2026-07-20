import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { fetchLibraryData, type LibraryData } from '@/utils/libraryParser';

interface LibraryDataContextType {
  data: LibraryData;
  loading: boolean;
}

const emptyData: LibraryData = { visitors: [], newMembers: [], collections: [] };

const LibraryDataContext = createContext<LibraryDataContextType | undefined>(undefined);

export function LibraryDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<LibraryData>(emptyData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const loadedData = await fetchLibraryData();
      setData(loadedData);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <LibraryDataContext.Provider value={{ data, loading }}>
      {children}
    </LibraryDataContext.Provider>
  );
}

export function useLibraryData() {
  const context = useContext(LibraryDataContext);
  if (context === undefined) {
    throw new Error('useLibraryData must be used within a LibraryDataProvider');
  }
  return context;
}
