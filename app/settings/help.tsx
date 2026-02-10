import React from "react";
import { ScrollView, Text, TouchableOpacity, View, StatusBar, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const faqs = [
  {
    q: "How do I add a movie to my watchlist?",
    a: "Click on any movie to open its details, then tap the bookmark icon at the top right."
  },
  {
    q: "Can I change the streaming region?",
    a: "Yes! Go to Preferences -> Streaming Region to see where movies are available in your country."
  },
  {
    q: "Where does the data come from?",
    a: "All movie data and images are provided by The Movie Database (TMDB)."
  },
  {
    q: "Is MovieNest free?",
    a: "Yes, MovieNest is completely free to use for browsing and managing your watchlist."
  }
];

const Help = () => {
  const router = useRouter();

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1 bg-primary">
        <View className="px-4 py-6 flex-row items-center border-b border-gray-800">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Help Center</Text>
        </View>

        <ScrollView className="flex-1 px-4 mt-6">
          <Text className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-widest">
            Frequently Asked Questions
          </Text>
          <View className="bg-gray-800/50 rounded-2xl px-4 overflow-hidden mb-8">
            {faqs.map((faq, index) => (
              <View key={index} className={`py-4 ${index !== faqs.length - 1 ? "border-b border-gray-800/50" : ""}`}>
                <Text className="text-white font-bold text-base mb-2">{faq.q}</Text>
                <Text className="text-gray-400 text-sm leading-5">{faq.a}</Text>
              </View>
            ))}
          </View>

          <Text className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-widest">
            Contact Us
          </Text>
          <TouchableOpacity 
            onPress={() => Linking.openURL("mailto:support@movienest.com")}
            className="bg-gray-800/50 rounded-2xl px-4 py-4 mb-20 flex-row items-center"
          >
            <View className="bg-blue-500/20 p-2 rounded-lg mr-4">
              <Ionicons name="mail" size={20} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-base">Email Support</Text>
              <Text className="text-gray-500 text-xs mt-1">support@movienest.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#4B5563" />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Help;
