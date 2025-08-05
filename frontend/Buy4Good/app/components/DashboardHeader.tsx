import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GridPattern from "./GridPattern";
import { useAuth } from "@/context/auth";

export default function DashboardHeader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, supabaseUser } = useAuth();
  const [donationAmount, setDonationAmount] = useState("$0.00");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const address = Platform.OS === "ios" ? "localhost" : "10.0.2.2";

  const fetchDonationAmount = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to use supabaseUser.id if available, otherwise fall back to user.id
      const userId = supabaseUser?.id || user?.id;

      if (!userId) {
        setError("No user available");
        setDonationAmount("$0.00");
        return;
      }

      const response = await fetch(
        `http://${address}:8000/api/v1/total_donation/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setDonationAmount(data.formatted_amount);
      } else {
        setDonationAmount("$0.00");
      }
    } catch (error: any) {
      setError("Failed to load donation amount");
      setDonationAmount("$0.00");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userId = supabaseUser?.id || user?.id;
    if (userId) {
      fetchDonationAmount();
    }
  }, [user, supabaseUser]);

  const handleShopPress = () => {
    router.push("/(tabs)/explore");
  };

  const handleAutoDonatePress = async () => {
    try {
      const userId = supabaseUser?.id || user?.id;
      if (!userId) {
        return;
      }

      // Get user's settings first
      const settingsResponse = await fetch(
        `http://${address}:8000/api/v1/get_user_settings/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let donationPercentage = 0.01; // Default 1%
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        if (settingsData.success) {
          donationPercentage = settingsData.settings.auto_donation_percentage;
        }
      }

      // Create auto-donation with user's actual settings
      const response = await fetch(
        `http://${address}:8000/api/v1/transactions/auto_donate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            transaction_amount: 100.0, // Example transaction amount
            original_transaction_id: "example_transaction_123",
            donation_percentage: donationPercentage, // Use user's actual setting
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Refresh the donation amount display
        fetchDonationAmount();
      }
    } catch (error) {
      // Handle error silently
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 80 }]}>
      <GridPattern />
      <View style={styles.donationSection}>
        <Text style={styles.donationLabel}>You've donated</Text>
        <Text style={styles.donationAmount}>
          {isLoading ? "Loading..." : donationAmount}
        </Text>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.shopButton} onPress={handleShopPress}>
            <Ionicons name="bag-outline" size={20} color="#C8D71F" />
            <Text style={styles.buttonText}>Shop</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.donateButton}
            onPress={handleAutoDonatePress}
          >
            <Ionicons name="heart-outline" size={20} color="#C8D71F" />
            <Text style={styles.buttonText}>Auto-Donate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1F4A2C",
    paddingHorizontal: 20,
    paddingBottom: 70,
    position: "relative",
  },
  donationSection: {
    alignItems: "center",
  },
  donationLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#C8D71F",
    marginBottom: 8,
  },
  donationAmount: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#C8D71F",
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  shopButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(20, 40, 15, 0.9)",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
  },
  donateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(20, 40, 15, 0.9)",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
  },
  buttonText: {
    color: "#C8D71F",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
});
