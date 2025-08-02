import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { mockCategories } from '@/data/mockData';
import SearchDrawer from '@/components/SearchDrawer';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 24px padding on each side, 24px gap between cards

export default function ExploreScreen() {
  const [searchDrawerVisible, setSearchDrawerVisible] = useState(false);

  const handleCategoryPress = (category: any) => {
    router.push({
      pathname: '/merchants/[category]' as any,
      params: { category: category.id, title: category.displayName }
    });
  };

  const openSearchDrawer = () => {
    setSearchDrawerVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>BUY4</Text>
          <Text style={styles.logo}>GOOD</Text>
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={openSearchDrawer}>
          <Ionicons name="search" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Shop By Category</Text>
        
        <View style={styles.categoriesGrid}>
          {mockCategories.map((category, index) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                { marginRight: index % 2 === 0 ? 12 : 0 }
              ]}
              onPress={() => handleCategoryPress(category)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.displayName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <SearchDrawer
        visible={searchDrawerVisible}
        onClose={() => setSearchDrawerVisible(false)}
      />
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
  logoContainer: {
    alignItems: 'flex-start',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    letterSpacing: 1,
    lineHeight: 24,
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
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
  categoryIcon: {
    fontSize: 32,
    marginBottom: 12,
    opacity: 0.7,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 20,
  },
});
