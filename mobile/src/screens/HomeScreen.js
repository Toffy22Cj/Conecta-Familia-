import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../theme/colors';
import { authService } from '../services/api';
import Icon from '../components/Icon';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const menuItems = [
    { id: 1, title: 'Diagnóstico', icon: 'clipboardList', color: '#3B82F6', screen: 'Diagnostic' },
    { id: 2, title: 'Simulador', icon: 'heartHandshake', color: '#8B5CF6', screen: 'Simulator' },
    { id: 3, title: 'Foro', icon: 'messageSquare', color: '#10B981', screen: 'Forum' },
    { id: 4, title: 'Citas', icon: 'calendar', color: '#F59E0B', screen: 'Citas' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hola,</Text>
          <Text style={styles.userName}>{user?.fullName || 'Usuario'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Icon name="logOut" color={colors.textMuted} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Conecta Familia</Text>
          <Text style={styles.heroSubtitle}>Tu comunidad de apoyo y crecimiento familiar.</Text>
        </View>

        <Text style={styles.sectionTitle}>Módulos</Text>
        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card}
              onPress={() => { if (item.screen) navigation.navigate(item.screen); }}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <Icon name={item.icon} color={item.color} size={32} />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    paddingTop: spacing.lg,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textMuted,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.dark,
  },
  content: {
    padding: spacing.xl,
    paddingTop: 0,
  },
  heroCard: {
    backgroundColor: colors.primary,
    padding: spacing.xl,
    borderRadius: radius.lg,
    marginBottom: spacing.xxl,
    elevation: 8,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    alignItems: 'center',
    elevation: 2,
  },
  iconContainer: {
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMain,
  },
});

export default HomeScreen;
