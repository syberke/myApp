import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, BookOpen, ChevronDown, Lock, Mail, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const roles = [
  { value: 'siswa', label: 'Siswa' },
  { value: 'guru', label: 'Guru' },
  { value: 'ortu', label: 'Orang Tua' },
];

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('siswa');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const insets = useSafeAreaInsets();

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Mohon isi semua field');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, name, role);
    
    if (error) {
      Alert.alert('Error', error);
    } else {
      Alert.alert('Sukses', 'Akun berhasil dibuat!', [
        { text: 'OK', onPress: () => router.replace('/login') }
      ]);
    }
    setLoading(false);
  };

  return (
    <LinearGradient
      colors={['#10B981', '#3B82F6']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Pressable 
            style={[styles.backButton, { marginTop: insets.top + 16 }]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="white" />
          </Pressable>

          <View style={styles.header}>
            <BookOpen size={48} color="white" />
            <Text style={styles.title}>Buat Akun Baru</Text>
            <Text style={styles.subtitle}>Bergabung dengan komunitas pembelajaran Quran</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <User size={20} color="#10B981" />
              <TextInput
                style={styles.input}
                placeholder="Nama Lengkap"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color="#10B981" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color="#10B981" />
              <TextInput
                style={styles.input}
                placeholder="Password (min. 6 karakter)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.dropdownContainer}>
              <Pressable
                style={styles.dropdown}
                onPress={() => setShowRoleDropdown(!showRoleDropdown)}
              >
                <Text style={styles.dropdownText}>
                  {roles.find(r => r.value === role)?.label || 'Pilih Role'}
                </Text>
                <ChevronDown size={20} color="#10B981" />
              </Pressable>
              
              {showRoleDropdown && (
                <View style={styles.dropdownOptions}>
                  {roles.map((roleOption) => (
                    <Pressable
                      key={roleOption.value}
                      style={styles.dropdownOption}
                      onPress={() => {
                        setRole(roleOption.value);
                        setShowRoleDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>{roleOption.label}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Memproses...' : 'Daftar'}
              </Text>
            </Pressable>

            <Pressable onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.linkText}>
                Sudah punya akun? <Text style={styles.linkBold}>Masuk disini</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: height,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Math.max(24, width * 0.05),
    paddingBottom: 24,
    minHeight: height,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.06,
    marginBottom: height * 0.05,
  },
  title: {
    fontSize: Math.min(28, width * 0.07),
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Math.min(16, width * 0.04),
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: Math.max(20, width * 0.05),
    gap: 16,
    marginHorizontal: width < 400 ? 0 : 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: Math.max(12, width * 0.04),
    gap: 12,
    minHeight: 56,
  },
  input: {
    flex: 1,
    fontSize: Math.min(16, width * 0.04),
    color: '#1F2937',
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: Math.max(12, width * 0.04),
    minHeight: 56,
  },
  dropdownText: {
    fontSize: Math.min(16, width * 0.04),
    color: '#1F2937',
  },
  dropdownOptions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    zIndex: 1000,
    maxHeight: 200,
  },
  dropdownOption: {
    padding: Math.max(12, width * 0.04),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownOptionText: {
    fontSize: Math.min(16, width * 0.04),
    color: '#1F2937',
  },
  button: {
    backgroundColor: '#10B981',
    padding: Math.max(14, width * 0.04),
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    minHeight: 56,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: Math.min(16, width * 0.04),
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: Math.min(14, width * 0.035),
    marginTop: 8,
    paddingHorizontal: 20,
  },
  linkBold: {
    color: '#10B981',
    fontWeight: 'bold',
  },
});