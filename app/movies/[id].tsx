import React, { useState, useEffect } from "react";
import { ScrollView, StatusBar, Text, Image,
  ActivityIndicator, TouchableOpacity,
  View, FlatList, Dimensions, Alert} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "@/components/Loading";
import { useLocalSearchParams, useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import useFetch from "@/services/useFetch";
import { fetchMovieDetails, fetchMovieCredits, fetchMovieVideos, fetchMovieRecommendations, fetchWatchProviders } from "@/services/api";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import PersonCard from "@/components/PersonCard";
import MediaCard from "@/components/MediaCard";
import VideoPlayer from "@/components/VideoPlayer";
import { useGlobalContext } from "@/context/GlobalContext";
import { addToWatchlist, checkIsSaved, removeFromWatchlist } from "@/services/appwrite";

const { width } = Dimensions.get("window");

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);


const MovieDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user, isLogged, language, region } = useGlobalContext();

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string, language),
    true,
  );

  const { data: credits } = useFetch(() => fetchMovieCredits(id as string), true);

  const { data: videos } = useFetch(() => fetchMovieVideos(id as string), true);

  const { data: providers } = useFetch(() => fetchWatchProviders(id as string, "movie"), true);

  const { data: recommendations } = useFetch(
    () => fetchMovieRecommendations(id as string),
    true,
  );

  const [isSaved, setIsSaved] = useState(false);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  useEffect(() => {
    const checkIfMovieSaved = async () => {
      if (isLogged && user && id) {
        const savedDoc = await checkIsSaved(user.accountId, parseInt(id as string));
        if (savedDoc) {
          setIsSaved(true);
          setSavedDocId(savedDoc.$id);
        }
      }
    };
    checkIfMovieSaved();
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
      } else if (movie) {
        const item: any = {
           ...movie,
           media_type: 'movie',
           id: parseInt(id as string),
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

  if (!movie) {
    return (
      <SafeAreaView className="flex-1 bg-primary">
        <Text className="text-white text-center mt-32">
          Error loading movie details
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
                uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
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
                  {movie.title}
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
                ⭐ {movie.vote_average.toFixed(1)}
              </Text>
              {movie.release_date && (
                <Text className="text-gray-400 text-sm mr-3">
                  {new Date(movie.release_date).getFullYear()}
                </Text>
              )}
              {(movie.runtime ?? 0) > 0 ? (
                <Text className="text-gray-400 text-sm">{movie.runtime}m</Text>
              ) : null}
            </View>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 ? (
              <View className="flex-row flex-wrap mt-3">
                {movie.genres.map((genre) => (
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
            {movie.tagline && (
              <Text className="text-gray-400 italic text-sm mt-3">
                {`"${movie.tagline}"`}
              </Text>
            )}

            {/* Overview */}
            <Text className="text-white text-base font-semibold mt-5">
              Overview
            </Text>
            <Text className="text-gray-300 text-sm mt-2 leading-6">
              {movie.overview}
            </Text>

            {/* Additional Info */}
            <View className="mt-5 bg-gray-800/30 rounded-lg p-4">
              <View className="mb-3">
                <Text className="text-gray-400 text-xs">Budget</Text>
                <Text className="text-white text-sm mt-1">
                  ${(movie.budget / 1_000_000).toFixed(1)}M
                </Text>
              </View>
              <View className="mb-3">
                <Text className="text-gray-400 text-xs">Revenue</Text>
                <Text className="text-white text-sm mt-1">
                  ${(movie.revenue / 1_000_000).toFixed(1)}M
                </Text>
              </View>
              {movie.production_companies && movie.production_companies.length > 0 ? (
                <View>
                  <Text className="text-gray-400 text-xs">Production Companies</Text>
                  <Text className="text-white text-sm mt-1">
                    {movie.production_companies.map((c) => c.name).join(", ")}
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
                       <View key={p.provider_id} className="mr-3 mb-3 items-center">
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
                   <Text className="text-gray-500 text-xs italic mt-2">
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
                  renderItem={({ item }) => <MediaCard item={{...item, media_type: 'movie'}} />}
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
};

export default MovieDetails;
