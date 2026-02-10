import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Switch, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Notifications = () => {
  const router = useRouter();
  const [prefs, setPrefs] = useState({
    releases: true,
    watchlist: true,
    recommendations: false,
    marketing: false,
  });

  const toggle = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1 bg-primary">
        <View className="px-4 py-6 flex-row items-center border-b border-gray-800">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Notifications</Text>
        </View>

        <ScrollView className="flex-1 px-4 mt-6">
          <Text className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-widest">
            App Alerts
          </Text>
          <View className="bg-gray-800/50 rounded-2xl px-4 overflow-hidden mb-8">
            <View className="flex-row items-center py-4 border-b border-gray-800/50">
              <View className="flex-1">
                <Text className="text-white text-base">New Releases</Text>
                <Text className="text-gray-500 text-xs mt-1">Notify me when movies I like are released</Text>
              </View>
              <Switch
                value={prefs.releases}
                onValueChange={() => toggle('releases')}
                trackColor={{ false: "#374151", true: "#AB8BFF" }}
                thumbColor={prefs.releases ? "#fff" : "#9ca3af"}
              />
            </View>

            <View className="flex-row items-center py-4 border-b border-gray-800/50">
              <View className="flex-1">
                <Text className="text-white text-base">Watchlist Reminders</Text>
                <Text className="text-gray-500 text-xs mt-1">Alerts for items in my watchlist</Text>
              </View>
              <Switch
                value={prefs.watchlist}
                onValueChange={() => toggle('watchlist')}
                trackColor={{ false: "#374151", true: "#AB8BFF" }}
                thumbColor={prefs.watchlist ? "#fff" : "#9ca3af"}
              />
            </View>

            <View className="flex-row items-center py-4">
              <View className="flex-1">
                <Text className="text-white text-base">AI Recommendations</Text>
                <Text className="text-gray-500 text-xs mt-1">Daily deals and discovery alerts</Text>
              </View>
              <Switch
                value={prefs.recommendations}
                onValueChange={() => toggle('recommendations')}
                trackColor={{ false: "#374151", true: "#AB8BFF" }}
                thumbColor={prefs.recommendations ? "#fff" : "#9ca3af"}
              />
            </View>
          </View>

          <Text className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-widest">
            Other
          </Text>
          <View className="bg-gray-800/50 rounded-2xl px-4 overflow-hidden">
            <View className="flex-row items-center py-4">
              <View className="flex-1">
                <Text className="text-white text-base">Marketing Emails</Text>
                <Text className="text-gray-500 text-xs mt-1">News and special offers</Text>
              </View>
              <Switch
                value={prefs.marketing}
                onValueChange={() => toggle('marketing')}
                trackColor={{ false: "#374151", true: "#AB8BFF" }}
                thumbColor={prefs.marketing ? "#fff" : "#9ca3af"}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Notifications;
