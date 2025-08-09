import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, RefreshControl } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Search, Bookmark, Heart, Play, BookOpen } from 'lucide-react-native';

interface Surah {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string;
}

export default function QuranScreen() {
  const { profile } = useAuth();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSurahs = async () => {
    try {
      // Using eQuran API (mock data for demo)
      const mockSurahs: Surah[] = [
        { nomor: 1, nama: 'الفاتحة', nama_latin: 'Al-Fatihah', jumlah_ayat: 7, tempat_turun: 'Makkah', arti: 'Pembukaan' },
        { nomor: 2, nama: 'البقرة', nama_latin: 'Al-Baqarah', jumlah_ayat: 286, tempat_turun: 'Madinah', arti: 'Sapi' },
        { nomor: 3, nama: 'آل عمران', nama_latin: 'Ali Imran', jumlah_ayat: 200, tempat_turun: 'Madinah', arti: 'Keluarga Imran' },
        { nomor: 4, nama: 'النساء', nama_latin: 'An-Nisa', jumlah_ayat: 176, tempat_turun: 'Madinah', arti: 'Wanita' },
        { nomor: 5, nama: 'المائدة', nama_latin: 'Al-Maidah', jumlah_ayat: 120, tempat_turun: 'Madinah', arti: 'Hidangan' },
        { nomor: 6, nama: 'الأنعام', nama_latin: 'Al-Anam', jumlah_ayat: 165, tempat_turun: 'Makkah', arti: 'Hewan Ternak' },
        { nomor: 7, nama: 'الأعراف', nama_latin: 'Al-Araf', jumlah_ayat: 206, tempat_turun: 'Makkah', arti: 'Tempat Tinggi' },
      ];

      setSurahs(mockSurahs);
      setFilteredSurahs(mockSurahs);
    } catch (error) {
      console.error('Error fetching surahs:', error);
    }
  };

  const fetchBookmarks = async () => {
    if (!profile) return;

    try {
      const { data } = await supabase
        .from('quran_bookmarks')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      setBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredSurahs(surahs);
    } else {
      const filtered = surahs.filter(surah =>
        surah.nama_latin.toLowerCase().includes(query.toLowerCase()) ||
        surah.arti.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSurahs(filtered);
    }
  };

  const addBookmark = async (surahNumber: number, ayahNumber: number = 1) => {
    if (!profile) return;

    try {
      await supabase
        .from('quran_bookmarks')
        .insert([{
          user_id: profile.id,
          surah_number: surahNumber,
          ayah_number: ayahNumber,
        }]);

      fetchBookmarks();
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  useEffect(() => {
    fetchSurahs();
    fetchBookmarks();
    setLoading(false);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSurahs();
    fetchBookmarks();
    setRefreshing(false);
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <BookOpen size={32} color="#10B981" />
        <Text style={styles.headerTitle}>Al-Quran Digital</Text>
        <Text style={styles.headerSubtitle}>Bacaan dan Bookmark Pribadi</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari Surah..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Bookmarks Section */}
      {bookmarks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bookmark Terakhir</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.bookmarksContainer}>
              {bookmarks.slice(0, 5).map((bookmark) => (
                <Pressable key={bookmark.id} style={styles.bookmarkCard}>
                  <Bookmark size={16} color="#F59E0B" />
                  <Text style={styles.bookmarkText}>
                    {surahs.find(s => s.nomor === bookmark.surah_number)?.nama_latin || `Surah ${bookmark.surah_number}`}
                  </Text>
                  <Text style={styles.bookmarkAyah}>Ayat {bookmark.ayah_number}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Surahs List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daftar Surah</Text>
        <View style={styles.surahsList}>
          {filteredSurahs.map((surah) => (
            <Pressable key={surah.nomor} style={styles.surahCard}>
              <View style={styles.surahNumber}>
                <Text style={styles.surahNumberText}>{surah.nomor}</Text>
              </View>
              
              <View style={styles.surahInfo}>
                <Text style={styles.surahName}>{surah.nama_latin}</Text>
                <Text style={styles.surahArabic}>{surah.nama}</Text>
                <Text style={styles.surahDetails}>
                  {surah.jumlah_ayat} ayat • {surah.tempat_turun} • {surah.arti}
                </Text>
              </View>

              <View style={styles.surahActions}>
                <Pressable 
                  style={styles.actionButton}
                  onPress={() => addBookmark(surah.nomor)}
                >
                  <Bookmark size={16} color="#6B7280" />
                </Pressable>
                <Pressable style={styles.actionButton}>
                  <Play size={16} color="#6B7280" />
                </Pressable>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  bookmarksContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
  },
  bookmarkCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bookmarkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 4,
    textAlign: 'center',
  },
  bookmarkAyah: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  surahsList: {
    gap: 8,
    paddingHorizontal: 16,
  },
  surahCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  surahNumber: {
    width: 40,
    height: 40,
    backgroundColor: '#10B981',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surahNumberText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  surahArabic: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  surahDetails: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  surahActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});