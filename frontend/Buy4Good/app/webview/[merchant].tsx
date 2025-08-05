import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../context/auth";
import { useDataRefresh } from "../../context/dataRefresh";
import { Platform } from "react-native";
import { mockMerchants } from "../../data/mockData";
import GridPattern from "../components/GridPattern";
import { supabase } from "../../utils/supabase";

export default function MerchantWebViewScreen() {
  const { url, name } = useLocalSearchParams<{
    merchant: string;
    url: string;
    name: string;
  }>();

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [userSettings, setUserSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState("100");
  const { user, supabaseUser } = useAuth();
  const { markDataChanged } = useDataRefresh();

  const address = Platform.OS === "ios" ? "localhost" : "10.0.2.2";
  const userId = supabaseUser?.id || user?.id;

  // Find merchant data from mockData
  const allMerchants = Object.values(mockMerchants).flat();
  const merchantData = allMerchants.find(
    (m) =>
      m.name.toLowerCase() === name?.toLowerCase() ||
      m.id.toLowerCase() === name?.toLowerCase()
  );

  useEffect(() => {
    if (userId) {
      getUserSettings();
    }
  }, [userId]);

  const handleNavigationStateChange = (navState: any) => {
    // Simulate purchase detection on checkout/success pages
    if (
      navState.url.includes("checkout") ||
      navState.url.includes("cart") ||
      navState.url.includes("success") ||
      navState.url.includes("thank")
    ) {
      // Simulate a purchase after a delay
      setTimeout(() => {
        setShowPurchaseModal(true);
      }, 2000);
    }
  };

  const simulatePurchase = () => {
    setShowPurchaseModal(true);
  };

  const getUserSettings = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `http://${address}:8000/api/v1/get_user_settings/${userId}`
      );
      const data = await response.json();

      if (data.success) {
        setUserSettings(data.settings);
      }
    } catch (error) {
      // Handle error silently
    }
  };

  const createAutoDonation = async () => {
    if (!userId) return;

    setIsLoading(true);

    try {
      // Calculate cashback based on purchase amount and merchant rate
      const purchaseValue = parseFloat(purchaseAmount) || 100;
      const cashbackRate = merchantData?.cashbackRate || 2.0; // Default 2%
      const cashbackAmount = (purchaseValue * cashbackRate) / 100;
      const donationPercentage = userSettings?.auto_donation_percentage || 0.01; // Default 1%
      const totalDonationAmount = cashbackAmount * donationPercentage;

      // Get user's charity preferences with allocation percentages
      const { data: preferences, error: prefError } = await supabase
        .from("user_charity_preferences")
        .select("charity_id, allocation_percentage")
        .eq("user_id", userId)
        .eq("is_active", true);

      if (prefError) {
        // Fall back to single donation
        return await createSingleDonation(
          cashbackAmount,
          donationPercentage,
          purchaseValue,
          cashbackRate
        );
      }

      if (!preferences || preferences.length === 0) {
        // No charity preferences, create single donation
        return await createSingleDonation(
          cashbackAmount,
          donationPercentage,
          purchaseValue,
          cashbackRate
        );
      }

      // Calculate individual charity donations based on allocation percentages
      const charityDonations = preferences.map((pref: any) => ({
        charity_id: pref.charity_id,
        amount: totalDonationAmount * (pref.allocation_percentage / 100),
      }));

      // Create donations for each charity
      let totalDistributed = 0;
      for (const charityDonation of charityDonations) {
        if (charityDonation.amount > 0) {
          const donationPayload = {
            user_id: userId,
            transaction_amount: charityDonation.amount,
            original_transaction_id: `cashback_${Date.now()}_${
              charityDonation.charity_id
            }`,
            donation_percentage: 1.0, // 100% since this is already the donation amount
            charity_id: charityDonation.charity_id,
            date: new Date().toISOString().split("T")[0],
            merchant_name: merchantData?.name || name,
            product_name: `${merchantData?.name || name} Purchase`,
            merchant_logo: merchantData?.logo || null,
          };

          const response = await fetch(
            `http://${address}:8000/api/v1/transactions/auto_donate`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(donationPayload),
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              totalDistributed += charityDonation.amount;
              // Mark that data has changed
              markDataChanged();
            }
          }
        }
      }

      return {
        success: true,
        cashbackAmount,
        donationAmount: totalDistributed,
        donationPercentage,
        purchaseAmount: purchaseValue,
        cashbackRate,
        distributedToCharities: charityDonations.length,
      };
    } catch (error) {
      // Handle error silently
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const createSingleDonation = async (
    cashbackAmount: number,
    donationPercentage: number,
    purchaseValue: number,
    cashbackRate: number
  ) => {
    const donationPayload = {
      user_id: userId,
      transaction_amount: cashbackAmount,
      original_transaction_id: `cashback_${Date.now()}`,
      donation_percentage: donationPercentage,
      date: new Date().toISOString().split("T")[0],
      merchant_name: merchantData?.name || name,
      product_name: `${merchantData?.name || name} Purchase`,
      merchant_logo: merchantData?.logo || null,
    };

    const response = await fetch(
      `http://${address}:8000/api/v1/transactions/auto_donate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donationPayload),
      }
    );

    const data = await response.json();

    if (data.success) {
      // Mark that data has changed
      markDataChanged();
      return {
        success: true,
        cashbackAmount,
        donationAmount: cashbackAmount * donationPercentage,
        donationPercentage,
        purchaseAmount: purchaseValue,
        cashbackRate,
      };
    } else {
      throw new Error("Failed to create donation");
    }
  };

  const handlePurchaseConfirm = async () => {
    setShowPurchaseModal(false);

    // Create auto-donation
    const result = await createAutoDonation();

    if (
      result?.success &&
      result.cashbackAmount &&
      result.donationAmount &&
      result.donationPercentage
    ) {
      const {
        cashbackAmount,
        donationAmount,
        donationPercentage,
        purchaseAmount,
        cashbackRate,
        distributedToCharities,
      } = result as any;
      const percentageText = (donationPercentage * 100).toFixed(1);

      let message = `Purchase: $${purchaseAmount.toFixed(
        2
      )}\nCashback: $${cashbackAmount.toFixed(
        2
      )} (${cashbackRate}%)\nDonation: $${donationAmount.toFixed(
        2
      )} (${percentageText}%)`;

      if (distributedToCharities) {
        message += `\n\nDistributed to ${distributedToCharities} charities based on your allocation preferences!`;
      } else {
        message += `\n\nYour donation has been automatically processed!`;
      }

      Alert.alert("Purchase Confirmed! 🎉", message, [
        {
          text: "View Dashboard",
          onPress: () => router.push("/(tabs)/dashboard" as any),
        },
        {
          text: "Continue Shopping",
          style: "cancel",
        },
      ]);
    } else {
      Alert.alert(
        "Purchase Confirmed! 🎉",
        `Your cashback from ${name} will be processed soon. You'll receive a notification about your donation split.`,
        [
          {
            text: "View Dashboard",
            onPress: () => router.push("/(tabs)/dashboard" as any),
          },
          {
            text: "Continue Shopping",
            style: "cancel",
          },
        ]
      );
    }
  };

  const goBack = () => {
    // router.back();
    router.replace("/(tabs)/explore" as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.merchantName} numberOfLines={1}>
          {name}
        </Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={simulatePurchase}
          >
            <Ionicons name="bag-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* WebView */}
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />

      {/* Purchase Simulation Modal */}
      <Modal
        visible={showPurchaseModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPurchaseModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <GridPattern />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Purchase Detected! 🛍️</Text>
              <TouchableOpacity
                onPress={() => setShowPurchaseModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.purchaseDetails}>
              <View style={styles.merchantSection}>
                <Text style={styles.merchantLabel}>Shopping at:</Text>
                <Text style={styles.merchantNameLarge}>{name}</Text>
              </View>

              <View style={styles.purchaseInputSection}>
                <Text style={styles.inputLabel}>Purchase Amount:</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={purchaseAmount}
                    onChangeText={setPurchaseAmount}
                    keyboardType="numeric"
                    placeholder="100"
                    placeholderTextColor="#8E8E93"
                  />
                </View>
              </View>

              <View style={styles.cashbackInfo}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="cash-outline"
                    size={24}
                    color="rgba(255,255,255,0.9)"
                  />
                </View>
                <Text style={styles.cashbackLabel}>Estimated Cashback:</Text>
                <Text style={styles.cashbackAmount}>
                  $
                  {(
                    ((parseFloat(purchaseAmount) || 100) *
                      (merchantData?.cashbackRate || 2.0)) /
                    100
                  ).toFixed(2)}
                </Text>
                <Text style={styles.cashbackRate}>
                  {merchantData?.cashbackRate || 2.0}% cashback rate
                </Text>
              </View>

              <View style={styles.donationInfo}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="heart-outline"
                    size={24}
                    color="rgba(31,74,44,0.9)"
                  />
                </View>
                <Text style={styles.donationLabel}>
                  Your charity will receive:
                </Text>
                <Text style={styles.donationAmount}>
                  $
                  {(
                    (((parseFloat(purchaseAmount) || 100) *
                      (merchantData?.cashbackRate || 2.0)) /
                      100) *
                    (userSettings?.auto_donation_percentage || 0.01)
                  ).toFixed(2)}{" "}
                  ({(userSettings?.auto_donation_percentage || 0.01) * 100}%)
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.confirmButton, isLoading && { opacity: 0.7 }]}
              onPress={handlePurchaseConfirm}
              disabled={isLoading}
            >
              <Text style={styles.confirmButtonText}>
                {isLoading ? "Processing..." : "Confirm Purchase"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F4A2C",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#1F4A2C",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  merchantName: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  webview: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 32,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  purchaseDetails: {
    flex: 1,
  },
  merchantSection: {
    marginBottom: 20,
  },
  iconContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  purchaseInputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    padding: 0,
  },
  cashbackRate: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
    fontWeight: "500",
  },
  merchantLabel: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 8,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  merchantNameLarge: {
    fontSize: 36,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  cashbackInfo: {
    backgroundColor: "#1F4A2C",
    borderRadius: 20,
    padding: 28,
    marginBottom: 24,
    shadowColor: "#1F4A2C",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cashbackLabel: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 8,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  cashbackAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  donationInfo: {
    backgroundColor: "#D5DE69",
    borderRadius: 20,
    padding: 28,
    marginBottom: 60,
    shadowColor: "#D5DE69",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  donationLabel: {
    fontSize: 16,
    color: "rgba(31,74,44,0.9)",
    marginBottom: 8,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  donationAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1F4A2C",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  confirmButton: {
    backgroundColor: "#1F4A2C",
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#1F4A2C",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
