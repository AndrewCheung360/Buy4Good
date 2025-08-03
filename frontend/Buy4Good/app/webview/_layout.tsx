import { Stack } from 'expo-router';

export default function WebViewLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        gestureEnabled: true,
        gestureDirection: 'vertical',
      }}
    >
      <Stack.Screen 
        name="[merchant]" 
        options={{
          title: 'Merchant',
          presentation: 'modal',
          animation: 'slide_from_bottom',
          gestureEnabled: true,
          gestureDirection: 'vertical',
        }} 
      />
    </Stack>
  );
}
