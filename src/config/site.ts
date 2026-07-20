export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Banjarnegara Edu Analytics",
  description: "Platform analitik dan pemantauan data pendidikan Kabupaten Banjarnegara.",
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
      label: "Analisis Literasi",
      href: "/literacy",
    },
    {
      label: "Tentang JDN",
      href: "/jdn",
    },
  ],
  navMenuItems: [
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
      label: "Analisis Literasi",
      href: "/literacy",
    },
    {
      label: "Tentang JDN",
      href: "/jdn",
    },
  ],
  links: {
    github: "https://github.com/",
    twitter: "https://twitter.com/",
  },
};
