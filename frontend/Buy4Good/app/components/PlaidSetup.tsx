import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import {
  create,
  open,
  dismissLink,
  LinkSuccess,
  LinkExit,
  LinkIOSPresentationStyle,
  LinkLogLevel,
} from "react-native-plaid-link-sdk";
import { router } from "expo-router";
import { useAuth, AuthUser } from "@/context/auth";
import GridPattern from "./GridPattern";

export default function PlaidSetup() {
  const { user, supabaseUser } = useAuth();
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const address = Platform.OS === "ios" ? "localhost" : "10.0.2.2";

  const createLinkToken = async (user: AuthUser) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `http://${address}:8000/api/v1/create_link_token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: address,
            user_id: user.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.link_token) {
        return { linkToken: data.link_token };
      } else {
        throw new Error("No link token received from Plaid");
      }
    } catch (error: any) {
      let errorMessage = "Failed to create link token. Please try again.";

      if (error.message.includes("400")) {
        errorMessage =
          "Invalid request to Plaid. Please check your credentials.";
      } else if (error.message.includes("401")) {
        errorMessage = "Unauthorized. Please check your Plaid credentials.";
      } else if (error.message.includes("403")) {
        errorMessage = "Forbidden. Please check your Plaid permissions.";
      } else if (error.message.includes("500")) {
        errorMessage = "Server error. Please try again later.";
      }

      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createLinkTokenConfiguration = (
    token: string,
    noLoadingState: boolean = false
  ) => {
    return {
      token: token,
      noLoadingState: noLoadingState,
    };
  };

  useEffect(() => {
    const getLinkToken = async () => {
      // Try to use supabaseUser.id if available, otherwise fall back to user.id
      const userId = supabaseUser?.id || user?.id;

      if (!userId) {
        return;
      }

      if (!user) {
        return;
      }

      const data = await createLinkToken(user);

      if (data?.linkToken) {
        setToken(data.linkToken);
        const tokenConfiguration = createLinkTokenConfiguration(
          data?.linkToken
        );
        create(tokenConfiguration);
      }
    };

    getLinkToken();
  }, [user, supabaseUser]);

  const handleSuccess = async (success: LinkSuccess) => {
    // Try to use supabaseUser.id if available, otherwise fall back to user.id
    const userId = supabaseUser?.id || user?.id;

    if (!userId) {
      return;
    }

    try {
      // Exchange the public token for an access token
      const response = await fetch(
        `http://${address}:8000/api/v1/exchange_public_token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            public_token: success.publicToken,
            user_id: userId,
          }),
        }
      );

      if (!response.ok) {
        // Handle error silently
      }
    } catch (error) {
      // Handle error silently
    }

    // Navigate to dashboard after successful bank connection
    router.replace("/(tabs)/dashboard");
  };

  const handleExit = (linkExit: LinkExit) => {
    dismissLink();
  };

  const openProps = {
    onSuccess: handleSuccess,
    onExit: handleExit,
  };

  return (
    <View className="flex-1 relative bg-[#1F4A2C]">
      {/* Split Background */}
      <View className="absolute top-0 left-0 right-0 h-[60%] bg-[#1F4A2C]">
        <GridPattern />
      </View>
      <View className="absolute bottom-0 left-0 right-0 h-[40%] bg-[#1F4A2C]" />

      <View
        className="flex-1 z-10"
        style={{
          justifyContent: "flex-start",
          paddingHorizontal: 24,
          paddingTop: 80,
          paddingBottom: 40,
        }}
      >
        {/* Header with logo and title */}
        <View className="items-center mb-8">
          <Text className="text-lg font-extrabold text-[#D5DE69] tracking-wider leading-[18px]">
            BUY4
          </Text>
          <Text className="text-lg font-extrabold text-[#D5DE69] tracking-wider leading-[18px]">
            GOOD
          </Text>
        </View>

        <Text className="text-[34px] font-bold text-[#D5DE69] text-center mb-3">
          Connect your Spending Card
        </Text>
        <Text className="text-sm font-medium text-[#D5DE69] text-center mb-10 leading-[22px] opacity-90">
          We’ll use your purchases to help you donate
        </Text>

        {/* Card Image */}
        <View className="items-center mb-8">
          <View className="relative">
            <Image
              source={require("../../assets/images/credit_card.png")}
              className="w-96 h-44 rounded-2xl"
              resizeMode="contain"
            />
            {/* Fade overlay at bottom */}
            <View className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#1F4A2C] via-[#1F4A2C] via-opacity-80 to-transparent rounded-b-2xl" />
          </View>
        </View>

        {/* Connect Button */}
        <View className="px-2">
          <TouchableOpacity
            className={`rounded-xl py-4 items-center shadow-md ${
              token ? "bg-[#D5DE69]" : "bg-gray-300"
            }`}
            onPress={() => {
              if (token) {
                open(openProps);
              }
            }}
            disabled={!token || isLoading}
          >
            <Text
              className={`text-base font-bold ${
                token ? "text-[#1F4A2C]" : "text-gray-500"
              }`}
            >
              {isLoading ? "Loading..." : "Connect to Your Bank"}
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View className="mt-6 px-2">
            <View className="bg-red-50 rounded-xl p-4">
              <Text className="text-red-600 text-sm text-center">{error}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
