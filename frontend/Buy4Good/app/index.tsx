import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "@/context/auth";
import LoginForm from "@/components/LoginForm";
import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  // Redirect to tabs if user is authenticated
  return <Redirect href={"/(tabs)/dashboard" as any} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});