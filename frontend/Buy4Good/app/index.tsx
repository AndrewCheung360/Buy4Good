import { Text, View, ActivityIndicator, Button, StyleSheet } from "react-native";
import { useAuth } from "@/context/auth";
import LoginForm from "@/components/LoginForm";
import { BASE_URL } from "@/constants";
import React from "react";
import { WebView } from "react-native-webview";
import Constants from 'expo-constants';


export default function Index() {
  const { user, isLoading, signOut, fetchWithAuth} = useAuth();
  const [data, setData] = React.useState(null);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  async function getProtectedData() {
    const response = await fetchWithAuth(`${BASE_URL}/api/protected/data`, {
      method: "GET",
    });
    const data = await response.json();
    setData(data);
  }
  
  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text>Welcome, {user.name}!</Text>
        <Text>Email: {user.email}</Text>
        <Text>ID: {user.id}</Text>
        <Button title="Sign Out" onPress={signOut} />
        <Text>{data ? JSON.stringify(data) : "No data available"}</Text>
        <Button title="Get Protected Data" onPress={getProtectedData} />
      </View>
      <WebView
        style={styles.webview}
        source={{ uri: "https://www.amazon.com/" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  webview: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    width: "100%",
    height: "100%",
  },
});