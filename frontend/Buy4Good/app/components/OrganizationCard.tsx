import { Ionicons } from "@expo/vector-icons"; // Make sure you have this import
import { User } from "@supabase/supabase-js";
import React, { useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";

export type Organization = {
  id: string;
  name: string;
  logo: string;
  website: string;
  mission: string;
};

export default function OrganizationCard({
  org,
  user,
  isLiked,
  onTogglePreference,
}: {
  org: Organization;
  user: User | null;
  isLiked: boolean;
  onTogglePreference: () => void;
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        className="w-[45%] bg-white rounded-xl p-3 m-2"
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: org.logo }}
          className="w-full aspect-square rounded-lg bg-gray-100"
          resizeMode="contain"
        />
        <Text className="mt-2 text-left text-sm font-semibold text-gray-800">
          {org.name}
        </Text>
      </TouchableOpacity>

      <Modal
        isVisible={modalVisible}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        onBackdropPress={handleModalClose}
        onBackButtonPress={handleModalClose}
        style={{ margin: 0 }}
      >
        <View className="flex-1 bg-white p-6">
          <View
            className="flex-row items-center justify-start"
            style={{ paddingTop: 40, paddingBottom: 16 }}
          >
            <TouchableOpacity onPress={handleModalClose} className="p-2">
              <Ionicons name="arrow-back" size={28} color="#1A3B48" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingTop: 0 }}>
            <Image
              source={{ uri: org.logo }}
              style={{
                width: "100%",
                aspectRatio: 2 / 1,
                borderRadius: 12,
                backgroundColor: "#f0f0f0",
              }}
              resizeMode="cover"
            />

            <View className="flex-row justify-between items-center mt-6 w-full">
              <Text className="text-2xl font-bold text-left">{org.name}</Text>
              <TouchableOpacity
                onPress={onTogglePreference}
                className={`p-2 rounded-full ${
                  isLiked ? "bg-green-200" : "bg-gray-200 opacity-60"
                }`}
              >
                <Ionicons
                  name={isLiked ? "checkmark" : "add"}
                  size={30}
                  color={isLiked ? "#1F4A2C" : "#666666"}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => Linking.openURL(org.website)}>
              <Text
                className="text-base text-gray-700 mt-2"
                style={{ textAlign: "left" }}
              >
                {org.website}
              </Text>
            </TouchableOpacity>

            <Text
              className="text-base text-gray-700 mt-4"
              style={{ textAlign: "left" }}
            >
              {org.mission.trim() || "No mission statement available."}
            </Text>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}
