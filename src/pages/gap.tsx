import { useState, useMemo, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { AlertTriangle, Users, UserCheck } from 'lucide-react';
import { useSchoolData } from '@/context/SchoolDataContext';
import { StatWidget } from '@/components/StatWidget';

export default function GapPage() {
  const { data } = useSchoolData();
  const [selectedYear, setSelectedYear] = useState<string>('2024/2025');
  const [selectedLevel, setSelectedLevel] = useState<string>('SD');

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(data.map((r) => r.tahun_ajaran))).filter(Boolean);
    return years.sort().reverse();
  }, [data]);

  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  const targetRatios: Record<string, number> = {
    TK: 15,
    SD: 20,
    SMP: 24,
    SMA: 26,
    SMK: 26,
  };
  const activeTargetRatio = targetRatios[selectedLevel] || 20;

  const analysisData = useMemo(() => {
    const filtered = data.filter(
      (r) => r.tahun_ajaran === selectedYear && r.level === selectedLevel
    );
    const map = new Map<string, any>();
    filtered.forEach((r) => {
      const existing = map.get(r.kecamatan) || {
        kecamatan: r.kecamatan,
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
      map.set(r.kecamatan, existing);
    });
    return Array.from(map.values())
      .map((kec) => {
        const totalMurid = kec.murid_negeri + kec.murid_swasta;
        const totalGuru = kec.guru_negeri + kec.guru_swasta;
        const ratio = totalGuru > 0 ? parseFloat((totalMurid / totalGuru).toFixed(1)) : 0;
        const totalSekolah = kec.sekolah_negeri + kec.sekolah_swasta;
        return {
          ...kec,
          totalMurid,
          totalGuru,
          totalSekolah,
          rasioGuruMurid: ratio,
          swastaPercentage: totalMurid > 0 ? Math.round((kec.murid_swasta / totalMurid) * 100) : 0,
        };
      })
      .sort((a, b) => b.rasioGuruMurid - a.rasioGuruMurid);
  }, [data, selectedYear, selectedLevel]);

  const summaryStats = useMemo(() => {
    if (analysisData.length === 0)
      return {
        avgRatio: 0,
        maxRatioKec: '-',
        maxRatio: 0,
        minRatioKec: '-',
        minRatio: 0,
      };
    let totalM = 0;
    let totalG = 0;
    analysisData.forEach((d) => {
      totalM += d.totalMurid;
      totalG += d.totalGuru;
    });
    const avgRatio = totalG > 0 ? parseFloat((totalM / totalG).toFixed(1)) : 0;
    const sortedRatios = [...analysisData].filter((d) => d.rasioGuruMurid > 0);
    if (sortedRatios.length === 0) {
      return {
        avgRatio,
        maxRatioKec: '-',
        maxRatio: 0,
        minRatioKec: '-',
        minRatio: 0,
      };
    }
    const maxItem = sortedRatios[0];
    const minItem = sortedRatios[sortedRatios.length - 1];
    return {
      avgRatio,
      maxRatioKec: maxItem.kecamatan,
      maxRatio: maxItem.rasioGuruMurid,
      minRatioKec: minItem.kecamatan,
      minRatio: minItem.rasioGuruMurid,
    };
  }, [analysisData]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-[#171717] pb-4">
        <div>
          <h1 className="font-serif font-black text-2xl uppercase tracking-tight text-[#171717]">Analisis Kesenjangan</h1>
          <p className="text-sm text-neutral-600 mt-1">Analisis ketimpangan rasio guru-murid dan ketergantungan sekolah swasta</p>
        </div>
        <div className="flex gap-4">
          <div>
            <label className="font-mono font-bold text-xs uppercase block mb-1">Tahun</label>
            <select
              value={selectedYear}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedYear(e.target.value)}
              className="border-2 border-[#171717] bg-white px-3 py-2 font-mono text-sm"
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-mono font-bold text-xs uppercase block mb-1">Jenjang</label>
            <select
              value={selectedLevel}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedLevel(e.target.value)}
              className="border-2 border-[#171717] bg-white px-3 py-2 font-mono text-sm"
            >
              <option value="TK">TK</option>
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA">SMA</option>
              <option value="SMK">SMK</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatWidget
          title="Rasio Rata-rata"
          value={`1 : ${summaryStats.avgRatio}`}
          icon={<Users className="w-6 h-6" />}
        />
        <StatWidget
          title={`Kec. Padat (${summaryStats.maxRatioKec})`}
          value={`1 : ${summaryStats.maxRatio}`}
          icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
        />
        <StatWidget
          title={`Kec. Renggang (${summaryStats.minRatioKec})`}
          value={`1 : ${summaryStats.minRatio}`}
          icon={<UserCheck className="w-6 h-6 text-green-600" />}
        />
      </div>

      <div className="bg-white border-2 border-[#171717] shadow-[4px_4px_0px_0px_#171717] p-5">
        <h2 className="font-serif font-bold text-lg mb-4">Rasio Guru-Murid per Kecamatan</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={analysisData}
              margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="kecamatan"
                angle={-45}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 11 }}
              />
              <YAxis label={{ value: 'Murid per Guru', angle: -90, position: 'insideLeft', offset: 10 }} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Bar
                name="Rasio Guru-Murid"
                dataKey="rasioGuruMurid"
                fill="#3182ce"
                radius={[4, 4, 0, 0]}
              />
              <ReferenceLine
                y={activeTargetRatio}
                stroke="#e53e3e"
                strokeDasharray="5 5"
                label={{ value: `Standar (${activeTargetRatio})`, position: 'top', fill: '#e53e3e', fontSize: 10 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border-2 border-[#171717] shadow-[4px_4px_0px_0px_#171717] p-5">
        <h2 className="font-serif font-bold text-lg mb-4">Proporsi Negeri vs Swasta</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={analysisData}
              margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
              stackOffset="expand"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="kecamatan"
                angle={-45}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 11 }}
              />
              <YAxis tickFormatter={(val) => `${Math.round(val * 100)}%`} />
              <Tooltip formatter={(value) => `${(value as number).toLocaleString()} siswa`} />
              <Legend verticalAlign="top" height={36} />
              <Bar name="Negeri" dataKey="murid_negeri" stackId="a" fill="#3182ce" />
              <Bar name="Swasta" dataKey="murid_swasta" stackId="a" fill="#ed8936" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border-2 border-[#171717] shadow-[4px_4px_0px_0px_#171717] p-5 overflow-x-auto">
        <h2 className="font-serif font-bold text-lg mb-4">Tabel Detail</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="border-2 border-[#171717] px-4 py-2 text-left font-mono font-bold text-xs uppercase">No</th>
              <th className="border-2 border-[#171717] px-4 py-2 text-left font-mono font-bold text-xs uppercase">Kecamatan</th>
              <th className="border-2 border-[#171717] px-4 py-2 text-right font-mono font-bold text-xs uppercase">Sekolah</th>
              <th className="border-2 border-[#171717] px-4 py-2 text-right font-mono font-bold text-xs uppercase">Guru</th>
              <th className="border-2 border-[#171717] px-4 py-2 text-right font-mono font-bold text-xs uppercase">Murid</th>
              <th className="border-2 border-[#171717] px-4 py-2 text-right font-mono font-bold text-xs uppercase">Rasio</th>
              <th className="border-2 border-[#171717] px-4 py-2 text-right font-mono font-bold text-xs uppercase">% Swasta</th>
              <th className="border-2 border-[#171717] px-4 py-2 text-center font-mono font-bold text-xs uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {analysisData.map((row, index) => {
              const ratio = row.rasioGuruMurid;
              let statusColor = 'text-green-600';
              let statusLabel = 'Sesuai';
              if (ratio > activeTargetRatio + 5) {
                statusColor = 'text-red-600';
                statusLabel = 'Sangat Padat';
              } else if (ratio > activeTargetRatio) {
                statusColor = 'text-orange-600';
                statusLabel = 'Padat';
              } else if (ratio < activeTargetRatio - 7) {
                statusColor = 'text-blue-600';
                statusLabel = 'Sangat Renggang';
              }
              return (
                <tr key={row.kecamatan} className="hover:bg-blue-50">
                  <td className="border-2 border-[#171717] px-4 py-2 font-mono">{index + 1}</td>
                  <td className="border-2 border-[#171717] px-4 py-2 font-mono font-bold">{row.kecamatan}</td>
                  <td className="border-2 border-[#171717] px-4 py-2 text-right font-mono">
                    {row.totalSekolah}
                    <span className="text-neutral-500 text-xs ml-1">
                      ({row.sekolah_negeri}/{row.sekolah_swasta})
                    </span>
                  </td>
                  <td className="border-2 border-[#171717] px-4 py-2 text-right font-mono">
                    {row.totalGuru.toLocaleString()}
                    <span className="text-neutral-500 text-xs ml-1">
                      ({row.guru_negeri}/{row.guru_swasta})
                    </span>
                  </td>
                  <td className="border-2 border-[#171717] px-4 py-2 text-right font-mono">
                    {row.totalMurid.toLocaleString()}
                    <span className="text-neutral-500 text-xs ml-1">
                      ({row.murid_negeri}/{row.murid_swasta})
                    </span>
                  </td>
                  <td className="border-2 border-[#171717] px-4 py-2 text-right font-mono font-bold" style={{ color: statusColor === 'text-red-600' ? '#e53e3e' : 'inherit' }}>
                    1 : {ratio}
                  </td>
                  <td className="border-2 border-[#171717] px-4 py-2 text-right font-mono">
                    {row.swastaPercentage}%
                  </td>
                  <td className="border-2 border-[#171717] px-4 py-2 text-center font-mono font-bold" style={{ color: statusColor.replace('text-', '') === 'red-600' ? '#e53e3e' : statusColor.replace('text-', '') === 'orange-600' ? '#dd6b20' : statusColor.replace('text-', '') === 'blue-600' ? '#3182ce' : '#38a169' }}>
                    {statusLabel}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
