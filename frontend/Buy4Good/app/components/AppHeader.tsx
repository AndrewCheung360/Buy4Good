import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/auth';

interface AppHeaderProps {
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
  showNotifications?: boolean;
  backgroundColor?: string;
}

export default function AppHeader({ 
  onProfilePress, 
  onNotificationPress, 
  showNotifications = true,
  backgroundColor = '#FFFFFF'
}: AppHeaderProps) {
  const { user } = useAuth();

  return (
    <View style={[styles.header, { backgroundColor }]}>
      <TouchableOpacity 
        style={styles.profileButton}
        onPress={onProfilePress}
      >
        {user?.picture ? (
          <Image
            source={{ uri: user.picture }}
            style={styles.profileImage}
            contentFit="cover"
          />
        ) : (
          <Ionicons name="person-circle-outline" size={32} color="#474747" />
        )}
      </TouchableOpacity>
      
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>BUY4</Text>
        <Text style={styles.logo}>GOOD</Text>
      </View>
      
      {showNotifications ? (
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={onNotificationPress}
        >
          <Ionicons name="notifications-outline" size={24} color="#474747" />
        </TouchableOpacity>
      ) : (
        <View style={styles.notificationButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  profileButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A3B48',
    letterSpacing: 1,
    lineHeight: 18,
  },
  notificationButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
