import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import DashboardHeader from "@/app/components/DashboardHeader";
import SummaryStats from "@/app/components/SummaryStats";
import RecentActivity from "@/app/components/RecentActivity";
import CauseBreakdown from "@/app/components/CauseBreakdown";
import PartnerBrands from "@/app/components/PartnerBrands";

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
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
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
  },
});
