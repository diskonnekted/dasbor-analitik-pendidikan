export interface SchoolDataRow {
  kecamatan: string;
  sekolah_negeri: number;
  sekolah_swasta: number;
  guru_negeri: number;
  guru_swasta: number;
  murid_negeri: number;
  murid_swasta: number;
  tahun_ajaran: string; // e.g. "2024/2025"
  level: 'TK' | 'SD' | 'SMP' | 'SMA' | 'SMK';
}

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
  return val.replace(/^["'\s]+|["'\s]+$/g, '').trim();
};

const parseNumber = (val: string): number => {
  const cleaned = cleanValue(val);
  if (cleaned === '-' || cleaned === '' || cleaned === '0') {
    return 0;
  }
  // Remove thousand separator commas or spaces
  const noCommas = cleaned.replace(/,/g, '').replace(/\s/g, '');
  const parsed = parseInt(noCommas, 10);
  return isNaN(parsed) ? 0 : parsed;
};

const normalizeYear = (year: string): string => {
  return cleanValue(year).replace(/\s+/g, '');
};

const CSV_PATHS: Record<'TK' | 'SD' | 'SMP' | 'SMA' | 'SMK', string> = {
  TK: '/DINDIKPORA 2018-2024/Data Dindikpora TK Th.2016-2025/t_Jumlah_sekolah_tk_CSV.csv',
  SD: '/DINDIKPORA 2018-2024/Data Dindikpora SD Th.2016-2025/t_Jumlah_sekolah_sd_CSV.csv',
  SMP: '/DINDIKPORA 2018-2024/Data Dindikpora SMP Th.2016-2025/t_Jumlah_sekolah_smp_CSV.csv',
  SMA: '/DINDIKPORA 2018-2024/Data Dindikpora SMA Th.2021-2025/t_Jumlah_sekolah_SMA_CSV.csv',
  SMK: '/DINDIKPORA 2018-2024/Data Dindikpora SMK Th.2016-2025/t_Jumlah_sekolah_SMK_CSV.csv',
};

export const fetchLocalSchoolData = async (): Promise<SchoolDataRow[]> => {
  const levels: Array<'TK' | 'SD' | 'SMP' | 'SMA' | 'SMK'> = ['TK', 'SD', 'SMP', 'SMA', 'SMK'];
  const allData: SchoolDataRow[] = [];

  for (const level of levels) {
    try {
      const response = await fetch(CSV_PATHS[level]);
      const csvText = await response.text();
      const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
      
      if (lines.length <= 1) continue;
      
      const header = parseCSVLine(lines[0]).map(h => cleanValue(h).toLowerCase());
      
      // Map columns based on headers to be extremely robust
      const colIndices = {
        kecamatan: header.findIndex(h => h.includes('kecamatan')),
        sekolah_negeri: header.findIndex(h => h.includes('sekolah') && h.includes('negeri')),
        sekolah_swasta: header.findIndex(h => h.includes('sekolah') && h.includes('swasta')),
        guru_negeri: header.findIndex(h => h.includes('guru') && h.includes('negeri')),
        guru_swasta: header.findIndex(h => h.includes('guru') && h.includes('swasta')),
        murid_negeri: header.findIndex(h => h.includes('murid') && h.includes('negeri')),
        murid_swasta: header.findIndex(h => h.includes('murid') && (h.includes('swasta') || h.includes('swasya'))),
        tahun_ajaran: header.findIndex(h => h.includes('tahun') || h.includes('ajaran')),
      };

      for (let i = 1; i < lines.length; i++) {
        const parts = parseCSVLine(lines[i]);
        if (parts.length < header.length) continue;

        const rawKec = parts[colIndices.kecamatan] ? cleanValue(parts[colIndices.kecamatan]) : '';
        // Skip header lines or summary rows if any
        if (!rawKec || rawKec.toLowerCase() === 'kecamatan' || rawKec.toLowerCase().includes('total')) continue;

        allData.push({
          kecamatan: rawKec,
          sekolah_negeri: colIndices.sekolah_negeri !== -1 ? parseNumber(parts[colIndices.sekolah_negeri]) : 0,
          sekolah_swasta: colIndices.sekolah_swasta !== -1 ? parseNumber(parts[colIndices.sekolah_swasta]) : 0,
          guru_negeri: colIndices.guru_negeri !== -1 ? parseNumber(parts[colIndices.guru_negeri]) : 0,
          guru_swasta: colIndices.guru_swasta !== -1 ? parseNumber(parts[colIndices.guru_swasta]) : 0,
          murid_negeri: colIndices.murid_negeri !== -1 ? parseNumber(parts[colIndices.murid_negeri]) : 0,
          murid_swasta: colIndices.murid_swasta !== -1 ? parseNumber(parts[colIndices.murid_swasta]) : 0,
          tahun_ajaran: colIndices.tahun_ajaran !== -1 ? normalizeYear(parts[colIndices.tahun_ajaran]) : '',
          level,
        });
      }
    } catch (error) {
      console.error(`Error loading local data for level ${level}:`, error);
    }
  }

  return allData;
};
