import { AuthProvider } from "@/context/auth";
import { useFonts } from "expo-font";
import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import Navbar from "./components/Navbar";
import "./globals.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const pathname = usePathname();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const handleProfilePress = () => {
    console.log("Profile pressed from Layout");
  };

  const handleNotificationPress = () => {
    console.log("Notifications pressed from Layout");
  };

  // Only show navbar on tabs and webview screens, not on index (login/plaid setup)
  const shouldShowNavbar =
    pathname === "/dashboard" ||
    pathname === "/explore" ||
    pathname === "/charities" ||
    pathname === "/settings" ||
    pathname.startsWith("/webview");

  // Set colors based on current screen
  const isDashboard = pathname === "/dashboard";
  const textColor = isDashboard ? "#FFFFFF" : "#000000";
  const iconColor = isDashboard ? "#FFFFFF" : "#000000";
  const backgroundColor = isDashboard ? "#1F4A2C" : "white";

  console.log("Current pathname:", pathname);
  console.log("Should show navbar:", shouldShowNavbar);

  return (
    <AuthProvider>
      <View style={{ flex: 1, position: "relative" }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="webview"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              gestureEnabled: true,
              gestureDirection: "vertical",
            }}
          />
        </Stack>
        {shouldShowNavbar && (
          <Navbar
            onProfilePress={handleProfilePress}
            onNotificationPress={handleNotificationPress}
            backgroundColor={backgroundColor}
            textColor={textColor}
            iconColor={iconColor}
          />
        )}
      </View>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
