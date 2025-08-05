import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useAuth } from "@/context/auth";
import { useRouter, usePathname } from "expo-router";

export default function PostSignInHandler() {
  const { supabaseUser, checkPlaidConnection } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handlePostSignIn = async () => {
      if (!supabaseUser) {
        return;
      }
      if (pathname && pathname.startsWith("/(tabs)")) {
        return;
      }

      router.replace("/(tabs)/dashboard");
    };

    if (supabaseUser) {
      handlePostSignIn();
    }
  }, [supabaseUser, checkPlaidConnection, router, pathname]);

  return null;
}
