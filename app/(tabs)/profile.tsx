import { useRouter, Redirect } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import { useGlobalContext } from "@/context/GlobalContext";
import { signOut, uploadAvatar } from "@/services/appwrite";
import { images } from "@/constants/images";

const Profile = () => {
  const { user, setUser, setIsLogged, isLogged, refetchUser } = useGlobalContext();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setUploading(true);
      try {
        const file = {
            name: result.assets[0].fileName || 'avatar.jpg',
            type: result.assets[0].mimeType || 'image/jpeg',
            size: result.assets[0].fileSize,
            uri: result.assets[0].uri,
        };

        const avatarUrl = await uploadAvatar(file);
        if (avatarUrl) {
            // Update local state immediately to avoid waiting for refetch
            setUser({ ...user, avatar: avatarUrl });
            await refetchUser();
            Alert.alert("Success", "Profile picture updated successfully!");
        }
      } catch (error: any) {
        Alert.alert("Error", error.message || "Failed to upload image");
      } finally {
        setUploading(false);
      }
    }
  };

  const logout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out of MovieNest?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            await signOut();
            setUser(null);
            setIsLogged(false);
          }
        }
      ]
    );
  };

  if (!isLogged) {
    return (
      <>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <SafeAreaView className="flex-1 bg-primary" edges={["top"]}>
          <Image
            source={images.bg}
            className="w-full absolute z-0 h-full"
            resizeMode="cover"
          />

          <ScrollView 
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            showsVerticalScrollIndicator={false}
          >
            <View className="px-4 items-center">
              <View className="bg-gray-800/50 rounded-3xl p-8 border border-gray-700/50 items-center w-full">
                <View className="bg-accent/20 p-4 rounded-full mb-6">
                  <Ionicons name="person-outline" size={48} color="#AB8BFF" />
                </View>

                <Text className="text-white text-2xl font-bold text-center">
                  Welcome to MovieNest
                </Text>

                <Text className="text-gray-400 text-center mt-4 text-base leading-6">
                  Sign in to sync your watchlist, receive personalized
                  recommendations, and access your profile from any device.
                </Text>

                <TouchableOpacity
                  onPress={() => router.push("/sign-in")}
                  activeOpacity={0.8}
                  className="bg-accent w-full py-4 rounded-xl mt-8 flex-row justify-center items-center"
                >
                  <Text className="text-white font-bold text-lg mr-2">
                    Sign In / Sign Up
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>
              </View>

              <Text className="text-gray-500 mt-8 text-sm">
                Explore thousands of movies and TV shows for free.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView className="flex-1 bg-primary" edges={["top"]}>
        <Image source={images.bg} className="w-full absolute z-0 h-full" resizeMode="cover" />
        
        <ScrollView 
          className="flex-1 px-4 mt-6"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row justify-between items-center mb-10">
            <Text className="text-2xl font-bold text-white">Profile</Text>
            <TouchableOpacity onPress={logout}>
               <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
            </TouchableOpacity>
          </View>

          {/* User Info Card */}
          <View className="bg-gray-800/50 rounded-3xl p-6 border border-gray-700/50 items-center">
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleImagePick}
              disabled={uploading}
              className="relative"
            >
              <View className="w-24 h-24 rounded-full border-2 border-accent overflow-hidden bg-gray-700 items-center justify-center">
                {uploading ? (
                   <ActivityIndicator color="#AB8BFF" />
                ) : user?.avatar ? (
                  <Image
                    source={{ 
                      uri: user.avatar.includes('?') 
                        ? `${user.avatar}&t=${new Date().getTime()}` 
                        : `${user.avatar}?t=${new Date().getTime()}` 
                    }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="person" size={40} color="#6B7280" />
                )}
              </View>
              {!uploading && (
                <View className="absolute bottom-0 right-0 bg-accent p-1.5 rounded-full border-2 border-gray-800">
                  <Ionicons name="camera" size={12} color="white" />
                </View>
              )}
            </TouchableOpacity>
            
            <Text className="text-white text-xl font-bold mt-4">
              {user?.username || "Movie Enthusiast"}
            </Text>
            <Text className="text-gray-400 text-sm mt-1">
              {user?.email}
            </Text>
          </View>

          {/* Stats/Settings Section */}
          <View className="mt-10">
            <Text className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-widest">
              Account Settings
            </Text>
            
            <TouchableOpacity 
              onPress={() => router.push("/saved")}
              className="flex-row items-center border-b border-gray-800/50 py-4"
            >
              <View className="bg-blue-500/20 p-2 rounded-lg mr-4">
                <Ionicons name="bookmark-outline" size={20} color="#3B82F6" />
              </View>
              <Text className="text-white text-base flex-1">My Watchlist</Text>
              <Ionicons name="chevron-forward" size={20} color="#4B5563" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push("/settings/notifications")}
              className="flex-row items-center border-b border-gray-800/50 py-4"
            >
              <View className="bg-green-500/20 p-2 rounded-lg mr-4">
                <Ionicons name="notifications-outline" size={20} color="#10B981" />
              </View>
              <Text className="text-white text-base flex-1">Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color="#4B5563" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push("/settings/preferences")}
              className="flex-row items-center py-4"
            >
              <View className="bg-purple-500/20 p-2 rounded-lg mr-4">
                <Ionicons name="settings-outline" size={20} color="#8B5CF6" />
              </View>
              <Text className="text-white text-base flex-1">Preferences</Text>
              <Ionicons name="chevron-forward" size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>

          <View className="mt-5 mb-20">
             <Text className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-widest">
              Support
            </Text>
            <TouchableOpacity 
              onPress={() => router.push("/settings/help")}
              className="flex-row items-center border-b border-gray-800/50 py-4"
            >
              <View className="bg-gray-500/20 p-2 rounded-lg mr-4">
                <Ionicons name="help-circle-outline" size={20} color="#9CA3AF" />
              </View>
              <Text className="text-white text-base flex-1">Help Center</Text>
              <Ionicons name="chevron-forward" size={20} color="#4B5563" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push("/settings/about")}
              className="flex-row items-center py-4"
            >
              <View className="bg-gray-500/20 p-2 rounded-lg mr-4">
                <Ionicons name="information-circle-outline" size={20} color="#9CA3AF" />
              </View>
              <Text className="text-white text-base flex-1">About MovieNest</Text>
              <Ionicons name="chevron-forward" size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Profile;
