import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons'; // Make sure you have this import
import { User } from "@supabase/supabase-js";
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

export type Organization = {
  id: string;
  name: string;
  logo: string;
  website: string;
  mission: string;

};

export default function OrganizationCard({ org }: { org: Organization }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error('Failed to fetch user:', error.message);
      } else {
        setUser(user);
      }
    };

    fetchUser();
  }, []);

  // Function to fetch preference state
  const fetchPreference = async (userId: string, charityId: string) => {
    const { data: preference, error } = await supabase
      .from('user_charity_preferences')
      .select('id')
      .eq('user_id', userId)
      .eq('charity_id', charityId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Failed to fetch preference:', error.message);
      setIsLiked(false);
    } else if (preference) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  };

  useEffect(() => {
    if (user && modalVisible) {
      fetchPreference(user.id, org.id);
    } else {
      setIsLiked(false);
    }
  }, [user, org.id, modalVisible]);


  const handleAddPreference = async () => {
    if (!user) return;

    if (isLiked) {
      // Remove preference
      const { error } = await supabase
        .from('user_charity_preferences')
        .delete()
        .eq('user_id', user.id)
        .eq('charity_id', org.id);

      if (error) {
        console.error('Failed to remove preference:', error.message);
      } else {
        await fetchPreference(user.id, org.id); // Refresh like state after deletion
      }
    } else {
      // Add preference
      const { error } = await supabase
        .from('user_charity_preferences')
        .insert([
          {
            user_id: user.id,
            charity_id: org.id,
            allocation_percentage: 0,
          },
        ]);

      // also update list of charities liked by user in user table

      if (error) {
        console.error('Insert error:', error.message);
      } else {
        await fetchPreference(user.id, org.id); // Refresh like state after insertion
      }
    }
  };


  // Optionally reset isLiked when modal closes, so when reopened it refetches fresh data
  const handleModalClose = () => {
    setModalVisible(false);
    setIsLiked(false); // Reset state to trigger fresh fetch on modal open if you want
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
          <View className="flex-row items-center justify-start" style={{ paddingTop: 40, paddingBottom: 16 }}>
            <TouchableOpacity onPress={handleModalClose} className="p-2">
              <Ionicons name="arrow-back" size={28} color="#1A3B48" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 0 }}>
            <Image
              source={{ uri: org.logo }}
              style={{ width: '100%', aspectRatio: 2 / 1, borderRadius: 12, backgroundColor: '#f0f0f0' }}
              resizeMode="cover"
            />
            <View className="flex-row justify-between items-center mt-6 mb-4 w-full">
              <Text className="text-2xl font-bold text-left">
                {org.name}
              </Text>
              <TouchableOpacity onPress={handleAddPreference} className="p-2 rounded-full bg-white">
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={20}
                  color={isLiked ? "#e0245e" : "#1F4A2C"}
                />
              </TouchableOpacity>
            </View>


            <Text className="text-base text-gray-700 text-left" style={{ alignSelf: 'stretch' }}>
              {org.mission.trim() || 'No mission statement available.'}
            </Text>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}
