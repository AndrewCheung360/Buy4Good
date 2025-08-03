import React from 'react';
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
import { router, useNavigation } from 'expo-router';
import { mockCategories } from '@/data/mockData';
import { DrawerActions } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // Account for padding (24*2) + gap (12)

export default function ExploreScreen() {
  const navigation = useNavigation();

  const handleCategoryPress = (category: any) => {
    router.replace({
      pathname: '/(drawer)/merchants/[category]' as any,
      params: { category: category.id, title: category.displayName }
    });
  };

  const openSearchDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>BUY4</Text>
          <Text style={styles.logo}>GOOD</Text>
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={openSearchDrawer}>
          <Ionicons name="search" size={18} color="#FFFFFF" />
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
    fontSize: 18,
    fontWeight: '800',
    color: '#1A3B48',
    letterSpacing: 1,
    lineHeight: 18,
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  categoryCard: {
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