import { images } from "@/constants/images";
import {
  fetchTVCredits,
  fetchTVRecommendations,
  fetchTVShowDetails,
  fetchTVVideos,
  fetchWatchProviders,
} from "@/services/api";
import useFetch from "@/services/useFetch";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "@/components/Loading";
import { Ionicons } from "@expo/vector-icons";
import PersonCard from "@/components/PersonCard";
import MediaCard from "@/components/MediaCard";
import VideoPlayer from "@/components/VideoPlayer";
import { useGlobalContext } from "@/context/GlobalContext";
import { addToWatchlist, checkIsSaved, removeFromWatchlist } from "@/services/appwrite";

const { width } = Dimensions.get("window");

export default function TVShowDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { user, isLogged, language, region } = useGlobalContext();

  const { data: tvShow, loading, error } = useFetch(
    () => fetchTVShowDetails(id, language),
    true,
  );

  const { data: credits } = useFetch(() => fetchTVCredits(id), true);

  const { data: videos } = useFetch(() => fetchTVVideos(id), true);

  const { data: providers } = useFetch(() => fetchWatchProviders(id, "tv"), true);

  const { data: recommendations } = useFetch(
    () => fetchTVRecommendations(id),
    true,
  );
  const [isSaved, setIsSaved] = useState(false);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  useEffect(() => {
    const checkIfTVSaved = async () => {
      if (isLogged && user && id) {
        const savedDoc = await checkIsSaved(user.accountId, parseInt(id));
        if (savedDoc) {
          setIsSaved(true);
          setSavedDocId(savedDoc.$id);
        }
      }
    };
    checkIfTVSaved();
  }, [isLogged, user, id]);

  const handleToggleWatchlist = async () => {
    if (!isLogged) {
      router.push("/sign-in");
      return;
    }

    setWatchlistLoading(true);
    try {
      if (isSaved && savedDocId) {
        await removeFromWatchlist(savedDocId);
        setIsSaved(false);
        setSavedDocId(null);
      } else if (tvShow) {
        const item: any = {
           ...tvShow,
           media_type: 'tv',
           id: parseInt(id),
        };
        const newDoc = await addToWatchlist(item);
        if (newDoc) {
          setIsSaved(true);
          setSavedDocId(newDoc.$id);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update watchlist");
    } finally {
      setWatchlistLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-primary">
        <Loading />
      </View>
    );
  }

  if (error || !tvShow) {
    return (
      <SafeAreaView className="flex-1 bg-primary">
        <Text className="text-white text-center mt-32">
          Error loading TV show details
        </Text>
      </SafeAreaView>
    );
  }

  const mainCast = credits?.cast.slice(0, 10) || [];

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
          {/* Backdrop Image */}
          <View className="relative">
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${tvShow.backdrop_path}`,
              }}
              style={{ width, height: 250 }}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "#030014"]}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 100,
              }}
            />
          </View>

          <View className="px-5">
            {/* Title and Info */}
            <View className="flex-row justify-between items-start mt-4">
              <View className="flex-1 mr-4">
                <Text className="text-white text-2xl font-bold">
                  {tvShow.name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleToggleWatchlist}
                disabled={watchlistLoading}
                className={`p-3 rounded-xl border ${isSaved ? 'bg-accent border-accent' : 'bg-transparent border-gray-700'}`}
              >
                {watchlistLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons 
                    name={isSaved ? "bookmark" : "bookmark-outline"} 
                    size={24} 
                    color="white" 
                  />
                )}
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center mt-2 flex-wrap">
              <Text className="text-yellow-400 text-sm mr-3">
                ⭐ {tvShow.vote_average.toFixed(1)}
              </Text>
              {tvShow.first_air_date && (
                <Text className="text-gray-400 text-sm mr-3">
                  {new Date(tvShow.first_air_date).getFullYear()}
                </Text>
              )}
              {(tvShow.number_of_seasons ?? 0) > 0 ? (
                <Text className="text-gray-400 text-sm mr-3">
                  {tvShow.number_of_seasons} Season{tvShow.number_of_seasons !== 1 ? "s" : ""}
                </Text>
              ) : null}
              <Text className="text-gray-400 text-sm">{tvShow.status}</Text>
            </View>

            {/* Genres */}
            {tvShow.genres && tvShow.genres.length > 0 ? (
              <View className="flex-row flex-wrap mt-3">
                {tvShow.genres.map((genre) => (
                  <View
                    key={genre.id}
                    className="bg-accent/20 rounded-full px-3 py-1 mr-2 mb-2"
                  >
                    <Text className="text-accent text-xs">{genre.name}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {/* Tagline */}
            {tvShow.tagline && (
              <Text className="text-gray-400 italic text-sm mt-3">
                {`"${tvShow.tagline}"`}
              </Text>
            )}

            {/* Overview */}
            <Text className="text-white text-base font-semibold mt-5">
              Overview
            </Text>
            <Text className="text-gray-300 text-sm mt-2 leading-6">
              {tvShow.overview}
            </Text>

            {/* Additional Info */}
            <View className="mt-5 bg-gray-800/30 rounded-lg p-4">
              {tvShow.created_by && tvShow.created_by.length > 0 ? (
                <View className="mb-3">
                  <Text className="text-gray-400 text-xs">Created By</Text>
                  <Text className="text-white text-sm mt-1">
                    {tvShow.created_by.map((c) => c.name).join(", ")}
                  </Text>
                </View>
              ) : null}
              <View className="mb-3">
                <Text className="text-gray-400 text-xs">Episodes</Text>
                <Text className="text-white text-sm mt-1">
                  {tvShow.number_of_episodes} episodes
                </Text>
              </View>
              {tvShow.networks && tvShow.networks.length > 0 ? (
                <View>
                  <Text className="text-gray-400 text-xs">Networks</Text>
                  <Text className="text-white text-sm mt-1">
                    {tvShow.networks.map((n) => n.name).join(", ")}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Streaming Providers */}
            {providers && providers[region] ? (
              <View className="mt-5">
                <Text className="text-white text-lg font-semibold mb-3">
                  Where to Watch ({region})
                </Text>
                <View className="flex-row flex-wrap">
                  {providers[region].flatrate ? (
                     providers[region].flatrate.map((p: any) => (
                       <View key={p.provider_id} className="mr-4 mb-3 items-center">
                         <Image 
                           source={{ uri: `https://image.tmdb.org/t/p/w92${p.logo_path}` }}
                           className="w-12 h-12 rounded-xl"
                         />
                         <Text className="text-gray-400 text-[10px] mt-1">{p.provider_name}</Text>
                       </View>
                     ))
                  ) : (
                    <Text className="text-gray-500 text-sm">Not available for streaming in your region.</Text>
                  )}
                </View>
                {providers[region].buy && (
                   <Text className="text-gray-500 text-[10px] italic mt-2">
                     Available to buy/rent on: {providers[region].buy.map((b: any) => b.provider_name).join(", ")}
                   </Text>
                )}
              </View>
            ) : null}

            {/* Videos/Trailers */}
            {videos && videos.length > 0 ? <VideoPlayer videos={videos} /> : null}

            {/* Cast */}
            {mainCast.length > 0 ? (
              <View className="mt-5">
                <Text className="text-white text-lg font-semibold mb-3">
                  Cast
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {mainCast.map((actor) => (
                    <PersonCard
                      key={actor.id}
                      person={{
                        id: actor.id,
                        name: actor.name,
                        profile_path: actor.profile_path,
                        known_for_department: actor.character,
                        popularity: 0,
                      }}
                    />
                  ))}
                </ScrollView>
              </View>
            ) : null}

            {/* Recommendations */}
            {recommendations && recommendations.length > 0 ? (
              <View className="mt-5">
                <Text className="text-white text-lg font-semibold mb-3">
                  You May Also Like
                </Text>
                <FlatList
                  data={recommendations.slice(0, 6)}
                  renderItem={({ item }) => <MediaCard item={{...item, media_type: 'tv'}} />}
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
              </View>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
