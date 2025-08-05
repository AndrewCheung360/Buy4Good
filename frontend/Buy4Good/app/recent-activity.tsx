import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Image,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/auth";
import { router } from "expo-router";
import GridPattern from "./components/GridPattern";
import { mockMerchants } from "../data/mockData";
import { useFocusEffect } from "expo-router";

interface DonationItem {
  id: string;
  charity_id: string;
  charity_name: string;
  donation_amount: number;
  donation_date: string;
  logo_url?: string;
  original_transaction_id?: string;
  merchant_name?: string;
  product_name?: string;
  transaction_amount?: number;
  merchant_logo?: string;
}

interface TransactionGroup {
  transaction_id: string;
  merchant_name: string;
  product_name: string;
  transaction_amount: number;
  transaction_date: string;
  donations: DonationItem[];
}

export default function RecentActivityScreen() {
  const { supabaseUser } = useAuth();
  const [transactionGroups, setTransactionGroups] = useState<
    TransactionGroup[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecentDonations = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      if (!supabaseUser?.id) {
        setError("No user available");
        return;
      }

      const address = Platform.OS === "ios" ? "localhost" : "10.0.2.2";

      const response = await fetch(
        `http://${address}:8000/api/v1/recent_donations/${
          supabaseUser.id
        }?t=${Date.now()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Group donations by transaction
        const groupedByTransaction = new Map<string, DonationItem[]>();

        // Fetch logo URLs for each donation
        const donationsWithLogos = await Promise.all(
          data.donations.map(async (donation: DonationItem) => {
            try {
              const response = await fetch(
                `http://${address}:8000/api/v1/organizations/${donation.charity_id}`
              );
              if (response.ok) {
                const organization = await response.json();
                return {
                  ...donation,
                  logo_url: organization.logo_url,
                };
              }
            } catch (error) {
              // Handle error silently
            }
            return donation;
          })
        );

        // Group donations by original_transaction_id
        donationsWithLogos.forEach((donation) => {
          const transactionId = donation.original_transaction_id || donation.id;
          if (!groupedByTransaction.has(transactionId)) {
            groupedByTransaction.set(transactionId, []);
          }
          groupedByTransaction.get(transactionId)!.push(donation);
        });

        // Convert to TransactionGroup array
        const groups: TransactionGroup[] = Array.from(
          groupedByTransaction.entries()
        ).map(([transactionId, donations]) => {
          const firstDonation = donations[0];

          // Try to find merchant data from mockData
          let merchantName = firstDonation.merchant_name || "Unknown Merchant";
          let productName = firstDonation.product_name || "Purchase";

          // If we have a merchant name, try to find it in mockData
          if (merchantName && merchantName !== "Unknown Merchant") {
            const allMerchants = Object.values(mockMerchants).flat();
            const merchantData = allMerchants.find(
              (m) =>
                m.name.toLowerCase() === merchantName.toLowerCase() ||
                m.id.toLowerCase() === merchantName.toLowerCase() ||
                merchantName.toLowerCase().includes(m.name.toLowerCase()) ||
                m.name.toLowerCase().includes(merchantName.toLowerCase())
            );
            if (merchantData) {
              merchantName = merchantData.name;
              // Use a more descriptive product name based on merchant
              if (
                productName === "Purchase" ||
                productName.includes("Purchase")
              ) {
                productName = `${merchantData.name} Purchase`;
              }
            }
          }

          // If still no merchant name, try to extract from original_transaction_id
          if (
            merchantName === "Unknown Merchant" &&
            firstDonation.original_transaction_id
          ) {
            // Try to extract merchant info from transaction ID or use a generic name
            merchantName = "Online Purchase";
            productName = "Online Purchase";
          }

          return {
            transaction_id: transactionId,
            merchant_name: merchantName,
            product_name: productName,
            transaction_amount:
              firstDonation.transaction_amount ||
              donations.reduce((sum, d) => sum + d.donation_amount, 0),
            transaction_date: firstDonation.donation_date,
            donations: donations,
          };
        });

        // Sort by date (most recent first)
        groups.sort(
          (a, b) =>
            new Date(b.transaction_date).getTime() -
            new Date(a.transaction_date).getTime()
        );

        setTransactionGroups(groups);
      } else {
        setError("Failed to load donations");
      }
    } catch (error: any) {
      setError("Failed to load donations");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecentDonations();
  }, [supabaseUser?.id]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchRecentDonations();
    }, [supabaseUser?.id])
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours}h`;
    } else if (diffInHours < 168) {
      // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days}d`;
    } else {
      const weeks = Math.floor(diffInHours / 168);
      return `${weeks}w`;
    }
  };

  const getTimeSection = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return "This week";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      });
    }
  };

  const getCharityIcon = (charityName: string, logoUrl?: string) => {
    if (logoUrl) {
      return null; // Will render Image component instead
    }

    // Simple icon mapping based on charity name
    const iconMap: Record<string, string> = {
      "Red Cross": "🩸",
      "Feeding America": "🍽️",
      "St. Jude": "🏥",
      "World Wildlife Fund": "🐼",
      "Doctors Without Borders": "🚑",
      UNICEF: "📚",
      "Habitat for Humanity": "🏠",
      "American Cancer Society": "🎗️",
      "Test Charity": "💝",
    };

    return iconMap[charityName] || "💝";
  };

  return (
    <SafeAreaView style={styles.container}>
      <GridPattern />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchRecentDonations(true)}
            colors={["#1F4A2C"]}
            tintColor="#1F4A2C"
          />
        }
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#1F4A2C" />
            </TouchableOpacity>
            <Text style={styles.title}>Recent Activity</Text>
            <View style={styles.placeholder} />
          </View>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1F4A2C" />
              <Text style={styles.loadingText}>Loading donations...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {!loading && !error && transactionGroups.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No donations yet</Text>
              <Text style={styles.emptyText}>
                Your donations will appear here once you make your first
                purchase
              </Text>
            </View>
          )}

          {!loading &&
            !error &&
            transactionGroups.map((group, groupIndex) => {
              const timeSection = getTimeSection(group.transaction_date);
              const showSectionHeader =
                groupIndex === 0 ||
                getTimeSection(
                  transactionGroups[groupIndex - 1].transaction_date
                ) !== timeSection;

              return (
                <View key={group.transaction_id}>
                  {showSectionHeader && (
                    <Text style={styles.sectionHeader}>{timeSection}</Text>
                  )}

                  <View style={styles.transactionCard}>
                    {/* Transaction Header */}
                    <View style={styles.transactionHeader}>
                      <View style={styles.productInfo}>
                        <View style={styles.productImage}>
                          {group.donations[0]?.merchant_logo ? (
                            <Image
                              source={{ uri: group.donations[0].merchant_logo }}
                              style={styles.merchantLogo}
                              resizeMode="contain"
                            />
                          ) : (
                            <Ionicons
                              name="bag-outline"
                              size={24}
                              color="#666666"
                            />
                          )}
                        </View>
                        <View style={styles.productDetails}>
                          <Text style={styles.productName}>
                            {group.product_name}
                          </Text>
                          <Text style={styles.merchantName}>
                            {group.merchant_name}
                          </Text>
                          <Text style={styles.transactionDate}>
                            {formatDate(group.transaction_date)}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.transactionAmount}>
                        ${group.transaction_amount.toFixed(2)}
                      </Text>
                    </View>

                    {/* Donations List */}
                    <View style={styles.donationsContainer}>
                      {group.donations.map((donation) => (
                        <View key={donation.id} style={styles.donationItem}>
                          <View style={styles.charityIcon}>
                            {donation.logo_url ? (
                              <Image
                                source={{ uri: donation.logo_url }}
                                style={styles.charityLogo}
                                resizeMode="contain"
                              />
                            ) : (
                              <Text style={styles.charityIconText}>
                                {getCharityIcon(donation.charity_name)}
                              </Text>
                            )}
                          </View>
                          <Text style={styles.charityName}>
                            {donation.charity_name}
                          </Text>
                          <Text style={styles.donationAmount}>
                            ${donation.donation_amount.toFixed(2)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  placeholder: {
    width: 44,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: "#ff0000",
    textAlign: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
    marginTop: 24,
  },
  transactionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  merchantLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  merchantName: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: "#999999",
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F4A2C",
  },
  donationsContainer: {
    padding: 16,
  },
  donationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  charityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  charityLogo: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  charityIconText: {
    fontSize: 16,
  },
  charityName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  donationAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F4A2C",
  },
});
