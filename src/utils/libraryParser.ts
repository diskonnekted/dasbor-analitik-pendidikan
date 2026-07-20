const MONTH_ORDER = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
};

const cleanValue = (val: string): string => {
  return (val ?? '').replace(/^["'\s]+|["'\s]+$/g, '').trim();
};

const parseNumber = (val: string): number => {
  const cleaned = cleanValue(val);
  if (cleaned === '-' || cleaned === '') return 0;
  const noCommas = cleaned.replace(/,/g, '').replace(/\s/g, '');
  const parsed = parseInt(noCommas, 10);
  return isNaN(parsed) ? 0 : parsed;
};

const normalizeMonth = (val: string): string => {
  const cleaned = cleanValue(val);
  const found = MONTH_ORDER.find((m) => m.toLowerCase() === cleaned.toLowerCase());
  return found ?? cleaned;
};

// Row keyed by visitor classification (Pelajar, Mahasiswa, Karyawan/PNS, Umum)
export interface VisitorRow {
  bulan: string;
  tahun: string;
  pelajar: number;
  mahasiswa: number;
  karyawan: number;
  umum: number;
  total: number;
}

// Row keyed by book collection category
export interface CollectionRow {
  bulan: string;
  tahun: string;
  categories: Record<string, number>;
  total: number;
}

const findCol = (header: string[], ...keywords: string[]): number =>
  header.findIndex((h) => keywords.every((k) => h.includes(k)));

const parseVisitorCsv = (csvText: string): VisitorRow[] => {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim() !== '');
  if (lines.length <= 1) return [];

  const header = parseCSVLine(lines[0]).map((h) => cleanValue(h).toLowerCase());
  const cols = {
    bulan: findCol(header, 'bulan'),
    tahun: findCol(header, 'tahun'),
    pelajarL: findCol(header, 'pelajar', 'laki'),
    pelajarP: findCol(header, 'pelajar', 'perempuan'),
    mahasiswaL: findCol(header, 'mahasiswa', 'laki'),
    mahasiswaP: findCol(header, 'mahasiswa', 'perempuan'),
    karyawanL: findCol(header, 'karyawan', 'laki'),
    karyawanP: findCol(header, 'karyawan', 'perempuan'),
    umumL: findCol(header, 'umum', 'laki'),
    umumP: findCol(header, 'umum', 'perempuan'),
  };

  const rows: VisitorRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = parseCSVLine(lines[i]);
    const bulan = normalizeMonth(parts[cols.bulan] ?? '');
    if (!bulan || !MONTH_ORDER.includes(bulan)) continue;

    const pelajar = parseNumber(parts[cols.pelajarL]) + parseNumber(parts[cols.pelajarP]);
    const mahasiswa = parseNumber(parts[cols.mahasiswaL]) + parseNumber(parts[cols.mahasiswaP]);
    const karyawan = parseNumber(parts[cols.karyawanL]) + parseNumber(parts[cols.karyawanP]);
    const umum = parseNumber(parts[cols.umumL]) + parseNumber(parts[cols.umumP]);

    rows.push({
      bulan,
      tahun: cleanValue(parts[cols.tahun] ?? ''),
      pelajar,
      mahasiswa,
      karyawan,
      umum,
      total: pelajar + mahasiswa + karyawan + umum,
    });
  }
  return rows;
};

const parseCollectionCsv = (csvText: string): CollectionRow[] => {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim() !== '');
  if (lines.length <= 1) return [];

  const rawHeader = parseCSVLine(lines[0]).map((h) => cleanValue(h));
  const lowerHeader = rawHeader.map((h) => h.toLowerCase());
  const bulanIdx = lowerHeader.findIndex((h) => h.includes('bulan'));
  const tahunIdx = lowerHeader.findIndex((h) => h.includes('tahun'));

  const categoryIdx: number[] = [];
  rawHeader.forEach((_, idx) => {
    if (idx !== bulanIdx && idx !== tahunIdx) categoryIdx.push(idx);
  });

  const rows: CollectionRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = parseCSVLine(lines[i]);
    const bulan = normalizeMonth(parts[bulanIdx] ?? '');
    if (!bulan || !MONTH_ORDER.includes(bulan)) continue;

    const categories: Record<string, number> = {};
    let total = 0;
    categoryIdx.forEach((idx) => {
      const val = parseNumber(parts[idx]);
      categories[rawHeader[idx]] = val;
      total += val;
    });

    rows.push({
      bulan,
      tahun: cleanValue(parts[tahunIdx] ?? ''),
      categories,
      total,
    });
  }
  return rows;
};

export interface LibraryData {
  visitors: VisitorRow[];
  newMembers: VisitorRow[];
  collections: CollectionRow[];
}

export const fetchLibraryData = async (): Promise<LibraryData> => {
  const [visitorsRes, membersRes, collectionsRes] = await Promise.all([
    fetch('/DISARPUS/pengunjung_perpustakaan.csv'),
    fetch('/DISARPUS/anggota_baru_perpustakaan.csv'),
    fetch('/DISARPUS/koleksi_dipinjam_perpustakaan.csv'),
  ]);

  const [visitorsTxt, membersTxt, collectionsTxt] = await Promise.all([
    visitorsRes.text(),
    membersRes.text(),
    collectionsRes.text(),
  ]);

  return {
    visitors: parseVisitorCsv(visitorsTxt),
    newMembers: parseVisitorCsv(membersTxt),
    collections: parseCollectionCsv(collectionsTxt),
  };
};

export { MONTH_ORDER };
