import { images } from "@/constants/images";
import { fetchPersonCredits, fetchPersonDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MovieCard from "@/components/MovieCard";
import TVShowCard from "@/components/TVShowCard";

const { width } = Dimensions.get("window");

export default function PersonDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"movies" | "tv">("movies");

  const { data: person, loading, error } = useFetch(
    () => fetchPersonDetails(id),
    true,
  );

  const { data: credits } = useFetch(() => fetchPersonCredits(id), true);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-primary">
        <ActivityIndicator
          size="large"
          color="#AB8BFF"
          className="mt-32 self-center"
        />
      </SafeAreaView>
    );
  }

  if (error || !person) {
    return (
      <SafeAreaView className="flex-1 bg-primary">
        <Text className="text-white text-center mt-32">
          Error loading person details
        </Text>
      </SafeAreaView>
    );
  }

  const movies = credits?.cast
    .filter((item: any) => item.media_type === "movie")
    .sort((a: any, b: any) => b.popularity - a.popularity)
    .slice(0, 12) || [];

  const tvShows = credits?.cast
    .filter((item: any) => item.media_type === "tv")
    .sort((a: any, b: any) => b.popularity - a.popularity)
    .slice(0, 12) || [];

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView className="flex-1 bg-primary" edges={["top"]}>
        <Image source={images.bg} className="w-full absolute z-0" />
        
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-12 left-5 z-10 bg-black/50 rounded-full p-2"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="items-center mt-10 px-5">
            {/* Profile Photo */}
            <Image
              source={{
                uri: person.profile_path
                  ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image",
              }}
              className="w-40 h-40 rounded-full"
              resizeMode="cover"
            />

            {/* Name and Department */}
            <Text className="text-white text-2xl font-bold mt-4 text-center">
              {person.name}
            </Text>
            <Text className="text-accent text-sm mt-1">
              {person.known_for_department}
            </Text>

            {/* Basic Info */}
            {(person.birthday || person.place_of_birth) && (
              <View className="mt-5 bg-gray-800/30 rounded-lg p-4 w-full">
                {person.birthday && (
                  <View className="mb-3">
                    <Text className="text-gray-400 text-xs">Born</Text>
                    <Text className="text-white text-sm mt-1">
                      {new Date(person.birthday).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      {person.deathday?.trim() && ` - ${new Date(person.deathday).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}`}
                    </Text>
                  </View>
                )}
                {person.place_of_birth && (
                  <View>
                    <Text className="text-gray-400 text-xs">Place of Birth</Text>
                    <Text className="text-white text-sm mt-1">
                      {person.place_of_birth}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Biography */}
            {person.biography && (
              <View className="mt-5 w-full">
                <Text className="text-white text-lg font-semibold mb-2">
                  Biography
                </Text>
                <Text className="text-gray-300 text-sm leading-6">
                  {person.biography}
                </Text>
              </View>
            )}

            {/* Known For */}
            {movies.length > 0 || tvShows.length > 0 ? (
              <View className="mt-5 w-full">
                <Text className="text-white text-lg font-semibold mb-3">
                  Known For
                </Text>

                {/* Tabs */}
                <View className="flex-row mb-4">
                  <TouchableOpacity
                    onPress={() => setActiveTab("movies")}
                    className={`px-4 py-2 rounded-l-lg ${
                      activeTab === "movies" ? "bg-accent" : "bg-gray-800/50"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        activeTab === "movies" ? "text-white" : "text-gray-400"
                      }`}
                    >
                      Movies ({movies.length})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setActiveTab("tv")}
                    className={`px-4 py-2 rounded-r-lg ${
                      activeTab === "tv" ? "bg-accent" : "bg-gray-800/50"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        activeTab === "tv" ? "text-white" : "text-gray-400"
                      }`}
                    >
                      TV Shows ({tvShows.length})
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Content */}
                {activeTab === "movies" && movies.length > 0 ? (
                  <FlatList
                    data={movies}
                    renderItem={({ item }) => <MovieCard {...item} />}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    columnWrapperStyle={{
                      justifyContent: "flex-start",
                      gap: 20,
                      paddingRight: 5,
                      marginBottom: 10,
                    }}
                    scrollEnabled={false}
                  />
                ) : null}

                {activeTab === "tv" && tvShows.length > 0 ? (
                  <FlatList
                    data={tvShows}
                    renderItem={({ item }) => <TVShowCard {...item} />}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    columnWrapperStyle={{
                      justifyContent: "flex-start",
                      gap: 20,
                      paddingRight: 5,
                      marginBottom: 10,
                    }}
                    scrollEnabled={false}
                  />
                ) : null}
              </View>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
