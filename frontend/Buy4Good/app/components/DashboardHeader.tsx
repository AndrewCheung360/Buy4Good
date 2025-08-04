import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GridPattern from "./GridPattern";

export default function DashboardHeader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleShopPress = () => {
    router.push("/(tabs)/explore");
  };

  const handleDonatePress = () => {
    // TODO: Implement donate functionality
    console.log("Donate pressed");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 80 }]}>
      <GridPattern />
      <View style={styles.donationSection}>
        <Text style={styles.donationLabel}>You've donated</Text>
        <Text style={styles.donationAmount}>$247.50</Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.shopButton} onPress={handleShopPress}>
            <Ionicons name="bag-outline" size={20} color="#C8D71F" />
            <Text style={styles.buttonText}>Shop</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.donateButton}
            onPress={handleDonatePress}
          >
            <Ionicons name="heart-outline" size={20} color="#C8D71F" />
            <Text style={styles.buttonText}>Donate</Text>
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
});
