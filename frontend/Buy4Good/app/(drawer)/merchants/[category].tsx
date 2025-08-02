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
import { mockMerchants } from '@/data/mockData';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // Account for padding (24*2) + gap (12)

export default function CategoryMerchantsScreen() {
  const { category, title } = useLocalSearchParams<{ category: string; title: string }>();
  
  const merchants = mockMerchants[category] || [];

  const handleMerchantPress = (merchant: any) => {
    router.push({
      pathname: '/(drawer)/webview/[merchant]' as any,
      params: { 
        merchant: merchant.id,
        url: merchant.url,
        name: merchant.name
      }
    });
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="chevron-back" size={24} color="#666" />
          <Text style={styles.backText}>Category</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{title}</Text>
        
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
    color: '#666',
    marginLeft: 4,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 32,
  },
  merchantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  merchantCard: {
    width: cardWidth,
    height: 120,
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
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  merchantLogo: {
    width: '100%',
    height: '100%',
  },
});
