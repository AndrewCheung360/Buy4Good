import { Stack } from 'expo-router';

export default function MerchantsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[category]" />
    </Stack>
  );
}