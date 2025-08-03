import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { mockMerchants } from "@/data/mockData";

// Select specific brands for the dashboard
const selectedBrands = ["zara", "adidas", "target", "allbirds"];

export default function PartnerBrands() {
  const partnerBrands = selectedBrands
    .map(
      (id) =>
        mockMerchants.clothing.find((m) => m.id === id) ||
        mockMerchants.kids.find((m) => m.id === id)
    )
    .filter(Boolean);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Partner Brands Used</Text>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={20} color="#666666" />
        </TouchableOpacity>
      </View>

      <View style={styles.brandsContainer}>
        {partnerBrands.map((brand, index) => (
          <View key={brand?.id} style={styles.brandCard}>
            <View style={styles.brandLogoContainer}>
              <Image
                source={{ uri: brand?.logo }}
                style={styles.brandLogo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.brandAmount}>$0.00</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 24,
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
  brandsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  brandCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  brandLogoContainer: {
    width: 60,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  brandLogo: {
    width: "100%",
    height: "100%",
  },
  brandAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
  },
});
