import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Mail, Lock, ArrowLeft } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Mohon isi semua field');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    
    if (error) {
      Alert.alert('Error', error);
    } else {
      router.replace('/(tabs)');
    }
    setLoading(false);
  };

  return (
    <LinearGradient
      colors={['#10B981', '#3B82F6']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="white" />
        </Pressable>

        <View style={styles.header}>
          <BookOpen size={48} color="white" />
          <Text style={styles.title}>Masuk ke Akun</Text>
          <Text style={styles.subtitle}>Silakan masuk untuk melanjutkan</Text>
        </View>

        <View style={styles.form}>
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
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Memproses...' : 'Masuk'}
            </Text>
          </Pressable>

          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.linkText}>
              Belum punya akun? <Text style={styles.linkBold}>Daftar disini</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  backButton: {
    marginTop: 40,
    alignSelf: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  button: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    marginTop: 8,
  },
  linkBold: {
    color: '#10B981',
    fontWeight: 'bold',
  },
});