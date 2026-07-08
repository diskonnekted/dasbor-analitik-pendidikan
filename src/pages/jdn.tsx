import { Info, ShieldCheck, Globe, Users, TrendingUp, FileText, BrainCog, Sparkles, CheckCircle2 } from "lucide-react";

export default function JDNPage() {
  const roadmapPhases = [
    {
      phase: "Phase 1: Peningkatan Kualitas Data (Q3 2026)",
      items: [
        "Validasi dan cleaning data historis lebih lanjut",
        "Integrasi data tambahan (data ujian nasional, data kesejahteraan guru)",
        "Penambahan filter dan pengelompokan data yang lebih fleksibel",
        "Peningkatan performa loading data",
        "Penambahan fitur pencarian data yang lebih canggih"
      ],
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      phase: "Phase 2: Fitur Analisis Lanjutan (Q4 2026)",
      items: [
        "Analisis tren multi-tahun dengan prediksi",
        "Dashboard perbandingan antar kecamatan dan antar jenjang",
        "Ekspor laporan ke format PDF/Excel",
        "Notifikasi untuk indikator kritis",
        "Dashboard mobile-friendly yang lebih optimal"
      ],
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      phase: "Phase 3: AI-Powered Analytics (Q1 2027)",
      items: [
        "Analisis prediktif dengan AI untuk risiko dropout yang lebih akurat",
        "Rekomendasi AI untuk penempatan guru dan sumber daya pendidikan",
        "Chatbot AI untuk menjawab pertanyaan tentang data pendidikan",
        "Analisis clustering kecamatan untuk pengelompokan berbasis karakteristik pendidikan",
        "Deteksi anomali data dengan machine learning"
      ],
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
    {
      phase: "Phase 4: Kolaborasi dan Keterlibatan Masyarakat (Q2 2027)",
      items: [
        "Fitur komentar dan diskusi publik",
        "Integrasi dengan sistem informasi pendidikan pemerintah daerah",
        "Aksesibilitas untuk pengguna dengan keterbatasan (WCAG 2.1)",
        "Multi-bahasa (Indonesia dan Inggris)",
        "Program edukasi penggunaan dashboard untuk masyarakat"
      ],
      color: "text-orange-600",
      bg: "bg-orange-100"
    },
    {
      phase: "Phase 5: Optimisasi dan Pemeliharaan (Q3-Q4 2027)",
      items: [
        "Pengujian performa dan stabilitas",
        "Dokumentasi API dan developer guide",
        "Program pemeliharaan rutin dan update data",
        "Pengumpulan umpan balik pengguna untuk perbaikan berkelanjutan",
        "Penambahan fitur advanced data visualization"
      ],
      color: "text-teal-600",
      bg: "bg-teal-100"
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-[#171717] pb-4">
        <div>
          <h1 className="font-serif font-black text-2xl uppercase tracking-tight text-[#171717]">Tentang JDN</h1>
          <p className="text-sm text-neutral-600 mt-1">Jaringan Data Nasional untuk Pendidikan Kabupaten Banjarnegara</p>
        </div>
      </div>

      {/* JDN Hero Card */}
      <div className="bg-white border-2 border-[#171717] shadow-[4px_4px_0px_0px_#171717] p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 border-2 border-[#171717] bg-blue-200 shadow-[2px_2px_0px_0px_#171717] flex items-center justify-center">
            <Globe className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-serif font-bold text-xl mb-2">Jaringan Data Nasional (JDN)</h2>
            <p className="text-sm text-neutral-700 font-mono mb-4">
              Inisiatif nasional untuk mengintegrasikan dan memfasilitasi akses data publik untuk mendukung pengambilan keputusan berbasis bukti di Kabupaten Banjarnegara.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-[#171717] shadow-[4px_4px_0px_0px_#171717] p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <h3 className="font-serif font-bold text-lg">Transparansi Data</h3>
          </div>
          <p className="text-sm text-neutral-700 font-mono">
            Menyediakan akses data pendidikan secara terbuka dan transparan untuk masyarakat umum.
          </p>
        </div>

        <div className="bg-white border-2 border-[#171717] shadow-[4px_4px_0px_0px_#171717] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="font-serif font-bold text-lg">Kolaborasi</h3>
          </div>
          <p className="text-sm text-neutral-700 font-mono">
            Memfasilitasi kolaborasi antara pemerintah, masyarakat, dan pemangku kepentingan.
          </p>
        </div>

        <div className="bg-white border-2 border-[#171717] shadow-[4px_4px_0px_0px_#171717] p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-yellow-600" />
            <h3 className="font-serif font-bold text-lg">Analitik Data</h3>
          </div>
          <p className="text-sm text-neutral-700 font-mono">
            Menyediakan alat analitik untuk interpretasi dan visualisasi data pendidikan.
          </p>
        </div>

        <div className="bg-white border-2 border-[#171717] shadow-[4px_4px_0px_0px_#171717] p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-purple-600" />
            <h3 className="font-serif font-bold text-lg">Standarisasi</h3>
          </div>
          <p className="text-sm text-neutral-700 font-mono">
            Menerapkan standar data yang konsisten untuk interoperabilitas.
          </p>
        </div>

        <div className="bg-white border-2 border-[#171717] shadow-[4px_4px_0px_0px_#171717] p-5">
          <div className="flex items-center gap-2 mb-3">
            <BrainCog className="w-5 h-5 text-purple-600" />
            <h3 className="font-serif font-bold text-lg">AI Powered</h3>
          </div>
          <p className="text-sm text-neutral-700 font-mono">
            Analisis data yang didukung oleh kecerdasan buatan untuk insight yang lebih dalam.
          </p>
        </div>

        <div className="bg-white border-2 border-[#171717] shadow-[4px_4px_0px_0px_#171717] p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <h3 className="font-serif font-bold text-lg">Keandalan</h3>
          </div>
          <p className="text-sm text-neutral-700 font-mono">
            Menjamin keandalan dan keamanan data pendidikan.
          </p>
        </div>
      </div>

      {/* Tujuan Section */}
      <div className="bg-white border-2 border-[#171717] shadow-[4px_4px_0px_0px_#171717] p-6">
        <h2 className="font-serif font-bold text-xl mb-4">Tujuan JDN di Kabupaten Banjarnegara</h2>
        <ul className="space-y-3 font-mono text-sm text-neutral-700">
          <li className="flex items-start gap-2">
            <span className="inline-block w-2 h-2 bg-blue-600 border border-[#171717] mt-1.5"></span>
            Menyediakan sumber data pendidikan yang terintegrasi dan terpercaya
          </li>
          <li className="flex items-start gap-2">
            <span className="inline-block w-2 h-2 bg-blue-600 border border-[#171717] mt-1.5"></span>
            Memfasilitasi analisis data untuk pengambilan keputusan berbasis bukti
          </li>
          <li className="flex items-start gap-2">
            <span className="inline-block w-2 h-2 bg-blue-600 border border-[#171717] mt-1.5"></span>
            Meningkatkan kolaborasi antara pemerintah, masyarakat, dan pemangku kepentingan
          </li>
          <li className="flex items-start gap-2">
            <span className="inline-block w-2 h-2 bg-blue-600 border border-[#171717] mt-1.5"></span>
            Mempercepat transformasi digital di sektor pendidikan Kabupaten Banjarnegara
          </li>
        </ul>
      </div>

      {/* Roadmap Section */}
      <div className="bg-white border-2 border-[#171717] shadow-[4px_4px_0px_0px_#171717] p-6">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <h2 className="font-serif font-bold text-xl">Roadmap Pengembangan</h2>
        </div>
        <div className="space-y-6">
          {roadmapPhases.map((phase, phaseIndex) => (
            <div key={phaseIndex} className={`p-5 border-2 border-[#171717] ${phase.bg}`}>
              <h3 className={`font-serif font-black text-lg mb-3 ${phase.color}`}>{phase.phase}</h3>
              <ul className="space-y-2">
                {phase.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2 font-mono text-sm text-neutral-700">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
