import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PieChart from "react-native-pie-chart";
import { useAuth } from "../../context/auth";
import { supabase } from "../../utils/supabase";
import { router, useFocusEffect } from "expo-router";

type CauseData = {
  id: string;
  name: string;
  percentage: number;
  color: string;
};

const colors = [
  "#D5DE69",
  "#2D5016",
  "#FF6B35",
  "#FF69B4",
  "#87CEEB",
  "#4A90E2",
  "#F5A623",
  "#7ED321",
  "#BD10E0",
  "#50E3C2",
];

export default function CauseBreakdown() {
  const [causes, setCauses] = useState<CauseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [series, setSeries] = useState<{ value: number; color: string }[]>([]);
  const { user, supabaseUser } = useAuth();

  const widthAndHeight = 120;
  const userId = supabaseUser?.id || user?.id;
  const address = Platform.OS === "ios" ? "localhost" : "10.0.2.2";

  useEffect(() => {
    if (userId) {
      fetchUserCharityPreferences();
    }
  }, [userId]);

  // Refetch data when component comes into focus (after editing)
  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        fetchUserCharityPreferences(true);
      }
    }, [userId])
  );

  const fetchUserCharityPreferences = async (isRefresh = false) => {
    if (!userId) return;

    if (!isRefresh) {
      setLoading(true);
    }
    try {
      // Get user's charity preferences with allocation percentages
      const { data: preferences, error: prefError } = await supabase
        .from("user_charity_preferences")
        .select("charity_id, allocation_percentage")
        .eq("user_id", userId)
        .eq("is_active", true);

      if (prefError) {
        setCauses([]);
        setSeries([]);
        return;
      }

      if (!preferences || preferences.length === 0) {
        setCauses([]);
        setSeries([]);
        setLoading(false);
        return;
      }

      // Get charity details for each preference
      const charityIds = preferences.map((p) => p.charity_id);

      // Fetch organization names from Pledge API
      const charityMap = new Map();
      for (const charityId of charityIds) {
        try {
          const response = await fetch(
            `http://${address}:8000/api/v1/organizations/${charityId}`
          );
          if (response.ok) {
            const organization = await response.json();
            charityMap.set(charityId, organization.name);
          } else {
            charityMap.set(charityId, `Charity ${charityId}`); // Fallback
          }
        } catch (error) {
          charityMap.set(charityId, `Charity ${charityId}`); // Fallback
        }
      }

      // Combine preferences with charity names
      const causesData: CauseData[] = preferences.map((pref, index) => ({
        id: pref.charity_id,
        name: charityMap.get(pref.charity_id) || `Charity ${pref.charity_id}`,
        percentage: pref.allocation_percentage || 0,
        color: colors[index % colors.length],
      }));

      // Check if all percentages are 0 or null - if so, distribute equally
      const totalPercentage = causesData.reduce(
        (sum, cause) => sum + (cause.percentage || 0),
        0
      );

      if (totalPercentage === 0 && causesData.length > 0) {
        // Distribute equally among all charities
        const equalPercentage = 100 / causesData.length;
        const updatedCauses = causesData.map((cause) => ({
          ...cause,
          percentage: equalPercentage,
        }));

        const chartSeries = updatedCauses.map((cause) => ({
          value: cause.percentage,
          color: cause.color,
        }));

        setCauses(updatedCauses);
        setSeries(chartSeries);
      } else {
        // Use existing percentages
        const validCauses = causesData.filter((cause) => cause.percentage > 0);
        const chartSeries = validCauses.map((cause) => ({
          value: cause.percentage,
          color: cause.color,
        }));
        setCauses(validCauses);
        setSeries(chartSeries);
      }
    } catch (error) {
      setCauses([]);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPress = () => {
    router.push("/cause-breakdown-edit" as any);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchUserCharityPreferences(true).finally(() => setRefreshing(false));
  }, [userId]);

  // Show loading screen on initial load
  if (loading && causes.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Cause Breakdown</Text>
          <TouchableOpacity onPress={handleEditPress}>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1F4A2C" />
            <Text style={styles.loadingText}>
              Loading your charity preferences...
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (causes.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Cause Breakdown</Text>
          <TouchableOpacity onPress={handleEditPress}>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Charity Preferences</Text>
            <Text style={styles.emptyText}>
              You haven't set up any charity preferences yet. Tap the edit
              button to add your favorite charities and set allocation
              percentages.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cause Breakdown</Text>
        <TouchableOpacity onPress={handleEditPress}>
          <Ionicons name="chevron-forward" size={20} color="#666666" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {series.length > 0 && series.some((s) => s.value > 0) ? (
            <>
              <View style={styles.chartContainer}>
                <PieChart widthAndHeight={widthAndHeight} series={series} />
              </View>

              <View style={styles.legend}>
                {causes.map((cause) => (
                  <View key={cause.id} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: cause.color },
                      ]}
                    />
                    <View style={styles.legendText}>
                      <Text style={styles.legendName}>{cause.name}</Text>
                      <Text style={styles.legendPercentage}>
                        {cause.percentage}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No Allocation Set</Text>
              <Text style={styles.emptyText}>
                Your charity preferences don't have allocation percentages set.
                Tap the edit button to set your allocation percentages.
              </Text>
            </View>
          )}

          {/* Loading overlay for refresh */}
          {loading && causes.length > 0 && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color="#1F4A2C" />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  content: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  legend: {
    width: "100%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendText: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  legendName: {
    fontSize: 14,
    color: "#1a1a1a",
    flex: 1,
  },
  legendPercentage: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
});
