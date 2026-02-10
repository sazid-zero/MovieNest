import React from "react";
import { ScrollView, Text, TouchableOpacity, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { icons } from "@/constants/icons";

const About = () => {
  const router = useRouter();

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1 bg-primary">
        <View className="px-4 py-6 flex-row items-center border-b border-gray-800">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">About MovieNest</Text>
        </View>

        <ScrollView 
          className="flex-1 px-4 mt-6"
          contentContainerStyle={{ alignItems: "center" }}
        >
          <View className="bg-accent/20 p-6 rounded-3xl mt-10 mb-6">
            <Ionicons name="film" size={80} color="#AB8BFF" />
          </View>
          
          <Text className="text-white text-3xl font-bold">MovieNest</Text>
          <Text className="text-gray-500 text-sm mt-2">Version 1.0.0 (Gold)</Text>

          <View className="bg-gray-800/50 rounded-2xl p-6 w-full mt-10">
            <Text className="text-gray-300 text-center leading-6">
              MovieNest is your ultimate companion for discovering and tracking
              the movies and TV shows you love. Built with passion for movie
              enthusiasts worldwide.
            </Text>
          </View>

          <View className="w-full mt-10 px-4 items-center">
             <Text className="text-gray-500 text-xs text-center uppercase tracking-widest mb-4">
              Powered By
            </Text>
            <View className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <Image 
                source={icons.tmdb}
                style={{ width: 140, height: 40 }}
                contentFit="contain"
                tintColor="#01b4e4" // TMDB blue
              />
            </View>
            <Text className="text-gray-600 text-[10px] text-center mt-4">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </Text>
          </View>

          <View className="w-full mt-10 mb-10">
            <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-800/50">
              <Text className="text-gray-300 text-base flex-1">Terms of Service</Text>
              <Ionicons name="chevron-forward" size={20} color="#4B5563" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center py-4">
              <Text className="text-gray-300 text-base flex-1">Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default About;
