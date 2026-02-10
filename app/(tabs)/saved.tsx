import React, { useEffect, useState, useCallback } from "react";
import { StatusBar, Text, View, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "@/components/Loading";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalContext } from "@/context/GlobalContext";
import { getWatchlist } from "@/services/appwrite";
import MediaCard from "@/components/MediaCard";
import { useFocusEffect } from "expo-router";

const Saved = () => {
  const { user, isLogged, language } = useGlobalContext();
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWatchlist = async () => {
    if (isLogged && user) {
      try {
        const data = await getWatchlist(user.accountId);
        
        // Map Appwrite documents to MediaCard expected format
        const formattedData = data.map((doc: any) => ({
          id: parseInt(doc.mediaId),
          media_type: doc.mediaType,
          title: doc.mediaType === "movie" ? doc.title : undefined,
          name: doc.mediaType === "tv" ? doc.title : undefined,
          poster_path: doc.poster_path,
          vote_average: doc.vote_average,
          release_date: doc.mediaType === "movie" ? doc.release_date : undefined,
          first_air_date: doc.mediaType === "tv" ? doc.release_date : undefined,
        }));
        setWatchlist(formattedData);
      } catch (error) {
        console.error("Error in Saved tab:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    } else {
      setWatchlist([]);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWatchlist();
    }, [isLogged, user])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchWatchlist();
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView className="bg-primary flex-1 px-4">
        <View className="mt-6 mb-4">
            <Text className="text-2xl font-bold text-white">Watchlist</Text>
            <Text className="text-gray-500 text-sm mt-1">Your saved movies and TV shows</Text>
        </View>

        {loading ? (
            <Loading />
        ) : (
          <>
            {!isLogged ? (
                <View className="flex-1 justify-center items-center px-10">
                    <View className="bg-gray-800/30 p-6 rounded-full mb-6">
                        <Ionicons name="lock-closed-outline" size={48} color="#4B5563" />
                    </View>
                    <Text className="text-white text-xl font-bold text-center">Login Required</Text>
                    <Text className="text-gray-500 text-center mt-2">Sign in to start saving your favorite content.</Text>
                </View>
            ) : watchlist.length === 0 ? (
                <View className="flex-1 justify-center items-center px-10">
                    <View className="bg-gray-800/30 p-6 rounded-full mb-6">
                        <Ionicons name="bookmark-outline" size={48} color="#4B5563" />
                    </View>
                    <Text className="text-white text-xl font-bold text-center">Empty Watchlist</Text>
                    <Text className="text-gray-500 text-center mt-2">You haven't saved any movies or TV shows yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={watchlist}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    renderItem={({ item }) => (
                        <MediaCard item={item} showBookmark={true} />
                    )}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#AB8BFF" />
                    }
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
          </>
        )}
      </SafeAreaView>
    </>
  );
};

export default Saved;
