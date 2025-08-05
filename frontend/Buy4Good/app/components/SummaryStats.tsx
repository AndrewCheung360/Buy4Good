import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth } from "@/context/auth";
import { useDataRefresh } from "@/context/dataRefresh";
import { Platform } from "react-native";

export default function SummaryStats() {
  const { supabaseUser } = useAuth();
  const { lastRefreshTime, shouldRefresh } = useDataRefresh();
  const [stats, setStats] = useState({
    causesSupported: 0,
    timesDonated: 0,
    totalPurchases: 0,
  });
  const [loading, setLoading] = useState(true);
  const lastUpdateTime = useRef(Date.now());

  const fetchStats = async () => {
    if (!supabaseUser?.id) return;

    try {
      setLoading(true);
      const address = Platform.OS === "ios" ? "localhost" : "10.0.2.2";

      // Fetch user's charity preferences (causes supported)
      const charitiesResponse = await fetch(
        `http://${address}:8000/api/v1/get_user_charity_preferences/${supabaseUser.id}`
      );
      const charitiesData = await charitiesResponse.json();

      // Count unique charity IDs from user_charity_preferences
      const causesSupported = charitiesData.success
        ? new Set(charitiesData.preferences.map((pref: any) => pref.charity_id))
            .size
        : 0;

      // Count unique transactions (total purchases)
      const uniqueTransactions = new Set();
      const donationsResponse = await fetch(
        `http://${address}:8000/api/v1/recent_donations/${supabaseUser.id}`
      );
      const donationsData = await donationsResponse.json();

      if (donationsData.success) {
        donationsData.donations.forEach((donation: any) => {
          if (donation.original_transaction_id) {
            uniqueTransactions.add(donation.original_transaction_id);
          }
        });
      }
      const totalPurchases = uniqueTransactions.size;

      // Calculate times donated: causes supported * total purchases
      const timesDonated = causesSupported * totalPurchases;

      setStats({
        causesSupported,
        timesDonated,
        totalPurchases,
      });
      lastUpdateTime.current = Date.now();
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if data is stale or if it's the first load
    if (loading || shouldRefresh(lastUpdateTime.current)) {
      fetchStats();
    }
  }, [supabaseUser?.id, lastRefreshTime]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.statCard}>
          <ActivityIndicator size="small" color="#1F4A2C" />
          <Text style={styles.statLabel}>Loading...</Text>
        </View>
        <View style={styles.statCard}>
          <ActivityIndicator size="small" color="#1F4A2C" />
          <Text style={styles.statLabel}>Loading...</Text>
        </View>
        <View style={styles.statCard}>
          <ActivityIndicator size="small" color="#1F4A2C" />
          <Text style={styles.statLabel}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{stats.causesSupported}</Text>
        <Text style={styles.statLabel}>Causes Supported</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{stats.timesDonated}</Text>
        <Text style={styles.statLabel}>Times Donated</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{stats.totalPurchases}</Text>
        <Text style={styles.statLabel}>Total Purchases</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -55,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 16,
  },
});
