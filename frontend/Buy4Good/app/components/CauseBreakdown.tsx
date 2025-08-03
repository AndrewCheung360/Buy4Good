import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PieChart from "react-native-pie-chart";

type CauseData = {
  id: string;
  name: string;
  percentage: number;
  color: string;
};

const mockCauses: CauseData[] = [
  {
    id: "1",
    name: "Weather Resilience Fund",
    percentage: 50,
    color: "#D5DE69",
  },
  { id: "2", name: "The Essentials Fund", percentage: 24, color: "#2D5016" },
  { id: "3", name: "SDCCU Stuff the Bus", percentage: 5, color: "#FF6B35" },
  {
    id: "4",
    name: "The Hurricane Relief Fund",
    percentage: 11,
    color: "#FF69B4",
  },
  {
    id: "5",
    name: "The Wildfire Relief Fund",
    percentage: 10,
    color: "#87CEEB",
  },
];

export default function CauseBreakdown() {
  const widthAndHeight = 120;

  const series = [
    { value: 50, color: "#D5DE69" },
    { value: 24, color: "#2D5016" },
    { value: 5, color: "#FF6B35" },
    { value: 11, color: "#FF69B4" },
    { value: 10, color: "#87CEEB" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cause Breakdown</Text>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={20} color="#666666" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.chartContainer}>
          <PieChart widthAndHeight={widthAndHeight} series={series} />
        </View>

        <View style={styles.legend}>
          {mockCauses.map((cause) => (
            <View key={cause.id} style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: cause.color }]}
              />
              <View style={styles.legendText}>
                <Text style={styles.legendName}>{cause.name}</Text>
                <Text style={styles.legendPercentage}>{cause.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
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
});
