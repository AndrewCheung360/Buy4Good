import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SearchDrawerContent from '@/components/SearchDrawerContent';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <SearchDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerPosition: 'right',
          drawerType: 'slide',
          swipeEnabled: true,
        }}
      >
        <Drawer.Screen name="(tabs)" options={{ title: 'Main' }} />
        <Drawer.Screen name="webview" options={{ title: 'WebView' }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
