import { useAuth } from '@/contexts/AuthContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import { BookOpen, Building2, CloudUpload, Home, HousePlus, ListChecks, Monitor, Plus , Shield, Trophy, User } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import screen components (pastikan path sesuai struktur project kamu)
import admin from './admin';
import IndexScreen from './index';
import JoinOrganizeScreen from './join-organize';
import LeaderboardScreen from './leaderboard';
import monitoring from './monitoring';
import organize from './organize';
import penilaian from './penilaian';
import ProfileScreen from './profile';
import QuizScreen from './quiz';
import QuranScreen from './quran';
import SetoranScreen from './setoran';

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  const { user, profile, loading } = useAuth();
  const insets = useSafeAreaInsets();
  const role = profile?.role;

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/(auth)/welcome');
    }
  }, [loading, user]);

  if (loading || !user || !profile) {
    return null;
  }

  const getTabsForRole = () => {
    const commonTabs = [
      { name: 'Beranda', component: IndexScreen, icon: Home },
      { name: 'Al-Quran', component: QuranScreen, icon: BookOpen },
      { name: 'Leaderboard', component: LeaderboardScreen, icon: Trophy },
    ];

    switch (role) {
      case 'siswa':
        return [
          ...commonTabs,
          { name: 'Setoran', component: SetoranScreen, icon: Plus },
          { name: 'Quiz', component: QuizScreen, icon: ListChecks },
          { name: 'Gabung Kelas', component: JoinOrganizeScreen, icon: HousePlus },
          { name: 'Profil', component: ProfileScreen, icon: User },
        ];
          case 'ortu':
        return [
          ...commonTabs,
       { name: 'monitoring', component: monitoring, icon: Monitor  },
          { name: 'Gabung Kelas', component: JoinOrganizeScreen, icon: HousePlus },
          { name: 'Profil', component: ProfileScreen, icon: User },
        ];
          case 'guru':
        return [
          ...commonTabs,
           { name: 'monitoring', component: monitoring, icon: Monitor  },
          { name: 'Penilaian', component: penilaian, icon: CloudUpload },
          { name: 'Quiz', component: QuizScreen, icon: ListChecks },
           { name: 'Organize', component: organize, icon: Building2 },
          { name: 'Profil', component: ProfileScreen, icon: User },
        ];
          case 'admin':
        return [
          ...commonTabs,
          { name: 'Admin', component: admin, icon: Shield },
        ];
      default:
        return commonTabs;
    }
  };

  const tabs = getTabsForRole();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 70 + insets.bottom : 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarIcon: ({ size, color }) => (
              <tab.icon size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
