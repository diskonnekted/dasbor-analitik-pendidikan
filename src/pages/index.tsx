import { useState, useMemo, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  School,
  Users,
  GraduationCap,
} from 'lucide-react';
import { useSchoolData } from '@/context/SchoolDataContext';
import { StatWidget } from '@/components/StatWidget';

export default function OverviewPage() {
  const { data, loading } = useSchoolData();
  const [selectedYear, setSelectedYear] = useState<string>('2024/2025');

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(data.map((r) => r.tahun_ajaran))).filter(Boolean);
    return years.sort().reverse();
  }, [data]);

  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // Stats
  const stats = useMemo(() => {
    const filtered = data.filter((r) => r.tahun_ajaran === selectedYear);
    let schoolsN = 0;
    let schoolsS = 0;
    let teachersN = 0;
    let teachersS = 0;
    let studentsN = 0;
    let studentsS = 0;

    filtered.forEach((r) => {
      schoolsN += r.sekolah_negeri;
      schoolsS += r.sekolah_swasta;
      teachersN += r.guru_negeri;
      teachersS += r.guru_swasta;
      studentsN += r.murid_negeri;
      studentsS += r.murid_swasta;
    });

    return {
      schools: { total: schoolsN + schoolsS, negeri: schoolsN, swasta: schoolsS },
      teachers: { total: teachersN + teachersS, negeri: teachersN, swasta: teachersS },
      students: { total: studentsN + studentsS, negeri: studentsN, swasta: studentsS },
    };
  }, [data, selectedYear]);

  // Trend data
  const trendData = useMemo(() => {
    const yearsMap = new Map<string, { tahun: string; totalMurid: number; muridNegeri: number; muridSwasta: number }>();

    data.forEach((r) => {
      if (!r.tahun_ajaran) return;
      const existing = yearsMap.get(r.tahun_ajaran) || {
        tahun: r.tahun_ajaran,
        totalMurid: 0,
        muridNegeri: 0,
        muridSwasta: 0,
      };
      existing.totalMurid += r.murid_negeri + r.murid_swasta;
      existing.muridNegeri += r.murid_negeri;
      existing.muridSwasta += r.murid_swasta;
      yearsMap.set(r.tahun_ajaran, existing);
    });

    return Array.from(yearsMap.values()).sort((a, b) => a.tahun.localeCompare(b.tahun));
  }, [data]);

  // Level breakdown
  const levelBreakdownData = useMemo(() => {
    const levelsMap = new Map<string, { level: string; sekolah: number; guru: number; murid: number }>();
    const levelsOrder = ['TK', 'SD', 'SMP', 'SMA', 'SMK'];
    levelsOrder.forEach(lvl => {
      levelsMap.set(lvl, { level: lvl, sekolah: 0, guru: 0, murid: 0 });
    });
    data.filter((r) => r.tahun_ajaran === selectedYear).forEach((r) => {
      const existing = levelsMap.get(r.level);
      if (existing) {
        existing.sekolah += r.sekolah_negeri + r.sekolah_swasta;
        existing.guru += r.guru_negeri + r.guru_swasta;
        existing.murid += r.murid_negeri + r.murid_swasta;
      }
    });
    return Array.from(levelsMap.values());
  }, [data, selectedYear]);

  const pieData = useMemo(() => [
    { name: 'Negeri (Public)', value: stats.students.negeri, color: '#3182ce' },
    { name: 'Swasta (Private)', value: stats.students.swasta, color: '#ed8936' },
  ], [stats]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="font-mono text-lg">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-[#171717] pb-4">
        <div>
          <h1 className="font-serif font-black text-2xl uppercase tracking-tight text-[#171717]">Overview Statistik</h1>
          <p className="text-sm text-neutral-600 mt-1">Visualisasi profil dan data historis pendidikan di Kabupaten Banjarnegara</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm">Tahun Ajaran:</span>
          <select
            value={selectedYear}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedYear(e.target.value)}
            className="border-2 border-[#171717] bg-white px-3 py-2 font-mono text-sm shadow-[2px_2px_0px_0px_#171717]"
          >
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatWidget
          title="Total Lembaga Sekolah"
          value={stats.schools.total.toLocaleString()}
          icon={<School className="w-6 h-6" />}
        />
        <StatWidget
          title="Total Tenaga Pendidik"
          value={stats.teachers.total.toLocaleString()}
          icon={<Users className="w-6 h-6" />}
        />
        <StatWidget
          title="Total Siswa Terdaftar"
          value={stats.students.total.toLocaleString()}
          icon={<GraduationCap className="w-6 h-6" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-[#171717] shadow-[4px_4px_0px_0px_#171717] p-5">
          <h2 className="font-serif font-bold text-lg mb-4">Tren Historis Siswa</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMurid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3182ce" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3182ce" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tahun" />
                <YAxis />
                <Tooltip formatter={(value) => `${(value as number).toLocaleString()} siswa`} />
                <Legend />
                <Area name="Total Murid" type="monotone" dataKey="totalMurid" stroke="#3182ce" fillOpacity={1} fill="url(#colorMurid)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border-2 border-[#171717] shadow-[4px_4px_0px_0px_#171717] p-5">
          <h2 className="font-serif font-bold text-lg mb-4">Distribusi per Jenjang</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelBreakdownData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip formatter={(value) => `${(value as number).toLocaleString()} siswa`} />
                <Legend />
                <Bar name="Jumlah Siswa" dataKey="murid" fill="#48bb78" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-[#171717] shadow-[4px_4px_0px_0px_#171717] p-5">
          <h2 className="font-serif font-bold text-lg mb-4">Proporsi Negeri vs Swasta</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${Math.round((entry.value / stats.students.total) * 100)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${(value as number).toLocaleString()} siswa`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white border-2 border-[#171717] shadow-[4px_4px_0px_0px_#171717] p-5">
          <h2 className="font-serif font-bold text-lg mb-4">Detail per Jenjang</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border-2 border-[#171717] px-4 py-2 text-left font-mono font-bold text-xs uppercase">Jenjang</th>
                  <th className="border-2 border-[#171717] px-4 py-2 text-right font-mono font-bold text-xs uppercase">Sekolah</th>
                  <th className="border-2 border-[#171717] px-4 py-2 text-right font-mono font-bold text-xs uppercase">Guru</th>
                  <th className="border-2 border-[#171717] px-4 py-2 text-right font-mono font-bold text-xs uppercase">Murid</th>
                  <th className="border-2 border-[#171717] px-4 py-2 text-right font-mono font-bold text-xs uppercase">Rasio</th>
                </tr>
              </thead>
              <tbody>
                {levelBreakdownData.map((row) => {
                  const ratio = row.guru > 0 ? (row.murid / row.guru).toFixed(1) : '0';
                  return (
                    <tr key={row.level} className="hover:bg-blue-50">
                      <td className="border-2 border-[#171717] px-4 py-2 font-mono font-bold">{row.level}</td>
                      <td className="border-2 border-[#171717] px-4 py-2 text-right font-mono">{row.sekolah.toLocaleString()}</td>
                      <td className="border-2 border-[#171717] px-4 py-2 text-right font-mono">{row.guru.toLocaleString()}</td>
                      <td className="border-2 border-[#171717] px-4 py-2 text-right font-mono">{row.murid.toLocaleString()}</td>
                      <td className="border-2 border-[#171717] px-4 py-2 text-right font-mono font-bold">1 : {ratio}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
