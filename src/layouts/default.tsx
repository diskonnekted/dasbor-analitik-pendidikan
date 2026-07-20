import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  MapPin, 
  BarChart3, 
  Users, 
  Menu, 
  X, 
  Globe,
  BookOpen,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Helper to map route to its Lucide icon
  const getIcon = (label: string) => {
    switch (label) {
      case "Ringkasan":
        return <LayoutDashboard className="w-4 h-4 mr-3 text-blue-600" />;
      case "Peta Sebaran":
        return <MapPin className="w-4 h-4 mr-3 text-blue-600" />;
      case "Analisis Kesenjangan":
        return <BarChart3 className="w-4 h-4 mr-3 text-blue-600" />;
      case "Prediksi Dropout":
        return <Users className="w-4 h-4 mr-3 text-blue-600" />;
      case "Analisis Literasi":
        return <BookOpen className="w-4 h-4 mr-3 text-blue-600" />;
      case "Tentang JDN":
        return <Globe className="w-4 h-4 mr-3 text-blue-600" />;
      default:
        return <LayoutDashboard className="w-4 h-4 mr-3 text-blue-600" />;
    }
  };

  // Helper to get active page title
  const getPageTitle = () => {
    const activeItem = siteConfig.navItems.find(item => item.href === location.pathname);
    return activeItem ? activeItem.label : "Dasbor Pendidikan";
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f1f1ef] text-[#141414] font-sans">
      
      {/* Main Shell */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Neo-Brutalist (Desktop) */}
        <aside className="w-64 bg-white border-r-2 border-[#141414] flex flex-col flex-shrink-0 hidden md:flex">
          {/* Brand Logo Area */}
          <div className="p-5 border-b-2 border-[#141414] bg-blue-100 flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#141414] bg-white overflow-hidden shadow-hd flex items-center justify-center font-serif font-black text-lg rotate-[-2deg] text-blue-600">
              P
            </div>
            <div>
              <span className="font-serif font-black text-xl tracking-tighter uppercase text-[#141414] mt-1 block leading-none">
                PENDIDIKAN
              </span>
              <span className="text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-widest block mt-0.5">
                Kab. Banjarnegara
              </span>
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {siteConfig.navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center px-4 py-2.5 font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#141414] transition-all hover:bg-blue-50 hover:translate-x-1 ${
                    isActive 
                      ? 'bg-blue-200 shadow-hd' 
                      : 'bg-white shadow-hd'
                  }`}
                >
                  {getIcon(item.label)}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        
        {/* Right Content Area */}
        <div className="flex-grow flex flex-col overflow-hidden">
          {/* Top Bar Header Neo-Brutalist */}
          <header className="bg-white border-b-2 border-[#141414] px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <button 
                className="md:hidden text-[#141414] mr-2 border-2 border-[#141414] p-1.5 bg-white shadow-hd" 
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-serif font-black uppercase tracking-tight text-[#141414]">
                {getPageTitle()}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              {/* JDN Badge */}
              <div className="hidden sm:inline-flex items-center px-3 py-1 bg-white border-2 border-[#141414] shadow-hd text-[10px] font-mono font-bold tracking-wider text-blue-600 uppercase">
                Sistem Informasi JDN
              </div>
              
              {/* Admin Avatar */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-mono font-bold text-neutral-800">Admin Utama</p>
                  <p className="text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-widest leading-none">Super Admin</p>
                </div>
                <div className="w-9 h-9 rounded-none border-2 border-[#141414] bg-yellow-300 shadow-hd flex items-center justify-center font-mono font-black text-sm">
                  AD
                </div>
              </div>
            </div>
          </header>
          
          {/* Page Content Area */}
          <main className="flex-grow overflow-y-auto p-6 md:p-8 bg-[#f1f1ef]">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="bg-white border-t-2 border-[#141414] px-6 py-4 flex items-center justify-between text-xs font-mono font-bold text-neutral-600 shrink-0">
            <p>&copy; {new Date().getFullYear()} Jaga Data Nusantara (JDN) - Analitika Pendidikan</p>
            <p className="hidden sm:block">V1.0.0 • Status: OK</p>
          </footer>
        </div>
      </div>
      
      {/* Mobile Sidebar overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <div 
            className="w-64 h-full bg-white border-r-2 border-[#141414] flex flex-col p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#141414]">
              <span className="font-serif font-black text-lg text-blue-600 uppercase">Menu Utama</span>
              <button 
                className="border-2 border-[#141414] p-1 shadow-hd" 
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-grow overflow-y-auto space-y-2">
              {siteConfig.navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={`flex items-center px-4 py-2 font-mono font-bold text-xs uppercase border-2 border-[#141414] transition-all ${
                      isActive 
                        ? 'bg-blue-200 shadow-hd' 
                        : 'bg-white shadow-hd'
                    }`}
                  >
                    {getIcon(item.label)}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
