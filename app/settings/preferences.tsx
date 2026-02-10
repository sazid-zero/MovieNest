import React from "react";
import { ScrollView, Text, TouchableOpacity, View, Switch, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useGlobalContext } from "@/context/GlobalContext";

const languages = [
  { label: "English", value: "en-US" },
  { label: "Spanish", value: "es-ES" },
  { label: "French", value: "fr-FR" },
  { label: "German", value: "de-DE" },
  { label: "Italian", value: "it-IT" },
  { label: "Japanese", value: "ja-JP" },
  { label: "Korean", value: "ko-KR" },
  { label: "Hindi", value: "hi-IN" },
];

const regions = [
  { label: "United States", value: "US" },
  { label: "United Kingdom", value: "GB" },
  { label: "Canada", value: "CA" },
  { label: "Australia", value: "AU" },
  { label: "India", value: "IN" },
  { label: "Germany", value: "DE" },
  { label: "Spain", value: "ES" },
  { label: "France", value: "FR" },
];

const Preferences = () => {
  const router = useRouter();
  const { 
    language, 
    setLanguage, 
    region, 
    setRegion, 
    includeAdult, 
    setIncludeAdult 
  } = useGlobalContext();

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1 bg-primary">
        <View className="px-4 py-6 flex-row items-center border-b border-gray-800">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Preferences</Text>
        </View>

        <ScrollView className="flex-1 px-4 mt-6">
          <Text className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-widest">
            Content Language
          </Text>
          <View className="bg-gray-800/50 rounded-2xl overflow-hidden px-2">
            {languages.map((lang, index) => (
              <TouchableOpacity
                key={lang.value}
                onPress={() => setLanguage(lang.value)}
                className={`flex-row items-center py-4 px-2 ${
                  index !== languages.length - 1 ? "border-b border-gray-800/50" : ""
                }`}
              >
                <Text className="text-white text-base flex-1">{lang.label}</Text>
                {language === lang.value && (
                  <Ionicons name="checkmark-circle" size={20} color="#AB8BFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-gray-400 text-sm font-semibold mt-8 mb-4 uppercase tracking-widest">
            Streaming Region
          </Text>
          <View className="bg-gray-800/50 rounded-2xl overflow-hidden px-2 mb-8">
            {regions.map((reg, index) => (
              <TouchableOpacity
                key={reg.value}
                onPress={() => setRegion(reg.value)}
                className={`flex-row items-center py-4 px-2 ${
                  index !== regions.length - 1 ? "border-b border-gray-800/50" : ""
                }`}
              >
                <Text className="text-white text-base flex-1">{reg.label}</Text>
                {region === reg.value && (
                  <Ionicons name="checkmark-circle" size={20} color="#AB8BFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-widest">
            Filtering
          </Text>
          <View className="bg-gray-800/50 rounded-2xl px-4 py-4 mb-20 flex-row items-center">
            <View className="flex-1">
              <Text className="text-white text-base">Include Adult Content</Text>
              <Text className="text-gray-500 text-xs mt-1">Show R-rated and mature content</Text>
            </View>
            <Switch
              value={includeAdult}
              onValueChange={setIncludeAdult}
              trackColor={{ false: "#374151", true: "#AB8BFF" }}
              thumbColor={includeAdult ? "#fff" : "#9ca3af"}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Preferences;
