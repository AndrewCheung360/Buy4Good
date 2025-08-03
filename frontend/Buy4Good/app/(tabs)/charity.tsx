import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, FlatList, Platform } from 'react-native';
import {
  EXPO_PUBLIC_PLEDGE_API_TOKEN
} from "@/constants";
import OrganizationCard from '@/components/OrganizationCard';

const API_BASE = "https://api.pledge.to/v1";

// Import the Organization type if it's exported from OrganizationCard or define it here
import type { Organization } from '@/components/OrganizationCard';

export default function CharityScreen() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFundraisers() {
      try {

        const response = await fetch(`${API_BASE}/organizations`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${EXPO_PUBLIC_PLEDGE_API_TOKEN?.trim()}`,
          }
        });

        console.log(EXPO_PUBLIC_PLEDGE_API_TOKEN)

        if (!response.ok) {
          throw new Error(`Failed to fetch fundraisers: ${response.status}`);
        }

        const data = await response.json();

        if (data.results) {
          // Adjust these keys if your API uses different names
          const orgsData = data.results.map((org: any) => ({
            id: org.id?.toString() || org.name,
            name: org.name,
            logo: org.logo_url || org.logo || '', // fallback if logo_url is not present
            website: org.website_url || org.website || '',
          }));
          setOrgs(orgsData);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFundraisers();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Charity Library</Text>
        {loading && <ActivityIndicator size="large" color="#1a1a1a" />}
        {error && <Text style={styles.error}>Error: {error}</Text>}

        {!loading && !error && (
          <FlatList
            data={orgs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <OrganizationCard org={item} />}
          />
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
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  orgName: {
    fontSize: 18,
    color: '#333333',
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eeeeee',
  },
});
