import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SummaryStats() {
  return (
    <View style={styles.container}>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>0</Text>
        <Text style={styles.statLabel}>Causes Supported</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statNumber}>0</Text>
        <Text style={styles.statLabel}>Times Donated</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statNumber}>0</Text>
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
