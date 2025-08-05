import { AuthProvider } from "@/context/auth";
import { DataRefreshProvider } from "@/context/dataRefresh";
import { useFonts } from "expo-font";
import { Stack, usePathname, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";
import Navbar from "./components/Navbar";
import PostSignInHandler from "./components/PostSignInHandler";
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
    router.push("/(tabs)/settings");
  };

  const handleNotificationPress = () => {
    router.push("/recent-activity");
  };

  const handleLogoPress = () => {
    router.push("/(tabs)/dashboard");
  };

  // Only show navbar on tabs and webview screens, not on index (login/plaid setup)
  const shouldShowNavbar =
    pathname === "/dashboard" ||
    pathname === "/explore" ||
    pathname === "/charities" ||
    pathname === "/settings" ||
    pathname.startsWith("/webview") ||
    pathname === "/recent-activity";

  // Set colors based on current screen
  const isDashboard = pathname === "/dashboard";
  const textColor = isDashboard ? "#FFFFFF" : "#000000";
  const iconColor = isDashboard ? "#FFFFFF" : "#000000";
  const backgroundColor = isDashboard ? "#1F4A2C" : "white";

  return (
    <AuthProvider>
      <DataRefreshProvider>
        <View style={{ flex: 1, position: "relative" }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="recent-activity" />
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
              onLogoPress={handleLogoPress}
              backgroundColor={backgroundColor}
              textColor={textColor}
              iconColor={iconColor}
            />
          )}
        </View>
      </DataRefreshProvider>
    </AuthProvider>
  );
}
