import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import {
  create,
  open,
  dismissLink,
  LinkSuccess,
  LinkExit,
  LinkIOSPresentationStyle,
  LinkLogLevel,
} from "react-native-plaid-link-sdk";
import { plaidClient } from "../../utils/plaid";
import { CountryCode, Products } from "plaid";
import { router } from "expo-router";
import { useAuth, AuthUser } from "@/context/auth";
import GridPattern from "./GridPattern";

export default function PlaidSetup() {
  const { user } = useAuth();
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

  const createLinkToken = async (user: AuthUser) => {
    try {
      setIsLoading(true);
      setError(null);

      const tokenParams = {
        user: {
          client_user_id: user.id,
        },
        client_name: `${user.given_name || user.name} ${
          user.family_name || ""
        }`,
        products: ["auth"] as Products[],
        language: "en",
        country_codes: ["US"] as CountryCode[],
      };

      const response = await plaidClient.linkTokenCreate(tokenParams);

      if (response.data.link_token) {
        return parseStringify({ linkToken: response.data.link_token });
      } else {
        throw new Error("No link token received from Plaid");
      }
    } catch (error: any) {
      console.error("Error creating link token:", error);

      let errorMessage = "Failed to create link token. Please try again.";

      if (error.response?.status === 400) {
        errorMessage =
          "Invalid request to Plaid. Please check your credentials.";
      } else if (error.response?.status === 401) {
        errorMessage = "Unauthorized. Please check your Plaid credentials.";
      } else if (error.response?.status === 403) {
        errorMessage = "Forbidden. Please check your Plaid permissions.";
      } else if (error.response?.data?.error_message) {
        errorMessage = `Plaid Error: ${error.response.data.error_message}`;
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
      if (!user) return;

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
  }, [user]);

  const handleSuccess = (success: LinkSuccess) => {
    console.log("Plaid link success:", success);
    // Navigate to dashboard after successful bank connection
    router.replace("/(tabs)/dashboard");
  };

  const handleExit = (linkExit: LinkExit) => {
    console.log("Plaid link exit:", linkExit);
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
              {isLoading ? "Creating Token..." : "Connect to Your Bank"}
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
