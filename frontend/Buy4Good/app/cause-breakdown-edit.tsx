import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "../context/auth";
import { useDataRefresh } from "../context/dataRefresh";
import { supabase } from "../utils/supabase";
import PieChart from "react-native-pie-chart";
import GridPattern from "./components/GridPattern";

type CharityPreference = {
  id: string;
  charity_id: string;
  charity_name: string;
  allocation_percentage: number;
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

export default function CauseBreakdownEditScreen() {
  const [charities, setCharities] = useState<CharityPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user, supabaseUser } = useAuth();
  const { markDataChanged } = useDataRefresh();

  const userId = supabaseUser?.id || user?.id;
  const address = Platform.OS === "ios" ? "localhost" : "10.0.2.2";

  useEffect(() => {
    if (userId) {
      fetchUserCharityPreferences();
    }
  }, [userId]);

  const fetchUserCharityPreferences = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Get user's charity preferences with allocation percentages
      const { data: preferences, error: prefError } = await supabase
        .from("user_charity_preferences")
        .select("id, charity_id, allocation_percentage")
        .eq("user_id", userId)
        .eq("is_active", true);

      if (prefError) {
        setCharities([]);
        return;
      }

      if (!preferences || preferences.length === 0) {
        setCharities([]);
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
      const charitiesData: CharityPreference[] = preferences.map(
        (pref, index) => ({
          id: pref.id,
          charity_id: pref.charity_id,
          charity_name:
            charityMap.get(pref.charity_id) || `Charity ${pref.charity_id}`,
          allocation_percentage: pref.allocation_percentage || 0,
          color: colors[index % colors.length],
        })
      );

      // If all percentages are 0, distribute equally and save to database
      const totalPercentage = charitiesData.reduce(
        (sum, charity) => sum + charity.allocation_percentage,
        0
      );
      if (totalPercentage === 0 && charitiesData.length > 0) {
        const equalPercentage = 100 / charitiesData.length;
        charitiesData.forEach((charity) => {
          charity.allocation_percentage = equalPercentage;
        });

        // Auto-save the equal distribution to database
        saveEqualDistribution(charitiesData);
      }

      setCharities(charitiesData);
    } catch (error) {
      setCharities([]);
    } finally {
      setLoading(false);
    }
  };

  const updateAllocationPercentage = (id: string, newPercentage: number) => {
    setCharities((prev) =>
      prev.map((charity) =>
        charity.id === id
          ? { ...charity, allocation_percentage: newPercentage }
          : charity
      )
    );
  };

  const saveChanges = async () => {
    if (!userId) return;

    // Validate total percentage equals 100%
    const totalPercentage = charities.reduce(
      (sum, charity) => sum + charity.allocation_percentage,
      0
    );
    if (Math.abs(totalPercentage - 100) > 0.01) {
      Alert.alert(
        "Invalid Allocation",
        `Total allocation must equal 100%. Current total: ${totalPercentage.toFixed(
          1
        )}%`
      );
      return;
    }

    setSaving(true);
    try {
      // Update each charity preference
      for (const charity of charities) {
        const { error } = await supabase
          .from("user_charity_preferences")
          .update({ allocation_percentage: charity.allocation_percentage })
          .eq("id", charity.id);

        if (error) {
          Alert.alert("Error", "Failed to save changes");
          return;
        }
      }

      markDataChanged(); // Mark that data has changed
      Alert.alert("Success", "Allocation percentages updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const getPieChartSeries = () => {
    return charities.map((charity) => ({
      value: charity.allocation_percentage,
      color: charity.color,
    }));
  };

  const getTotalPercentage = () => {
    return charities.reduce(
      (sum, charity) => sum + charity.allocation_percentage,
      0
    );
  };

  const saveEqualDistribution = async (charitiesData: CharityPreference[]) => {
    if (!userId) return;

    try {
      // Update each charity preference with equal distribution
      for (const charity of charitiesData) {
        const response = await fetch(
          `http://${address}:8000/api/v1/update_allocation_percentage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              charity_id: charity.charity_id,
              allocation_percentage: charity.allocation_percentage,
            }),
          }
        );

        if (!response.ok) {
          // Handle error silently
        }
      }

      markDataChanged(); // Mark that data has changed
    } catch (error) {
      // Handle error silently
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <GridPattern />
        <View style={styles.loadingContainer}>
          <Ionicons name="refresh" size={32} color="#1F4A2C" />
          <Text style={styles.loadingText}>
            Loading your charity preferences...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <GridPattern />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#1F4A2C" />
            </TouchableOpacity>
            <Text style={styles.title}>Cause Breakdown</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Pie Chart */}
          <View style={styles.chartContainer}>
            <PieChart widthAndHeight={200} series={getPieChartSeries()} />
          </View>

          {/* Charity List */}
          <View style={styles.charityList}>
            {charities.map((charity, index) => (
              <View key={charity.id} style={styles.charityItem}>
                <View style={styles.charityInfo}>
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: charity.color },
                    ]}
                  />
                  <Text style={styles.charityName}>{charity.charity_name}</Text>
                </View>
                <View style={styles.percentageInput}>
                  <TextInput
                    style={styles.input}
                    value={charity.allocation_percentage.toString()}
                    onChangeText={(text) => {
                      const value = parseFloat(text) || 0;
                      updateAllocationPercentage(charity.id, value);
                    }}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#8E8E93"
                  />
                  <Text style={styles.percentageSymbol}>%</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Total */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalPercentage}>
              {getTotalPercentage().toFixed(1)}%
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, saving && { opacity: 0.7 }]}
              onPress={saveChanges}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>
                {saving ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  placeholder: {
    width: 44,
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  charityList: {
    marginBottom: 24,
  },
  charityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  charityInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  charityName: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  percentageInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    minWidth: 80,
  },
  input: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    textAlign: "center",
    flex: 1,
  },
  percentageSymbol: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F4A2C",
    marginLeft: 4,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 2,
    borderTopColor: "#E5E5EA",
    marginBottom: 32,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  totalPercentage: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F4A2C",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#1a1a1a",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#1F4A2C",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
});
