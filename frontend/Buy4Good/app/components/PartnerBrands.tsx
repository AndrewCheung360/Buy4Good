import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { mockMerchants } from "@/data/mockData";

export default function PartnerBrands() {
  // Get all brands from mockData
  const allBrands = Object.values(mockMerchants).flat();

  const handleExplorePress = () => {
    router.push("/(tabs)/explore");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Partner Brands</Text>
        <TouchableOpacity onPress={handleExplorePress}>
          <Ionicons name="chevron-forward" size={20} color="#666666" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.brandsContainer}
      >
        {allBrands.map((brand, index) => (
          <View key={brand?.id} style={styles.brandCard}>
            <Image
              source={{ uri: brand?.logo }}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          </View>
        ))}
      </ScrollView>
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
    paddingHorizontal: 4,
  },
  brandCard: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
    width: 80,
    height: 60,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  brandLogo: {
    width: "100%",
    height: "100%",
  },
});
