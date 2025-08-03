import AppHeader from '@/app/components/AppHeader';
import { mockCategories, mockMerchants } from '@/data/mockData';
import { Merchant } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // Account for padding (24*2) + gap (12)

export default function ShopScreen() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('alphabetical');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showSortOptions, setShowSortOptions] = useState(false);

  const sortOptions = [
    { id: 'alphabetical', label: 'Alphabetical' },
    { id: 'donation', label: 'Donation Rate' },
    { id: 'newest', label: 'Newest' },
    { id: 'popular', label: 'Most Popular' }
  ];

  // Get all merchants from all categories
  const allMerchants = useMemo(() => {
    const merchants: Merchant[] = [];
    Object.keys(mockMerchants).forEach(categoryKey => {
      mockMerchants[categoryKey].forEach((merchant: Merchant) => {
        merchants.push({ ...merchant, category: categoryKey });
      });
    });
    return merchants;
  }, []);

  // Filter merchants based on selected categories and search query
  const filteredMerchants = useMemo(() => {
    let filtered = allMerchants;

    // Filter by categories
    if (!selectedCategories.includes('all')) {
      filtered = filtered.filter(merchant =>
        selectedCategories.includes(merchant.category)
      );
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(merchant =>
        merchant.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort merchants
    switch (sortBy) {
      case 'alphabetical':
        filtered.sort((a, b) => {
          const comparison = a.name.localeCompare(b.name);
          return sortOrder === 'asc' ? comparison : -comparison;
        });
        break;
      case 'donation':
        filtered.sort((a, b) => {
          const comparison = b.cashbackRate - a.cashbackRate; // Using cashbackRate as donation rate
          return sortOrder === 'asc' ? -comparison : comparison;
        });
        break;
      case 'newest':
        // For demo purposes, sort by name reverse for "newest"
        filtered.sort((a, b) => {
          const comparison = b.name.localeCompare(a.name);
          return sortOrder === 'asc' ? comparison : -comparison;
        });
        break;
      case 'popular':
        // For demo purposes, sort by cashback rate for "popular"
        filtered.sort((a, b) => {
          const comparison = b.cashbackRate - a.cashbackRate;
          return sortOrder === 'asc' ? -comparison : comparison;
        });
        break;
    }

    return filtered;
  }, [allMerchants, selectedCategories, searchQuery, sortBy, sortOrder]);

  const handleMerchantPress = (merchant: Merchant) => {
    router.navigate({
      pathname: '/webview/[merchant]' as any,
      params: {
        merchant: merchant.id,
        url: merchant.url,
        name: merchant.name
      }
    });
  };

  const handleCategoryToggle = (categoryId: string) => {
    if (categoryId === 'all') {
      setSelectedCategories(['all']);
    } else {
      setSelectedCategories(prev => {
        const newSelection = prev.filter(id => id !== 'all');
        if (newSelection.includes(categoryId)) {
          const filtered = newSelection.filter(id => id !== categoryId);
          return filtered.length === 0 ? ['all'] : filtered;
        } else {
          return [...newSelection, categoryId];
        }
      });
    }
  };

  const handleSortChange = (sortId: string) => {
    if (sortId === sortBy) {
      // Toggle sort order if same sort type is selected
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortId);
      setSortOrder('asc'); // Reset to ascending for new sort type
    }
    setShowSortOptions(false);
  };

  const getSortIcon = () => {
    return sortOrder === 'asc' ? 'arrow-up' : 'arrow-down';
  };

  const handleProfilePress = () => {
    // Handle profile press - could navigate to profile screen
    console.log('Profile pressed');
  };

  const handleNotificationPress = () => {
    // Handle notification press - could navigate to notifications screen
    console.log('Notifications pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        onProfilePress={handleProfilePress}
        onNotificationPress={handleNotificationPress}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Shop</Text>

        {/* Search Input - Full Width */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search merchants..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8E8E93"
          />
        </View>

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          style={styles.categoryFilters}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryFiltersContent}
        >
          <TouchableOpacity
            style={[
              styles.categoryChip,
              selectedCategories.includes('all') && styles.categoryChipActive
            ]}
            onPress={() => handleCategoryToggle('all')}
          >
            {selectedCategories.includes('all') && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" style={styles.checkmark} />
            )}
            <Text style={[
              styles.categoryChipText,
              selectedCategories.includes('all') && styles.categoryChipTextActive
            ]}>
              All
            </Text>
          </TouchableOpacity>

          {mockCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategories.includes(category.id) && styles.categoryChipActive
              ]}
              onPress={() => handleCategoryToggle(category.id)}
            >
              {selectedCategories.includes(category.id) && (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" style={styles.checkmark} />
              )}
              <Text style={[
                styles.categoryChipText,
                selectedCategories.includes(category.id) && styles.categoryChipTextActive
              ]}>
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sorting/Alphabetical indicator */}
        <View style={styles.sortingContainer}>
          <TouchableOpacity
            style={styles.sortingButton}
            onPress={() => handleSortChange(sortBy)}
          >
            <Ionicons name={getSortIcon()} size={16} color="#000" />
            <Text style={styles.sortingText}>
              {sortOptions.find(option => option.id === sortBy)?.label}
            </Text>
          </TouchableOpacity>
          <View style={styles.spacer} />
          <TouchableOpacity onPress={() => setShowSortOptions(!showSortOptions)}>
            <Ionicons name="list" size={16} color="#474747" />
          </TouchableOpacity>
        </View>

        {/* Sort Options Dropdown */}
        {showSortOptions && (
          <View style={styles.sortOptionsContainer}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.sortOption}
                onPress={() => handleSortChange(option.id)}
              >
                <Text style={[
                  styles.sortOptionText,
                  sortBy === option.id && styles.sortOptionTextActive
                ]}>
                  {option.label}
                </Text>
                {sortBy === option.id && (
                  <Ionicons name="checkmark" size={16} color="#1A3B48" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Merchants Grid */}
        <View style={styles.merchantsGrid}>
          {filteredMerchants.map((merchant, index) => (
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
                  contentFit="contain"
                />
              </View>
              <Text style={styles.merchantName}>{merchant.name}</Text>
              <Text style={styles.donationPercentage}>{merchant.cashbackRate}% donation</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1B1B1B',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#C6C6C6',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1B1B1B',
  },
  categoryFilters: {
    marginBottom: 20,
  },
  categoryFiltersContent: {
    paddingRight: 24,
    paddingLeft: 0, // Ensure no left padding that could cause cutoff
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: '#C6C6C6',
    borderWidth: 1,
    marginRight: 12,
  },
  categoryChipActive: {
    backgroundColor: '#C6C6C6',
  },
  checkmark: {
    marginRight: 6,
    color: '#1B1B1B',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#1B1B1B',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#1B1B1B',
  },
  sortingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sortingButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sortingText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#000000',
    marginLeft: 4,
  },
  spacer: {
    flex: 1,
  },
  sortOptionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#1B1B1B',
  },
  sortOptionTextActive: {
    color: '#1A3B48',
    fontWeight: '600',
  },
  merchantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 40,
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
    padding: 16,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  merchantLogo: {
    width: 80,
    height: 60,
  },
  merchantName: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  donationPercentage: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
});