// eQuran API integration service
export interface Surah {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string;
  deskripsi: string;
  audio: string;
}

export interface Ayah {
  nomor: number;
  ar: string;
  tr: string;
  idn: string;
}

export interface SurahDetail {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string;
  deskripsi: string;
  audio: string;
  ayat: Ayah[];
}

export class EquranService {
  private static baseUrl = 'https://equran.id/api';

  static async getAllSurahs(): Promise<Surah[]> {
    try {
      const response = await fetch(`${this.baseUrl}/surat`);
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching surahs:', error);
      return [];
    }
  }

  static async getSurahDetail(surahNumber: number): Promise<SurahDetail | null> {
    try {
      const response = await fetch(`${this.baseUrl}/surat/${surahNumber}`);
      const data = await response.json();
      return data.data || null;
    } catch (error) {
      console.error('Error fetching surah detail:', error);
      return null;
    }
  }

  static async getJuzDetail(juzNumber: number): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/juz/${juzNumber}`);
      const data = await response.json();
      return data.data || null;
    } catch (error) {
      console.error('Error fetching juz detail:', error);
      return null;
    }
  }

  static async searchAyah(keyword: string): Promise<any[]> {
    try {
      // This would be implemented with a proper search endpoint
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error searching ayah:', error);
      return [];
    }
  }
}