import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Alert,
  Modal,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

export default function MerchantWebViewScreen() {
  const { url, name } = useLocalSearchParams<{ 
    merchant: string; 
    url: string; 
    name: string;
  }>();
  
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const handleNavigationStateChange = (navState: any) => {
    // Simulate purchase detection on checkout/success pages
    if (navState.url.includes('checkout') || 
        navState.url.includes('cart') || 
        navState.url.includes('success') ||
        navState.url.includes('thank')) {
      // Simulate a purchase after a delay
      setTimeout(() => {
        setShowPurchaseModal(true);
      }, 2000);
    }
  };

  const simulatePurchase = () => {
    setShowPurchaseModal(true);
  };

  const handlePurchaseConfirm = () => {
    setShowPurchaseModal(false);
    
    // Show success feedback
    Alert.alert(
      'Purchase Confirmed! 🎉',
      `Your cashback from ${name} will be processed soon. You'll receive a notification about your donation split.`,
      [
        {
          text: 'View Dashboard',
          onPress: () => router.push('/(drawer)/(tabs)/dashboard' as any)
        },
        {
          text: 'Continue Shopping',
          style: 'cancel'
        }
      ]
    );
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="chevron-back" size={24} color="#666" />
        </TouchableOpacity>
        
        <Text style={styles.merchantName} numberOfLines={1}>{name}</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={simulatePurchase}>
            <Ionicons name="bag-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={20} color="#666" />
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
              <Text style={styles.merchantLabel}>Shopping at:</Text>
              <Text style={styles.merchantNameLarge}>{name}</Text>
              
              <View style={styles.cashbackInfo}>
                <Text style={styles.cashbackLabel}>Estimated Cashback:</Text>
                <Text style={styles.cashbackAmount}>$12.50</Text>
              </View>
              
              <View style={styles.donationInfo}>
                <Text style={styles.donationLabel}>Your charity will receive:</Text>
                <Text style={styles.donationAmount}>$6.25 (50%)</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={handlePurchaseConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm Purchase</Text>
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  backButton: {
    marginRight: 12,
  },
  merchantName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  purchaseDetails: {
    flex: 1,
    paddingVertical: 32,
  },
  merchantLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  merchantNameLarge: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 32,
  },
  cashbackInfo: {
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  cashbackLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  cashbackAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  donationInfo: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  donationLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  donationAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34C759',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
