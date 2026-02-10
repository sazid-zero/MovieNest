import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GlobalProvider } from "../context/GlobalContext";
import "./globals.css";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

import CustomSplashScreen from "@/components/CustomSplashScreen";

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load necessary assets or check session here if needed
        await SystemUI.setBackgroundColorAsync("#030014");
        // Hide native splash immediately to show custom one
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (!appIsReady) {
    return null;
  }

  return (
    <GlobalProvider>
      <SafeAreaProvider>
        {showSplash ? (
          <CustomSplashScreen onFinish={handleSplashFinish} />
        ) : (
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#030014" },
              animation: "slide_from_right",
              animationDuration: 300,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="tv/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="person/[id]" options={{ headerShown: false }} />
          </Stack>
        )}
      </SafeAreaProvider>
    </GlobalProvider>
  );
}
