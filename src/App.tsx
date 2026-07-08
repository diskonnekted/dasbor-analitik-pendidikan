import { Routes, Route } from 'react-router-dom';
import DefaultLayout from './layouts/default';
import OverviewPage from './pages';
import MapPage from './pages/map';
import GapPage from './pages/gap';
import DropoutPage from './pages/dropout';
import { SchoolDataProvider } from './context/SchoolDataContext';

function App() {
  return (
    <SchoolDataProvider>
      <DefaultLayout>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/gap" element={<GapPage />} />
          <Route path="/dropout" element={<DropoutPage />} />
        </Routes>
      </DefaultLayout>
    </SchoolDataProvider>
  );
}

export default App;
