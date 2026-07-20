import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSchoolData } from '@/context/SchoolDataContext';

export default function MapPage() {
  const { data } = useSchoolData();
  const [geoData, setGeoData] = useState<any>(null);
  const [loadingMap, setLoadingMap] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<string>('murid');
  const [selectedLevel, setSelectedLevel] = useState<string>('SD');
  const [selectedYear, setSelectedYear] = useState<string>('2024/2025');
  const [selectedKecDetail, setSelectedKecDetail] = useState<any>(null);

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const response = await fetch('/peta_kecamatan.geojson');
        setGeoData(await response.json());
      } catch (error) {
        console.error('Error loading geojson:', error);
      } finally {
        setLoadingMap(false);
      }
    };

    loadMapData();
  }, []);

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(data.map((r) => r.tahun_ajaran))).filter(Boolean);
    return years.sort().reverse();
  }, [data]);

  const normalizeName = (name: string): string => {
    if (!name) return '';
    return name.trim().toLowerCase().replace(/\s/g, '');
  };

  const mappedStats = useMemo(() => {
    const filtered = data.filter(
      (r) => r.tahun_ajaran === selectedYear && r.level === selectedLevel
    );
    const statsMap = new Map<string, any>();
    filtered.forEach((r) => {
      const normName = normalizeName(r.kecamatan);
      const existing = statsMap.get(normName) || {
        rawName: r.kecamatan,
        sekolah_negeri: 0,
        sekolah_swasta: 0,
        guru_negeri: 0,
        guru_swasta: 0,
        murid_negeri: 0,
        murid_swasta: 0,
      };
      existing.sekolah_negeri += r.sekolah_negeri;
      existing.sekolah_swasta += r.sekolah_swasta;
      existing.guru_negeri += r.guru_negeri;
      existing.guru_swasta += r.guru_swasta;
      existing.murid_negeri += r.murid_negeri;
      existing.murid_swasta += r.murid_swasta;
      statsMap.set(normName, existing);
    });
    const finalStats: Record<string, any> = {};
    statsMap.forEach((val, key) => {
      const totalMurid = val.murid_negeri + val.murid_swasta;
      const totalGuru = val.guru_negeri + val.guru_swasta;
      const totalSekolah = val.sekolah_negeri + val.sekolah_swasta;
      const rasio = totalGuru > 0 ? parseFloat((totalMurid / totalGuru).toFixed(1)) : 0;
      finalStats[key] = {
        ...val,
        totalMurid,
        totalGuru,
        totalSekolah,
        rasio,
      };
    });
    return finalStats;
  }, [data, selectedYear, selectedLevel]);

  const limits = useMemo(() => {
    const values = Object.values(mappedStats);
    if (values.length === 0) return { maxMurid: 100, maxGuru: 10, maxSekolah: 5, maxRasio: 40 };
    return {
      maxMurid: Math.max(...values.map((v: any) => v.totalMurid)),
      maxGuru: Math.max(...values.map((v: any) => v.totalGuru)),
      maxSekolah: Math.max(...values.map((v: any) => v.totalSekolah)),
      maxRasio: Math.max(...values.map((v: any) => v.rasio)),
    };
  }, [mappedStats]);

  const getColor = (normName: string): string => {
    const stats = mappedStats[normName];
    if (!stats) return '#E2E8F0';
    if (selectedMetric === 'murid') {
      const val = stats.totalMurid;
      const ratio = limits.maxMurid > 0 ? val / limits.maxMurid : 0;
      if (ratio > 0.8) return '#1A365D';
      if (ratio > 0.6) return '#2B6CB0';
      if (ratio > 0.4) return '#4299E1';
      if (ratio > 0.2) return '#63B3ED';
      return '#EBF8FF';
    }
    if (selectedMetric === 'guru') {
      const val = stats.totalGuru;
      const ratio = limits.maxGuru > 0 ? val / limits.maxGuru : 0;
      if (ratio > 0.8) return '#22543D';
      if (ratio > 0.6) return '#2F855A';
      if (ratio > 0.4) return '#48BB78';
      if (ratio > 0.2) return '#68D391';
      return '#F0FFF4';
    }
    if (selectedMetric === 'sekolah') {
      const val = stats.totalSekolah;
      const ratio = limits.maxSekolah > 0 ? val / limits.maxSekolah : 0;
      if (ratio > 0.8) return '#553C9A';
      if (ratio > 0.6) return '#6B46C1';
      if (ratio > 0.4) return '#805AD5';
      if (ratio > 0.2) return '#B794F4';
      return '#FAF5FF';
    }
    if (selectedMetric === 'rasio') {
      const val = stats.rasio;
      if (val > 30) return '#9B2C2C';
      if (val > 25) return '#C53030';
      if (val > 20) return '#DD6B20';
      if (val > 15) return '#ECC94B';
      if (val > 10) return '#48BB78';
      return '#3182CE';
    }
    return '#CBD5E0';
  };

  const onEachFeature = (feature: any, layer: any) => {
    const rawKecName = feature?.properties?.Kecamatan || '';
    const normName = normalizeName(rawKecName);

    layer.on({
      mouseover: () => {
        const stats = mappedStats[normName] || {
          rawName: rawKecName,
          sekolah_negeri: 0,
          sekolah_swasta: 0,
          guru_negeri: 0,
          guru_swasta: 0,
          murid_negeri: 0,
          murid_swasta: 0,
          totalMurid: 0,
          totalGuru: 0,
          totalSekolah: 0,
          rasio: 0,
        };
        setSelectedKecDetail(stats);
      },
      click: () => {
        const stats = mappedStats[normName] || {
          rawName: rawKecName,
          sekolah_negeri: 0,
          sekolah_swasta: 0,
          guru_negeri: 0,
          guru_swasta: 0,
          murid_negeri: 0,
          murid_swasta: 0,
          totalMurid: 0,
          totalGuru: 0,
          totalSekolah: 0,
          rasio: 0,
        };
        setSelectedKecDetail(stats);
      },
    });
  };

  if (loadingMap) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="font-mono text-lg">Loading peta...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-200px)]">
      <div className="w-full md:w-80 bg-white border-2 border-[#141414] shadow-hd-lg p-5 flex flex-col gap-4 overflow-y-auto">
        <div>
          <h2 className="font-serif font-black text-xl uppercase mb-2">Pengaturan Peta</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="font-mono font-bold text-xs uppercase block mb-1">Jenjang</label>
            <select
              value={selectedLevel}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedLevel(e.target.value)}
              className="w-full border-2 border-[#141414] bg-white px-3 py-2 font-mono text-sm"
            >
              <option value="TK">TK</option>
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA">SMA</option>
              <option value="SMK">SMK</option>
            </select>
          </div>
          <div>
            <label className="font-mono font-bold text-xs uppercase block mb-1">Tahun</label>
            <select
              value={selectedYear}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedYear(e.target.value)}
              className="w-full border-2 border-[#141414] bg-white px-3 py-2 font-mono text-sm"
            >
              {availableYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-mono font-bold text-xs uppercase block mb-1">Metrik</label>
            <select
              value={selectedMetric}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMetric(e.target.value)}
              className="w-full border-2 border-[#141414] bg-white px-3 py-2 font-mono text-sm"
            >
              <option value="murid">Total Murid</option>
              <option value="guru">Total Guru</option>
              <option value="sekolah">Total Sekolah</option>
              <option value="rasio">Rasio Guru-Murid</option>
            </select>
          </div>
        </div>

        {selectedKecDetail ? (
          <div className="border-2 border-[#141414] p-4">
            <h3 className="font-serif font-bold text-lg mb-2">{selectedKecDetail.rawName}</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-mono text-xs text-neutral-500 uppercase">Sekolah</p>
                <p className="font-mono font-bold text-xl">{selectedKecDetail.totalSekolah}</p>
                <p className="font-mono text-xs text-neutral-500">
                  ({selectedKecDetail.sekolah_negeri}/{selectedKecDetail.sekolah_swasta})
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-neutral-500 uppercase">Rasio</p>
                <p className="font-mono font-bold text-xl text-red-600">
                  1 : {selectedKecDetail.rasio}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <p className="font-mono text-xs text-neutral-500 uppercase mb-1">Guru</p>
              <p className="font-mono">
                Total: <span className="font-bold">{selectedKecDetail.totalGuru.toLocaleString()}</span>
              </p>
              <p className="font-mono text-xs">
                Negeri: {selectedKecDetail.guru_negeri.toLocaleString()} / Swasta: {selectedKecDetail.guru_swasta.toLocaleString()}
              </p>
            </div>
            <div className="mt-3">
              <p className="font-mono text-xs text-neutral-500 uppercase mb-1">Murid</p>
              <p className="font-mono">
                Total: <span className="font-bold text-blue-600">{selectedKecDetail.totalMurid.toLocaleString()}</span>
              </p>
              <p className="font-mono text-xs">
                Negeri: {selectedKecDetail.murid_negeri.toLocaleString()} / Swasta: {selectedKecDetail.murid_swasta.toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-neutral-400 p-6 text-center text-neutral-500 font-mono text-sm">
            Arahkan kursor ke kecamatan untuk melihat detail
          </div>
        )}

        <div>
          <p className="font-mono font-bold text-xs uppercase mb-2">Legenda</p>
          {selectedMetric === 'rasio' ? (
            <div className="space-y-1 text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-800"></div>
                <span>&gt; 30 (Sangat Padat)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600"></div>
                <span>25-30 (Padat)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500"></div>
                <span>20-25 (Sedang)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400"></div>
                <span>15-20 (Renggang)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500"></div>
                <span>&lt; 15 (Sangat Renggang)</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1 text-xs font-mono">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4"
                  style={{
                    backgroundColor:
                      selectedMetric === 'murid'
                        ? '#1A365D'
                        : selectedMetric === 'guru'
                        ? '#22543D'
                        : '#553C9A',
                  }}
                ></div>
                <span>Kerapatan Tinggi</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4"
                  style={{
                    backgroundColor:
                      selectedMetric === 'murid'
                        ? '#63B3ED'
                        : selectedMetric === 'guru'
                        ? '#68D391'
                        : '#B794F4',
                  }}
                ></div>
                <span>Kerapatan Sedang</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4"
                  style={{
                    backgroundColor:
                      selectedMetric === 'murid'
                        ? '#EBF8FF'
                        : selectedMetric === 'guru'
                        ? '#F0FFF4'
                        : '#FAF5FF',
                  }}
                ></div>
                <span>Kerapatan Rendah</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 border-2 border-[#141414] shadow-hd-lg overflow-hidden">
        <MapContainer
          center={[-7.3941, 109.6961]}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON
            key={`${selectedMetric}-${selectedLevel}-${selectedYear}`}
            data={geoData}
            onEachFeature={onEachFeature}
            style={(feature) => {
              const rawName = feature?.properties?.Kecamatan || '';
              const normName = normalizeName(rawName);
              const color = getColor(normName);
              return {
                fillColor: color,
                weight: 2,
                opacity: 1,
                color: '#141414',
                dashArray: '3',
                fillOpacity: 0.7,
              };
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
}
