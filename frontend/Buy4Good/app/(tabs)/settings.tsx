import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { useAuth } from "@/context/auth";
import { useDataRefresh } from "@/context/dataRefresh";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import GridPattern from "../components/GridPattern";

export default function SettingsScreen() {
  const { user, signOut, supabaseUser } = useAuth();
  const { markDataChanged } = useDataRefresh();
  const [donationPercentage, setDonationPercentage] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const [userSettings, setUserSettings] = useState<any>(null);

  const address = Platform.OS === "ios" ? "localhost" : "10.0.2.2";
  const userId = supabaseUser?.id || user?.id;

  useEffect(() => {
    if (userId) {
      getUserSettings();
    }
  }, [userId]);

  const getUserSettings = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `http://${address}:8000/api/v1/get_user_settings/${userId}`
      );
      const data = await response.json();

      if (data.success) {
        setUserSettings(data.settings);
        const percentage =
          (data.settings?.auto_donation_percentage || 0.01) * 100;
        setDonationPercentage(percentage.toString());
      }
    } catch (error) {
      // Handle error silently
    }
  };

  const updateDonationPercentage = async () => {
    if (!userId) return;

    const percentage = parseFloat(donationPercentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 10) {
      Alert.alert(
        "Invalid Percentage",
        "Please enter a percentage between 0% and 10%"
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `http://${address}:8000/api/v1/update_donation_percentage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            auto_donation_percentage: percentage / 100,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Donation percentage updated successfully!");
        markDataChanged(); // Mark that data has changed
        getUserSettings(); // Refresh settings
      } else {
        Alert.alert("Error", "Failed to update donation percentage");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update donation percentage");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigate to the login form (index screen)
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Failed to sign out");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GridPattern />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons name="settings-outline" size={32} color="#1F4A2C" />
            <Text style={styles.title}>Settings</Text>
          </View>

          {user && (
            <>
              <View style={styles.userSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons
                    name="person-circle-outline"
                    size={24}
                    color="#1F4A2C"
                  />
                  <Text style={styles.sectionTitle}>Account Information</Text>
                </View>
                <Text style={styles.label}>Signed in as:</Text>
                <Text style={styles.userInfo}>{user.name}</Text>
                <Text style={styles.userInfo}>{user.email}</Text>
              </View>

              <View style={styles.donationSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="heart-outline" size={24} color="#1F4A2C" />
                  <Text style={styles.sectionTitle}>
                    Auto-Donation Settings
                  </Text>
                </View>

                <Text style={styles.description}>
                  Set the percentage of your cashback that will be automatically
                  donated to charity.
                </Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Donation Percentage:</Text>
                  <View style={styles.percentageInput}>
                    <TextInput
                      style={styles.percentageTextInput}
                      value={donationPercentage}
                      onChangeText={setDonationPercentage}
                      keyboardType="numeric"
                      placeholder="1"
                      placeholderTextColor="#8E8E93"
                    />
                    <Text style={styles.percentageSymbol}>%</Text>
                  </View>
                  <Text style={styles.inputHint}>
                    Enter a value between 0% and 10%
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.updateButton, isLoading && { opacity: 0.7 }]}
                  onPress={updateDonationPercentage}
                  disabled={isLoading}
                >
                  <Text style={styles.updateButtonText}>
                    {isLoading ? "Updating..." : "Update Donation Percentage"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.signOutSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                  <Text style={styles.sectionTitle}>Account Actions</Text>
                </View>

                <TouchableOpacity
                  style={styles.signOutButton}
                  onPress={handleSignOut}
                >
                  <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 70,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1F4A2C",
    letterSpacing: -0.5,
  },
  userSection: {
    padding: 24,
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  donationSection: {
    padding: 24,
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  signOutSection: {
    padding: 24,
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  description: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 20,
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
    fontWeight: "600",
  },
  userInfo: {
    fontSize: 16,
    color: "#1a1a1a",
    marginBottom: 4,
    fontWeight: "500",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "#1a1a1a",
    marginBottom: 12,
    fontWeight: "600",
  },
  percentageInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    marginBottom: 8,
  },
  percentageTextInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    padding: 0,
  },
  percentageSymbol: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F4A2C",
    marginLeft: 8,
  },
  inputHint: {
    fontSize: 14,
    color: "#8E8E93",
    fontStyle: "italic",
  },
  updateButton: {
    backgroundColor: "#1F4A2C",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#1F4A2C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  signOutButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signOutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
