import { useMemo, useState, useEffect } from 'react';
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
import { BookOpen, Users, UserPlus, Library } from 'lucide-react';
import { useLibraryData } from '@/context/LibraryDataContext';
import { StatWidget } from '@/components/StatWidget';
import { MONTH_ORDER, type VisitorRow, type CollectionRow } from '@/utils/libraryParser';

const CLASS_COLORS: Record<string, string> = {
  Pelajar: '#3182ce',
  Mahasiswa: '#ed8936',
  'Karyawan/PNS': '#38a169',
  Umum: '#805ad5',
};

const CATEGORY_COLORS = [
  '#3182ce', '#ed8936', '#38a169', '#805ad5', '#d53f8c', '#319795',
  '#dd6b20', '#2b6cb0', '#718096', '#e53e3e', '#00b5d8', '#975a16',
];

const sumVisitorRows = (rows: VisitorRow[]) =>
  rows.reduce(
    (acc, r) => {
      acc.pelajar += r.pelajar;
      acc.mahasiswa += r.mahasiswa;
      acc.karyawan += r.karyawan;
      acc.umum += r.umum;
      acc.total += r.total;
      return acc;
    },
    { pelajar: 0, mahasiswa: 0, karyawan: 0, umum: 0, total: 0 }
  );

export default function LiteracyPage() {
  const { data, loading } = useLibraryData();
  const [selectedYear, setSelectedYear] = useState<string>('2024');

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(data.visitors.map((r) => r.tahun))).filter(Boolean);
    return years.sort().reverse();
  }, [data.visitors]);

  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // Summary stats for the selected year
  const stats = useMemo(() => {
    const visitors = sumVisitorRows(data.visitors.filter((r) => r.tahun === selectedYear));
    const members = sumVisitorRows(data.newMembers.filter((r) => r.tahun === selectedYear));
    const collections = data.collections
      .filter((r) => r.tahun === selectedYear)
      .reduce((acc, r) => acc + r.total, 0);
    return { visitors, members, collections };
  }, [data, selectedYear]);

  // Monthly visitor trend for selected year
  const monthlyTrend = useMemo(() => {
    const map = new Map<string, { bulan: string; pengunjung: number; peminjaman: number }>();
    MONTH_ORDER.forEach((m) => map.set(m, { bulan: m.slice(0, 3), pengunjung: 0, peminjaman: 0 }));
    data.visitors
      .filter((r) => r.tahun === selectedYear)
      .forEach((r) => {
        const e = map.get(r.bulan);
        if (e) e.pengunjung += r.total;
      });
    data.collections
      .filter((r) => r.tahun === selectedYear)
      .forEach((r) => {
        const e = map.get(r.bulan);
        if (e) e.peminjaman += r.total;
      });
    return Array.from(map.values());
  }, [data, selectedYear]);

  // Yearly visitor trend (all years)
  const yearlyTrend = useMemo(() => {
    const map = new Map<string, { tahun: string; pengunjung: number; anggota: number }>();
    data.visitors.forEach((r) => {
      const e = map.get(r.tahun) || { tahun: r.tahun, pengunjung: 0, anggota: 0 };
      e.pengunjung += r.total;
      map.set(r.tahun, e);
    });
    data.newMembers.forEach((r) => {
      const e = map.get(r.tahun) || { tahun: r.tahun, pengunjung: 0, anggota: 0 };
      e.anggota += r.total;
      map.set(r.tahun, e);
    });
    return Array.from(map.values()).sort((a, b) => a.tahun.localeCompare(b.tahun));
  }, [data]);

  // Visitor composition by classification
  const compositionData = useMemo(() => {
    const s = stats.visitors;
    return [
      { name: 'Pelajar', value: s.pelajar, color: CLASS_COLORS.Pelajar },
      { name: 'Mahasiswa', value: s.mahasiswa, color: CLASS_COLORS.Mahasiswa },
      { name: 'Karyawan/PNS', value: s.karyawan, color: CLASS_COLORS['Karyawan/PNS'] },
      { name: 'Umum', value: s.umum, color: CLASS_COLORS.Umum },
    ].filter((d) => d.value > 0);
  }, [stats]);

  // Book categories borrowed for selected year
  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {};
    (data.collections.filter((r) => r.tahun === selectedYear) as CollectionRow[]).forEach((r) => {
      Object.entries(r.categories).forEach(([cat, val]) => {
        totals[cat] = (totals[cat] || 0) + val;
      });
    });
    return Object.entries(totals)
      .map(([kategori, jumlah]) => ({ kategori, jumlah }))
      .sort((a, b) => b.jumlah - a.jumlah);
  }, [data, selectedYear]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="font-mono text-lg">Loading data literasi...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-[#141414] pb-4">
        <div>
          <h1 className="font-serif font-black text-2xl uppercase tracking-tight text-[#141414]">Analisis Literasi</h1>
          <p className="text-sm text-neutral-600 mt-1">Aktivitas perpustakaan daerah sebagai indikator literasi (Sumber: DISARPUS)</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm">Tahun:</span>
          <select
            value={selectedYear}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedYear(e.target.value)}
            className="border-2 border-[#141414] bg-white px-3 py-2 font-mono text-sm shadow-hd"
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
          title="Total Pengunjung"
          value={stats.visitors.total.toLocaleString()}
          icon={<Users className="w-6 h-6" />}
        />
        <StatWidget
          title="Anggota Baru"
          value={stats.members.total.toLocaleString()}
          icon={<UserPlus className="w-6 h-6" />}
        />
        <StatWidget
          title="Koleksi Dipinjam"
          value={stats.collections.toLocaleString()}
          icon={<BookOpen className="w-6 h-6" />}
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-[#141414] shadow-hd-lg p-5">
          <h2 className="font-serif font-bold text-lg mb-4">Tren Bulanan {selectedYear}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPengunjung" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3182ce" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3182ce" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPeminjaman" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ed8936" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ed8936" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Area type="monotone" dataKey="pengunjung" name="Pengunjung" stroke="#3182ce" fill="url(#colorPengunjung)" />
                <Area type="monotone" dataKey="peminjaman" name="Peminjaman" stroke="#ed8936" fill="url(#colorPeminjaman)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border-2 border-[#141414] shadow-hd-lg p-5">
          <h2 className="font-serif font-bold text-lg mb-4">Komposisi Pengunjung {selectedYear}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={compositionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(entry) => entry.name}
                >
                  {compositionData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => Number(value).toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-[#141414] shadow-hd-lg p-5">
          <h2 className="font-serif font-bold text-lg mb-4">Tren Tahunan Kunjungan & Anggota Baru</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyTrend} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tahun" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="pengunjung" name="Pengunjung" fill="#3182ce" />
                <Bar dataKey="anggota" name="Anggota Baru" fill="#38a169" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border-2 border-[#141414] shadow-hd-lg p-5">
          <h2 className="font-serif font-bold text-lg mb-4">Kategori Koleksi Dipinjam {selectedYear}</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="kategori" width={100} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => Number(value).toLocaleString()} />
                <Bar dataKey="jumlah" name="Jumlah Dipinjam">
                  {categoryData.map((entry, idx) => (
                    <Cell key={entry.kategori} fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insight footer */}
      <div className="bg-white border-2 border-[#141414] shadow-hd-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <Library className="w-5 h-5 text-blue-600" />
          <h2 className="font-serif font-bold text-lg">Insight Literasi</h2>
        </div>
        <p className="text-sm text-neutral-700 font-mono">
          Data perpustakaan daerah menjadi proksi tingkat literasi masyarakat. Dominasi kelompok{' '}
          <strong>pelajar</strong> pada kunjungan menunjukkan keterkaitan erat antara layanan perpustakaan
          dengan ekosistem pendidikan. Tren kunjungan dan peminjaman dapat dijadikan indikator pendukung
          dalam menilai minat baca serta efektivitas program literasi di Kabupaten Banjarnegara.
        </p>
      </div>
    </div>
  );
}
