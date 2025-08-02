import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { recentSearches, mockMerchants } from '@/data/mockData';
import { router } from 'expo-router';

export default function SearchDrawerContent(props: any) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);

  // Memoize allMerchants to prevent recreation on every render
  const allMerchants = React.useMemo(() => {
    return Object.values(mockMerchants).flat();
  }, []);

  React.useEffect(() => {
    if (searchQuery.length > 0) {
      const results = allMerchants.filter(merchant =>
        merchant.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results.slice(0, 10)); // Limit to 10 results
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allMerchants]);

  const handleRecentSearchPress = (search: string) => {
    setSearchQuery(search);
  };

  const handleMerchantPress = (merchant: any) => {
    router.push({
      pathname: '/(drawer)/webview/[merchant]' as any,
      params: { 
        merchant: merchant.id,
        url: merchant.url,
        name: merchant.name
      }
    });
    props.navigation.closeDrawer();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {searchResults.length > 0 ? (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => handleMerchantPress(item)}
                >
                  <View style={styles.merchantInfo}>
                    <Text style={styles.merchantName}>{item.name}</Text>
                    <Text style={styles.cashbackRate}>{item.cashbackRate}% cashback</Text>
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent search</Text>
            
            <FlatList
              data={recentSearches}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.recentItem}
                  onPress={() => handleRecentSearchPress(item)}
                >
                  <Ionicons name="time-outline" size={20} color="#999" />
                  <Text style={styles.recentText}>{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 32,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  clearButton: {
    marginLeft: 12,
  },
  resultsSection: {
    flex: 1,
  },
  recentSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 24,
  },
  resultItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F7',
  },
  merchantInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  merchantName: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  cashbackRate: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F7',
  },
  recentText: {
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 16,
  },
});
