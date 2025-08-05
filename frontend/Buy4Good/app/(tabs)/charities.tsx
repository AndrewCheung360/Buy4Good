import { EXPO_PUBLIC_PLEDGE_API_TOKEN } from "@/constants";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import OrganizationCard from "../components/OrganizationCard";
import { useDataRefresh } from "@/context/dataRefresh";

const API_BASE = "https://api.pledge.to/v1";

// Import the Organization type if it's exported from OrganizationCard or define it here
import type { Organization } from "@/app/components/OrganizationCard";
import { supabase } from "@/utils/supabase";
import { User } from "@supabase/supabase-js";

export default function CharityScreen() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCauses, setSelectedCauses] = useState<number[]>([]);
  const [causes, setCauses] = useState<{ id: number; name: string }[]>([]);

  const [user, setUser] = useState<User | null>(null);

  const [preferences, setPreferences] = useState<Record<string, boolean>>({});
  const { markDataChanged } = useDataRefresh();

  const fetchPreferences = async (userId: string, charityIds: string[]) => {
    if (!userId || charityIds.length === 0) {
      setPreferences({});
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_charity_preferences")
        .select("charity_id")
        .eq("user_id", userId)
        .in("charity_id", charityIds);

      if (error) {
        console.error("Failed to fetch preferences:", error.message);
        setPreferences({});
      } else {
        const prefsMap: Record<string, boolean> = {};
        data.forEach((pref: any) => {
          prefsMap[pref.charity_id] = true;
        });
        setPreferences(prefsMap);
      }
    } catch (err) {
      console.error("Error fetching preferences:", err);
      setPreferences({});
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Failed to fetch user:", error.message);
      } else {
        setUser(user);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCauses = async () => {
      const { data: charity_causes, error } = await supabase
        .from("charity_causes")
        .select("*");

      if (error) {
        console.error("Supabase fetch error:", error.message);
      } else {
        setCauses(charity_causes || []);
      }
    };

    fetchCauses();
  }, []);

  useEffect(() => {
    fetchOrgs();
  }, [selectedCauses]);

  const buildUrl = () => {
    if (selectedCauses.length === 0)
      return "https://api.pledge.to/v1/organizations";
    return `https://api.pledge.to/v1/organizations?${selectedCauses
      .map((id) => `cause_id=${id}`)
      .join("&")}`;
  };

  const fetchOrgs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(buildUrl(), {
        headers: {
          Authorization: `Bearer ${EXPO_PUBLIC_PLEDGE_API_TOKEN}`,
        },
      });
      const data = await response.json();

      if (data.results) {
        const orgsData = data.results.map((org: any) => ({
          id: org.id?.toString() || org.name,
          name: org.name,
          logo: org.logo_url || org.logo || "",
          website: org.website_url || org.website || "",
          mission: org.mission || "",
        }));
        setOrgs(orgsData);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch {
      setError("Failed to load organizations.");
      setOrgs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && orgs.length > 0) {
      fetchPreferences(
        user.id,
        orgs.map((o) => o.id)
      );
    } else {
      setPreferences({});
    }
  }, [user, orgs]);

  const toggleCause = (causeId: number) => {
    if (selectedCauses.includes(causeId)) {
      setSelectedCauses(selectedCauses.filter((id) => id !== causeId));
    } else {
      setSelectedCauses([...selectedCauses, causeId]);
    }
  };

  const togglePreference = async (charityId: string) => {
    if (!user) return;

    const liked = preferences[charityId];

    if (liked) {
      // Remove preference
      const { error } = await supabase
        .from("user_charity_preferences")
        .delete()
        .eq("user_id", user.id)
        .eq("charity_id", charityId);

      if (error) {
        console.error("Failed to remove preference:", error.message);
        return;
      }

      // Remove from users table charities array
      const { data: currentUser } = await supabase
        .from("users")
        .select("charities")
        .eq("id", user.id)
        .single();

      if (currentUser && currentUser.charities) {
        const updatedCharities = currentUser.charities.filter(
          (id: string) => id !== charityId
        );

        const { error: updateError } = await supabase
          .from("users")
          .update({ charities: updatedCharities })
          .eq("id", user.id);

        if (updateError) {
          console.error(
            "Failed to update user charities:",
            updateError.message
          );
        }
      }
    } else {
      // Check if user already has 5 liked charities
      const likedCharitiesCount =
        Object.values(preferences).filter(Boolean).length;
      if (likedCharitiesCount >= 5) {
        Alert.alert(
          "Maximum Charities Reached",
          "You can only like up to 5 charities. Please unlike one before adding another.",
          [{ text: "OK" }]
        );
        return;
      }

      // Add preference
      const { error } = await supabase
        .from("user_charity_preferences")
        .insert([
          { user_id: user.id, charity_id: charityId, allocation_percentage: 0 },
        ]);

      if (error) {
        console.error("Failed to add preference:", error.message);
        return;
      }

      // Add to users table charities array
      const { data: currentUser } = await supabase
        .from("users")
        .select("charities")
        .eq("id", user.id)
        .single();

      let updatedCharities = [charityId];
      if (currentUser && currentUser.charities) {
        updatedCharities = [...currentUser.charities, charityId];
      }

      const { error: updateError } = await supabase
        .from("users")
        .update({ charities: updatedCharities })
        .eq("id", user.id);

      if (updateError) {
        console.error("Failed to update user charities:", updateError.message);
      }
    }

    // Mark that data has changed
    markDataChanged();

    // Update local state
    setPreferences((prev) => ({
      ...prev,
      [charityId]: !liked,
    }));
  };

  const clearFilters = () => setSelectedCauses([]);

  return (
    <SafeAreaView className="flex-1 bg-white p-1">
      <View style={{ paddingTop: 70 }}>
        <Text className="text-3xl font-bold text-[#1a1a1a] px-6">
          Charities
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 1 }}
          className="px-4 pt-4"
        >
          <TouchableOpacity
            className={`rounded-lg mx-2 h-10 px-2 justify-center items-center ${
              selectedCauses.length === 0
                ? "bg-gray-200"
                : "bg-white border border-gray-300"
            }`}
            onPress={clearFilters}
          >
            <Text className="text-gray-900 font-medium">All</Text>
          </TouchableOpacity>

          {causes.map((cause) => {
            const isSelected = selectedCauses.includes(cause.id);
            return (
              <TouchableOpacity
                key={cause.id}
                className={`rounded-lg mx-2 h-10 px-4 justify-center items-center ${
                  isSelected ? "bg-gray-200" : "bg-white border border-gray-300"
                }`}
                onPress={() => toggleCause(cause.id)}
              >
                <Text className="text-gray-900 font-medium">
                  {cause.name.trim()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading && (
        <View className="flex-1 justify-center items-center mt-10">
          <ActivityIndicator size="large" color="#1a1a1a" />
        </View>
      )}

      {error && <Text className="text-red-600 text-center mt-4">{error}</Text>}

      {!loading && !error && (
        <FlatList
          data={orgs}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <OrganizationCard
              org={item}
              user={user}
              isLiked={!!preferences[item.id]}
              onTogglePreference={() => togglePreference(item.id)}
            />
          )}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 8 }}
        />
      )}
    </SafeAreaView>
  );
}
