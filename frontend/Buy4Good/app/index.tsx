import { useAuth } from "@/context/auth";
import LoginForm from "./components/LoginForm";
import PlaidSetup from "./components/PlaidSetup";
import PostSignInHandler from "./components/PostSignInHandler";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

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

  // Show Plaid setup if user is authenticated
  return (
    <View style={styles.container}>
      <PostSignInHandler />
      <PlaidSetup />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
});
