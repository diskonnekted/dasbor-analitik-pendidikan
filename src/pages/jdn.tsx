import { Info, ShieldCheck, Globe, Users, TrendingUp, FileText } from "lucide-react";

export default function JDNPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-[#171717] pb-4">
        <div>
          <h1 className="font-serif font-black text-2xl uppercase tracking-tight text-[#171717]">Tentang JDN</h1>
          <p className="text-sm text-neutral-600 mt-1">Jaringan Data Nasional untuk Pendidikan</p>
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
            <Info className="w-5 h-5 text-red-600" />
            <h3 className="font-serif font-bold text-lg">Inovasi Digital</h3>
          </div>
          <p className="text-sm text-neutral-700 font-mono">
            Mempercepat transformasi digital di sektor pendidikan.
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

      {/* Roadmap Section */}
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
    </div>
  );
}
