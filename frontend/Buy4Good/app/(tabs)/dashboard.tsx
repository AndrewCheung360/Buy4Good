import AppHeader from '@/app/components/AppHeader';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen() {
  const handleProfilePress = () => {
    // Handle profile press - could navigate to profile screen
    console.log('Profile pressed from Dashboard');
  };

  const handleNotificationPress = () => {
    // Handle notification press - could navigate to notifications screen
    console.log('Notifications pressed from Dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        onProfilePress={handleProfilePress}
        onNotificationPress={handleNotificationPress}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Coming Soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
});
