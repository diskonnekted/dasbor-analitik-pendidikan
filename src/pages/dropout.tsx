import { useState, useMemo, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { AlertOctagon, TrendingDown, School, Sparkles, MapPin } from 'lucide-react';
import { useSchoolData } from '@/context/SchoolDataContext';
import { StatWidget } from '@/components/StatWidget';

export default function DropoutPage() {
  const { data } = useSchoolData();
  const [selectedYear, setSelectedYear] = useState<string>('2024/2025');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(data.map((r) => r.tahun_ajaran))).filter(Boolean);
    return years.sort().reverse();
  }, [data]);

  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  const riskAnalysis = useMemo(() => {
    const activeYearData = data.filter((r) => r.tahun_ajaran === selectedYear);
    if (activeYearData.length === 0) return [];
    const kecGroup = new Map<string, Record<string, any>>();
    activeYearData.forEach((row) => {
      if (!kecGroup.has(row.kecamatan)) {
        kecGroup.set(row.kecamatan, {});
      }
      kecGroup.get(row.kecamatan)![row.level] = row;
    });

    return Array.from(kecGroup.entries()).map(([kecamatan, levels]) => {
      const sd = levels['SD'] || {
        murid_negeri: 0,
        murid_swasta: 0,
        guru_negeri: 0,
        guru_swasta: 0,
        sekolah_negeri: 0,
        sekolah_swasta: 0,
      };
      const smp = levels['SMP'] || {
        murid_negeri: 0,
        murid_swasta: 0,
        guru_negeri: 0,
        guru_swasta: 0,
        sekolah_negeri: 0,
        sekolah_swasta: 0,
      };
      const sma = levels['SMA'] || {
        murid_negeri: 0,
        murid_swasta: 0,
        guru_negeri: 0,
        guru_swasta: 0,
        sekolah_negeri: 0,
        sekolah_swasta: 0,
      };
      const smk = levels['SMK'] || {
        murid_negeri: 0,
        murid_swasta: 0,
        guru_negeri: 0,
        guru_swasta: 0,
        sekolah_negeri: 0,
        sekolah_swasta: 0,
      };

      const sdStudents = sd.murid_negeri + sd.murid_swasta;
      const smpStudents = smp.murid_negeri + smp.murid_swasta;
      const smaSmkStudents =
        sma.murid_negeri + sma.murid_swasta + smk.murid_negeri + smk.murid_swasta;

      const sdCohort = sdStudents / 6;
      const smpCohort = smpStudents / 3;
      const smaSmkCohort = smaSmkStudents / 3;

      const transitionSdToSmp = sdCohort > 0 ? Math.min(1, smpCohort / sdCohort) : 0;
      const transitionSmpToSma = smpCohort > 0 ? Math.min(1, smaSmkCohort / smpCohort) : 0;

      const sdSmpLeakScore = (1 - transitionSdToSmp) * 100;
      const smpSmaLeakScore = (1 - transitionSmpToSma) * 100;
      const avgLeakage = (sdSmpLeakScore + smpSmaLeakScore) / 2;

      const sdTeachers = sd.guru_negeri + sd.guru_swasta;
      const sdRatio = sdTeachers > 0 ? sdStudents / sdTeachers : 0;
      const ratioRisk = Math.min(100, Math.max(0, (sdRatio - 15) * 5));

      const totalStudents =
        sdStudents +
        smpStudents +
        (sma.murid_negeri + sma.murid_swasta) +
        (smk.murid_negeri + smk.murid_swasta);
      const totalSwastaStudents =
        sd.murid_swasta +
        smp.murid_swasta +
        sma.murid_swasta +
        smk.murid_swasta;
      const swastaPercentage = totalStudents > 0 ? (totalSwastaStudents / totalStudents) * 100 : 0;
      const economicRisk = swastaPercentage;

      const juniorSchools = smp.sekolah_negeri + smp.sekolah_swasta;
      const seniorSchools =
        (sma.sekolah_negeri + sma.sekolah_swasta) + (smk.sekolah_negeri + smk.sekolah_swasta);
      const schoolDeficitRisk =
        juniorSchools > 0 ? Math.max(0, (1 - seniorSchools / juniorSchools) * 100) : 0;

      const compositeScore = Math.round(
        avgLeakage * 0.4 + ratioRisk * 0.25 + schoolDeficitRisk * 0.2 + economicRisk * 0.15
      );

      const drivers = [
        { name: 'Ketiadaan Sekolah Lanjutan', val: schoolDeficitRisk * 0.2 },
        { name: 'Kepadatan Kelas', val: ratioRisk * 0.25 },
        { name: 'Kebocoran Transisi', val: avgLeakage * 0.4 },
        { name: 'Beban Biaya Swasta', val: economicRisk * 0.15 },
      ].sort((a, b) => b.val - a.val);
      const mainDriver = drivers[0].name;

      return {
        kecamatan,
        compositeScore,
        sdSmpLeakScore: Math.round(sdSmpLeakScore),
        smpSmaLeakScore: Math.round(smpSmaLeakScore),
        sdRatio: parseFloat(sdRatio.toFixed(1)),
        swastaPercentage: Math.round(swastaPercentage),
        schoolDeficitRisk: Math.round(schoolDeficitRisk),
        mainDriver,
        sdStudents,
        smpStudents,
        smaSmkStudents,
        totalStudents,
      };
    }).sort((a, b) => b.compositeScore - a.compositeScore);
  }, [data, selectedYear]);

  const filteredRiskData = useMemo(() => {
    return riskAnalysis.filter((row) =>
      row.kecamatan.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [riskAnalysis, searchTerm]);

  const riskStats = useMemo(() => {
    if (riskAnalysis.length === 0) {
      return {
        avgScore: 0,
        highRiskCount: 0,
        mediumRiskCount: 0,
        lowRiskCount: 0,
      };
    }
    const scores = riskAnalysis.map((r) => r.compositeScore);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const highRiskCount = riskAnalysis.filter((r) => r.compositeScore >= 60).length;
    const mediumRiskCount = riskAnalysis.filter(
      (r) => r.compositeScore >= 40 && r.compositeScore < 60
    ).length;
    const lowRiskCount = riskAnalysis.filter((r) => r.compositeScore < 40).length;
    return { avgScore, highRiskCount, mediumRiskCount, lowRiskCount };
  }, [riskAnalysis]);

  const getRecommendation = (score: number, driver: string) => {
    if (score >= 60) {
      if (driver.includes('Ketiadaan')) return 'Prioritas: Bangun sekolah baru';
      if (driver.includes('Kepadatan')) return 'Prioritas: Tambah guru & ruang kelas';
      if (driver.includes('Beban')) return 'Prioritas: Beasiswa';
      return 'Prioritas: Program wajib belajar';
    } else if (score >= 40) {
      if (driver.includes('Ketiadaan')) return 'Optimalisasi: Transportasi sekolah';
      if (driver.includes('Kepadatan')) return 'Optimalisasi: Guru pamong';
      return 'Optimalisasi: Kejar paket';
    } else {
      return 'Pemeliharaan: Monitoring';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-[#171717] pb-4">
        <div>
          <h1 className="font-serif font-black text-2xl uppercase tracking-tight text-[#171717]">
            Prediksi Dropout
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Model analitik kerentanan anak putus sekolah
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="font-mono font-bold text-xs uppercase block mb-1">Tahun</label>
            <select
              value={selectedYear}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedYear(e.target.value)}
              className="border-2 border-[#171717] bg-white px-3 py-2 font-mono text-sm"
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-mono font-bold text-xs uppercase block mb-1">
              Cari Kecamatan
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              placeholder="Ketik nama kecamatan..."
              className="border-2 border-[#171717] bg-white px-3 py-2 font-mono text-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatWidget
          title="Kec. Risiko Tinggi"
          value={riskStats.highRiskCount}
          icon={<AlertOctagon className="w-6 h-6 text-red-600" />}
        />
        <StatWidget
          title="Risiko Sedang"
          value={riskStats.mediumRiskCount}
          icon={<TrendingDown className="w-6 h-6 text-orange-600" />}
        />
        <StatWidget
          title="Risiko Rendah"
          value={riskStats.lowRiskCount}
          icon={<School className="w-6 h-6 text-green-600" />}
        />
        <StatWidget
          title="Rata-rata Risiko"
          value={`${riskStats.avgScore}%`}
          icon={<Sparkles className="w-6 h-6 text-blue-600" />}
        />
      </div>

      <div className="bg-white border-2 border-[#171717] shadow-[4px_4px_0px_0px_#171717] p-5">
        <h2 className="font-serif font-bold text-lg mb-4">Indeks Risiko per Kecamatan</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={riskAnalysis}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                domain={[0, 100]}
                label={{ value: 'Indeks (%)', position: 'insideBottom', offset: -10 }}
              />
              <YAxis
                dataKey="kecamatan"
                type="category"
                tick={{ fontSize: 11 }}
                width={80}
              />
              <Tooltip formatter={(value) => [`${value}%`, 'Indeks Risiko']} />
              <Bar dataKey="compositeScore" radius={[0, 4, 4, 0]}>
                {riskAnalysis.map((entry, index) => {
                  let fill = '#48bb78';
                  if (entry.compositeScore >= 60) fill = '#e53e3e';
                  else if (entry.compositeScore >= 40) fill = '#dd6b20';
                  return <Cell key={`cell-${index}`} fill={fill} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border-2 border-[#171717] shadow-[4px_4px_0px_0px_#171717] p-5 overflow-x-auto">
        <h2 className="font-serif font-bold text-lg mb-4">Tabel Risiko & Rekomendasi</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="border-2 border-[#171717] px-4 py-2 text-left font-mono font-bold text-xs uppercase">
                No
              </th>
              <th className="border-2 border-[#171717] px-4 py-2 text-left font-mono font-bold text-xs uppercase">
                Kecamatan
              </th>
              <th className="border-2 border-[#171717] px-4 py-2 text-right font-mono font-bold text-xs uppercase">
                Skor Risiko
              </th>
              <th className="border-2 border-[#171717] px-4 py-2 text-center font-mono font-bold text-xs uppercase">
                Kategori
              </th>
              <th className="border-2 border-[#171717] px-4 py-2 text-left font-mono font-bold text-xs uppercase">
                Pemicu
              </th>
              <th className="border-2 border-[#171717] px-4 py-2 text-left font-mono font-bold text-xs uppercase">
                Rekomendasi
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRiskData.map((row, index) => {
              let badgeColor = '#38a169';
              let badgeBg = '#c6f6d5';
              let badgeLabel = 'Rendah';
              if (row.compositeScore >= 60) {
                badgeColor = '#e53e3e';
                badgeBg = '#fed7d7';
                badgeLabel = 'Tinggi';
              } else if (row.compositeScore >= 40) {
                badgeColor = '#dd6b20';
                badgeBg = '#feebc8';
                badgeLabel = 'Sedang';
              }
              return (
                <tr key={row.kecamatan} className="hover:bg-blue-50">
                  <td className="border-2 border-[#171717] px-4 py-2 font-mono">{index + 1}</td>
                  <td className="border-2 border-[#171717] px-4 py-2 font-mono font-bold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-neutral-500" />
                    {row.kecamatan}
                  </td>
                  <td
                    className="border-2 border-[#171717] px-4 py-2 text-right font-mono font-bold text-lg"
                    style={{ color: badgeColor }}
                  >
                    {row.compositeScore}%
                  </td>
                  <td className="border-2 border-[#171717] px-4 py-2 text-center">
                    <span
                      className="inline-block px-3 py-1 border-2 border-[#171717] bg-white font-mono font-bold text-xs"
                      style={{ backgroundColor: badgeBg }}
                    >
                      {badgeLabel}
                    </span>
                  </td>
                  <td className="border-2 border-[#171717] px-4 py-2 font-mono text-xs text-neutral-700">
                    {row.mainDriver}
                  </td>
                  <td className="border-2 border-[#171717] px-4 py-2 font-mono text-xs text-blue-700 font-bold">
                    {getRecommendation(row.compositeScore, row.mainDriver)}
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
