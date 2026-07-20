import { Routes, Route } from 'react-router-dom';
import DefaultLayout from './layouts/default';
import OverviewPage from './pages';
import MapPage from './pages/map';
import GapPage from './pages/gap';
import DropoutPage from './pages/dropout';
import JDNPage from './pages/jdn';
import LiteracyPage from './pages/literacy';
import { SchoolDataProvider } from './context/SchoolDataContext';
import { LibraryDataProvider } from './context/LibraryDataContext';

function App() {
  return (
    <SchoolDataProvider>
      <LibraryDataProvider>
        <DefaultLayout>
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/gap" element={<GapPage />} />
            <Route path="/dropout" element={<DropoutPage />} />
            <Route path="/literacy" element={<LiteracyPage />} />
            <Route path="/jdn" element={<JDNPage />} />
          </Routes>
        </DefaultLayout>
      </LibraryDataProvider>
    </SchoolDataProvider>
  );
}

export default App;
