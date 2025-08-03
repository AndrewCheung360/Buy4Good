import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { mockRecentActivities, ActivityItem } from "@/data/mockData";

export default function RecentActivity() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Activity</Text>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={20} color="#666666" />
        </TouchableOpacity>
      </View>

      {mockRecentActivities.map((activity) => (
        <View key={activity.id} style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Text style={styles.iconText}>{activity.icon}</Text>
          </View>

          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>{activity.activity}</Text>
            <Text style={styles.activitySubtitle}>{activity.organization}</Text>
          </View>

          <Text style={styles.activityAmount}>{activity.amount}</Text>
        </View>
      ))}
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
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 14,
    color: "#666666",
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
});
