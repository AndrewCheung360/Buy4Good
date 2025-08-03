import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import DashboardHeader from "@/app/components/DashboardHeader";
import SummaryStats from "@/app/components/SummaryStats";
import RecentActivity from "@/app/components/RecentActivity";
import CauseBreakdown from "@/app/components/CauseBreakdown";
import PartnerBrands from "@/app/components/PartnerBrands";

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#1F4A2C" />
      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <DashboardHeader />
        <SummaryStats />
        <RecentActivity />
        <CauseBreakdown />
        <PartnerBrands />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  scrollContent: {// Add padding to account for the navbar
  },
});
