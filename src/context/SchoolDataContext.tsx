import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { fetchLocalSchoolData, type SchoolDataRow } from '@/utils/csvParser';

interface SchoolDataContextType {
  data: SchoolDataRow[];
  loading: boolean;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

export function SchoolDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SchoolDataRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const loadedData = await fetchLocalSchoolData();
      setData(loadedData);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <SchoolDataContext.Provider value={{ data, loading }}>
      {children}
    </SchoolDataContext.Provider>
  );
}

export function useSchoolData() {
  const context = useContext(SchoolDataContext);
  if (context === undefined) {
    throw new Error('useSchoolData must be used within a SchoolDataProvider');
  }
  return context;
}
