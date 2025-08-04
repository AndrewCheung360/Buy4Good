import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/auth";

interface NavbarProps {
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
}

export default function Navbar({
  onProfilePress,
  onNotificationPress,
  backgroundColor = "white",
  textColor = "#000000",
  iconColor = "#000000",
}: NavbarProps) {
  const { user, supabaseUser } = useAuth();

  // Try to get profile picture from multiple sources
  const profilePicture =
    user?.picture ||
    supabaseUser?.user_metadata?.avatar_url ||
    supabaseUser?.user_metadata?.picture;

  return (
    <View className="absolute top-0 left-0 right-0">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <View style={{ backgroundColor: backgroundColor + "/90" }}>
        <SafeAreaView className="pt-0 pb-0">
          <View className="flex-row justify-between items-center px-5 py-3">
            <TouchableOpacity
              className="w-10 h-10 justify-center items-center"
              onPress={onProfilePress}
            >
              {profilePicture ? (
                <Image
                  source={{ uri: profilePicture }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    borderWidth: 2,
                    borderColor: "#FFFFFF",
                  }}
                />
              ) : (
                <View className="w-10 h-10 rounded-full bg-[#1A3B48] justify-center items-center border-2 border-white">
                  <Ionicons name="person" size={20} color="#1A3B48" />
                </View>
              )}
            </TouchableOpacity>

            <View className="items-center">
              <Text
                className="text-lg font-extrabold tracking-wider leading-[18px]"
                style={{ color: textColor }}
              >
                BUY4
              </Text>
              <Text
                className="text-lg font-extrabold tracking-wider leading-[18px]"
                style={{ color: textColor }}
              >
                GOOD
              </Text>
            </View>

            <TouchableOpacity
              className="w-10 h-10 justify-center items-center"
              onPress={onNotificationPress}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={iconColor}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  safeArea: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  profileButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
  },
  defaultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A3B48",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
    lineHeight: 18,
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
