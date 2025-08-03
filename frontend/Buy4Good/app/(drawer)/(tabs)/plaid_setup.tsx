import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  create,
  open,
  dismissLink,
  LinkSuccess,
  LinkExit,
  LinkIOSPresentationStyle,
  LinkLogLevel,
  LinkTokenConfiguration,
  LinkOpenProps,
} from "react-native-plaid-link-sdk";
import { plaidClient } from "../../../utils/plaid";
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from "plaid";

type User = {
  $id: string;
  email: string;
  userId: string;
  dwollaCustomerUrl: string;
  dwollaCustomerId: string;
  firstName: string;
  lastName: string;
  name: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
};

interface PlaidLinkProps {
  user: User;
  variant?: "primary" | "ghost";
  dwollaCustomerId?: string;
}

interface exchangePublicTokenProps {
  publicToken: string;
  user: User;
}

function PlaidLink({ user }: PlaidLinkProps) {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));
  function encryptId(id: string) {
    return btoa(id);
  }

  const createLinkToken = async (user: User) => {
    try {
      setIsLoading(true);
      setError(null);

      const tokenParams = {
        user: {
          client_user_id: user.$id,
        },
        client_name: `${user.firstName} ${user.lastName}`,
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

  const openProps = {
    onSuccess: (success: LinkSuccess) => {
      console.log(success);
    },
    onExit: (linkExit: LinkExit) => {
      console.log(linkExit);
    },
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-10">
        <Text className="text-3xl font-bold text-gray-900 mb-4">
          Bank Account Setup
        </Text>
        <Text className="text-base text-gray-600 leading-6 mb-10">
          Connect your bank account to start tracking your purchases and earning
          rewards.
        </Text>

        <View className="p-5 bg-gray-50 rounded-xl mb-10">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Why connect your bank?
          </Text>
          <Text className="text-sm text-gray-600 leading-5">
            • Automatically track your purchases{"\n"}• Earn rewards on eligible
            transactions{"\n"}• Get insights into your spending habits{"\n"}•
            Secure connection via Plaid
          </Text>
        </View>

        {error && (
          <View className="p-4 bg-red-50 rounded-xl mb-4">
            <Text className="text-red-600 text-sm">{error}</Text>
          </View>
        )}
        <TouchableOpacity
          className={`rounded-xl py-4 px-6 items-center shadow-sm ${
            token ? "bg-blue-500" : "bg-gray-300"
          }`}
          onPress={() => {
            if (token) {
              open(openProps);
            }
          }}
          disabled={!token || isLoading}
        >
          <Text
            className={`text-lg font-semibold ${
              token ? "text-white" : "text-gray-500"
            }`}
          >
            {isLoading ? "Creating Token..." : "Connect Bank Account"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// PlaidSetupScreen component that uses the PlaidLink component
function PlaidSetupScreen() {
  // Mock user data - in a real app, this would come from your auth context or props
  const mockUser: User = {
    $id: "user123",
    email: "user@example.com",
    userId: "user123",
    dwollaCustomerUrl: "",
    dwollaCustomerId: "",
    firstName: "John",
    lastName: "Doe",
    name: "John Doe",
    address1: "123 Main St",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    dateOfBirth: "1990-01-01",
    ssn: "123-45-6789",
  };

  return <PlaidLink user={mockUser} />;
}

export default PlaidSetupScreen;
