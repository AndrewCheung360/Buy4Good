import { Stack } from 'expo-router';

export default function WebViewLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'vertical',
      }}
    >
      <Stack.Screen name="[merchant]" />
    </Stack>
  );
}
