import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { mockMerchants } from '@/data/mockData';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // Account for padding (24*2) + gap (12)

export default function CategoryMerchantsScreen() {
  const { category, title } = useLocalSearchParams<{ category: string; title: string }>();
  const navigation = useNavigation();
  
  const merchants = mockMerchants[category] || [];
  const cleanTitle = title ? title.replace(/\n/g, ' ') : '';

  const handleMerchantPress = (merchant: any) => {
    router.replace({
      pathname: '/(drawer)/webview/[merchant]' as any,
      params: { 
        merchant: merchant.id,
        url: merchant.url,
        name: merchant.name
      }
    });
  };

  const goBack = () => {
    router.replace('/(drawer)/(tabs)/explore');
  };

  const openSearchDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const navigateToTab = (tabName: string) => {
    router.replace(`/(drawer)/(tabs)/${tabName}` as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="chevron-back" size={18} color="#9A9A9A" />
          <Text style={styles.backText}>Category</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.searchButton} onPress={openSearchDrawer}>
          <Ionicons name="search" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{cleanTitle}</Text>
        
                <View style={styles.merchantsGrid}>
          {merchants.map((merchant, index) => (
            <TouchableOpacity
              key={merchant.id}
              style={[
                styles.merchantCard,
                { marginRight: index % 2 === 0 ? 12 : 0 }
              ]}
              onPress={() => handleMerchantPress(merchant)}
            >
              <View style={styles.logoContainer}>
                <Image
                  source={{ uri: merchant.logo }}
                  style={styles.merchantLogo}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      {/* Custom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => navigateToTab('dashboard')}
        >
          <Ionicons name="home-outline" size={24} color="#8E8E93" />
          <Text style={styles.tabLabel}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabItem, styles.activeTab]} 
          onPress={() => navigateToTab('explore')}
        >
          <Ionicons name="search-outline" size={24} color="#007AFF" />
          <Text style={[styles.tabLabel, styles.activeTabLabel]}>Explore</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => navigateToTab('library')}
        >
          <Ionicons name="heart-outline" size={24} color="#8E8E93" />
          <Text style={styles.tabLabel}>Library</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => navigateToTab('settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#8E8E93" />
          <Text style={styles.tabLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#9A9A9A',
    marginLeft: 4,
  },
  searchButton: {
    width: 34,
    height: 34,
    borderRadius: 5,
    backgroundColor: '#1A3B4833',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#353535',
    marginBottom: 26,
  },
  merchantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  merchantCard: {
    width: cardWidth,
    height: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  merchantLogo: {
    width: '100%',
    height: '100%',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    // No additional styles needed, color handled in icon/text
  },
  tabLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#007AFF',
  },
});
