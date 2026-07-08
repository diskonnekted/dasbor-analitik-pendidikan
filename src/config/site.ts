export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Dashboard Pendidikan",
  description: "Dasbor Analitik Pendidikan Kabupaten Banjarnegara",
  navItems: [
    {
      label: "Ringkasan",
      href: "/",
    },
    {
      label: "Peta Sebaran",
      href: "/map",
    },
    {
      label: "Analisis Kesenjangan",
      href: "/gap",
    },
    {
      label: "Prediksi Dropout",
      href: "/dropout",
    },
    {
      label: "Tentang JDN",
      href: "/jdn",
    },
  ],
};
