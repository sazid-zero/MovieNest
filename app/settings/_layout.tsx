import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#030014" },
        animation: "slide_from_right",
        animationDuration: 400,
      }}
    />
  );
}
