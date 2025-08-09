import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Users, Award, PenTool } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#10B981', '#3B82F6']}
      style={styles.container}
    >
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <BookOpen size={64} color="white" />
          <Text style={styles.title}>Ngaji App</Text>
          <Text style={styles.subtitle}>
            Platform Pembelajaran Quran Digital untuk Hafalan dan Murojaah
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <PenTool size={24} color="white" />
            <Text style={styles.featureText}>Setoran Hafalan & Murojaah</Text>
          </View>
          <View style={styles.feature}>
            <Award size={24} color="white" />
            <Text style={styles.featureText}>Penilaian & Label Pencapaian</Text>
          </View>
          <View style={styles.feature}>
            <Users size={24} color="white" />
            <Text style={styles.featureText}>Monitoring Orang Tua</Text>
          </View>
          <View style={styles.feature}>
            <BookOpen size={24} color="white" />
            <Text style={styles.featureText}>Baca Quran Digital</Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.primaryButtonText}>Masuk</Text>
          </Pressable>
          
          <Pressable
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.secondaryButtonText}>Daftar</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: height,
  },
  content: {
    flex: 1,
    paddingHorizontal: Math.max(24, width * 0.05),
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.12,
  },
  title: {
    fontSize: Math.min(32, width * 0.08),
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Math.min(16, width * 0.04),
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: Math.min(24, width * 0.06),
    paddingHorizontal: 20,
  },
  features: {
    gap: Math.max(12, height * 0.02),
    marginVertical: height * 0.04,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: Math.max(14, width * 0.04),
    borderRadius: 12,
  },
  featureText: {
    color: 'white',
    fontSize: Math.min(16, width * 0.04),
    fontWeight: '500',
    flex: 1,
  },
  buttons: {
    gap: Math.max(12, height * 0.015),
  },
  button: {
    padding: Math.max(14, width * 0.04),
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: 'white',
  },
  primaryButtonText: {
    color: '#10B981',
    fontSize: Math.min(16, width * 0.04),
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: Math.min(16, width * 0.04),
    fontWeight: 'bold',
  },
});