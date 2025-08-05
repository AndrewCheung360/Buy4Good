import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/auth";

export default function AutoDonateSettings() {
  const { supabaseUser, user } = useAuth();
  const [donationPercentage, setDonationPercentage] = useState("1.0");
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const address = Platform.OS === "ios" ? "localhost" : "10.0.2.2";

  const saveDonationPercentage = async () => {
    try {
      setIsLoading(true);
      const userId = supabaseUser?.id || user?.id;

      if (!userId) {
        Alert.alert("Error", "No user ID available");
        return;
      }

      const percentage = parseFloat(donationPercentage);
      if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        Alert.alert(
          "Invalid Percentage",
          "Please enter a percentage between 0 and 100"
        );
        return;
      }

      // Convert percentage to decimal (e.g., 1.0% -> 0.01)
      const decimalPercentage = percentage / 100;

      const response = await fetch(
        `http://${address}:8000/api/v1/settings/update_donation_percentage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            auto_donation_percentage: decimalPercentage,
          }),
        }
      );

      if (response.ok) {
        Alert.alert(
          "Success",
          "Auto-donation percentage updated successfully!"
        );
      } else {
        const errorData = await response.json();
        Alert.alert(
          "Error",
          errorData.detail || "Failed to update donation percentage"
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save donation percentage");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAutoDonate = async () => {
    try {
      setIsLoading(true);
      const userId = supabaseUser?.id || user?.id;

      if (!userId) {
        Alert.alert("Error", "No user ID available");
        return;
      }

      const response = await fetch(
        `http://${address}:8000/api/v1/settings/toggle_auto_donate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            auto_donate_enabled: !isEnabled,
          }),
        }
      );

      if (response.ok) {
        setIsEnabled(!isEnabled);
        Alert.alert(
          "Success",
          `Auto-donate ${!isEnabled ? "enabled" : "disabled"} successfully!`
        );
      } else {
        const errorData = await response.json();
        Alert.alert(
          "Error",
          errorData.detail || "Failed to toggle auto-donate"
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to toggle auto-donate");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auto-Donate Settings</Text>

      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Auto-Donate</Text>
          <Text style={styles.settingDescription}>
            Automatically donate a percentage of your transactions to your liked
            charities
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.toggleButton, isEnabled && styles.toggleButtonActive]}
          onPress={toggleAutoDonate}
          disabled={isLoading}
        >
          <Ionicons
            name={isEnabled ? "checkmark" : "close"}
            size={20}
            color={isEnabled ? "#FFFFFF" : "#666666"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Donation Percentage</Text>
          <Text style={styles.settingDescription}>
            Percentage of each transaction to donate (0.1% - 10%)
          </Text>
        </View>
        <View style={styles.percentageInput}>
          <TextInput
            style={styles.input}
            value={donationPercentage}
            onChangeText={setDonationPercentage}
            placeholder="1.0"
            keyboardType="numeric"
            maxLength={4}
          />
          <Text style={styles.percentageSymbol}>%</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
        onPress={saveDonationPercentage}
        disabled={isLoading}
      >
        <Text style={styles.saveButtonText}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F4A2C",
    marginBottom: 20,
    textAlign: "center",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingVertical: 10,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F4A2C",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#1F4A2C",
  },
  percentageInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 80,
  },
  input: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F4A2C",
    textAlign: "center",
    flex: 1,
  },
  percentageSymbol: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666666",
    marginLeft: 4,
  },
  saveButton: {
    backgroundColor: "#1F4A2C",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
