import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import MediaCard from "@/components/MediaCard";
import TVShowCard from "@/components/TVShowCard";
import { images } from "@/constants/images";
import { fetchMovies, fetchTrending, fetchPopularTVShows, fetchMultiSearch } from "@/services/api";
import { getTrendingMovies, updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "@/components/Loading";

const { width } = Dimensions.get("window");
const BANNER_WIDTH = width - 40;
const BANNER_HEIGHT = 180;

export default function Index() {
  const router = useRouter();
  const { language } = useGlobalContext();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies, true);

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const bannerRef = useRef<FlatList>(null);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "", language }), true);

  const {
    data: trendingToday,
    loading: trendingTodayLoading,
  } = useFetch(() => fetchTrending("all", "day"), true);

  const {
    data: tvShows,
    loading: tvShowsLoading,
  } = useFetch(fetchPopularTVShows, true);

  const {
    data: searchResults,
    loading: searchLoading,
    error: searchError,
    refetch: loadSearchResults,
    reset: resetSearch,
  } = useFetch(() => fetchMultiSearch(searchQuery, language), false);

  const featuredMovies = movies?.slice(0, 5) || [];

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentBannerIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadSearchResults();
      } else {
        resetSearch();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      updateSearchCount(searchQuery, searchResults[0]);
    }
  }, [searchResults]);

  // Auto-shuffle banners
  useEffect(() => {
    if (featuredMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % featuredMovies.length;
        bannerRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (searchQuery.trim()) {
          setSearchQuery("");
          return true; // Prevent default back action
        }
        return false; // Allow default back action
      },
    );

    return () => backHandler.remove();
  }, [searchQuery]);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView className="flex-1 bg-primary" edges={["top"]}>
        <Image source={images.bg} className="w-full absolute z-0" />
        {moviesLoading || trendingLoading ? (
          <Loading />
        ) : moviesError || trendingError ? (
          <ScrollView className="flex-1 px-5">
             <Text className="text-white text-center mt-32">
              Error: {moviesError?.message || trendingError?.message}
            </Text>
          </ScrollView>
        ) : (
          <ScrollView
            className="flex-1 px-5"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ minHeight: "100%", paddingBottom: 20 }}
          >
            <View className="mt-0 mb-5">
                <SearchBar
                  placeholder="Search for movies, TV shows..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              {searchQuery.trim() ? (
                // Search Results View
                <View className="flex-1">
                  {searchLoading ? (
                    <Loading />
                  ) : searchError ? (
                    <Text className="text-white text-center mt-10">
                      Error: {searchError?.message}
                    </Text>
                  ) : searchResults && searchResults.length > 0 ? (
                    <>
                      <Text className="text-white text-lg font-semibold mb-3">
                        Search Results for <Text className="text-accent">{searchQuery}</Text>
                      </Text>
                      <FlatList
                        data={searchResults}
                        renderItem={({ item }) => <MediaCard item={item} />}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={3}
                        columnWrapperStyle={{
                          justifyContent: "flex-start",
                          gap: 20,
                          paddingRight: 5,
                          marginBottom: 10,
                        }}
                        className="mt-2 mb-32"
                        scrollEnabled={false}
                      />
                    </>
                  ) : searchQuery.trim() ? (
                    <Text className="text-gray-500 text-center mt-10">
                      No movies found for "{searchQuery}"
                    </Text>
                  ) : null}
                </View>
              ) : (
                <>
                  {/* Banner Section */}
                  <View className="mb-5">
                    <FlatList
                      ref={bannerRef}
                      data={featuredMovies}
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      snapToAlignment="center"
                      decelerationRate="fast"
                      snapToInterval={BANNER_WIDTH + 20}
                      contentContainerStyle={{ paddingHorizontal: 0 }}
                      onViewableItemsChanged={onViewableItemsChanged}
                      viewabilityConfig={viewabilityConfig}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => router.push(`/movies/${item.id}`)}
                          style={{
                            width: BANNER_WIDTH,
                            height: BANNER_HEIGHT,
                            marginRight: 20,
                          }}
                          activeOpacity={0.8}
                        >
                          <LinearGradient
                            colors={["transparent", "rgba(3, 0, 20, 0.95)"]}
                            style={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              height: "70%",
                              zIndex: 1,
                              borderRadius: 16,
                            }}
                          />
                          <Image
                            source={{
                              uri: `https://image.tmdb.org/t/p/w500${item.backdrop_path}`,
                            }}
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 16,
                            }}
                            resizeMode="cover"
                          />
                          <View
                            style={{
                              position: "absolute",
                              bottom: 15,
                              left: 15,
                              right: 15,
                              zIndex: 2,
                            }}
                          >
                            <Text
                              className="text-white text-lg font-bold"
                              numberOfLines={1}
                            >
                              {item.title}
                            </Text>
                            <View className="flex-row items-center mt-1">
                              <Text className="text-yellow-400 text-sm mr-2">
                                ⭐ {item.vote_average.toFixed(1)}
                              </Text>
                              <Text className="text-gray-400 text-xs">
                                {new Date(item.release_date).getFullYear()}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item) => `banner-${item.id}`}
                    />

                    {/* Pagination Dots */}
                    <View className="flex-row justify-center items-center mt-4">
                      {featuredMovies.map((_item: any, index: number) => (
                        <View
                          key={`dot-${index}`}
                          style={{
                            width: currentBannerIndex === index ? 24 : 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor:
                              currentBannerIndex === index
                                ? "#AB8BFF"
                                : "#4B5563",
                            marginHorizontal: 4,
                          }}
                        />
                      ))}
                    </View>

                    {/* Trending Today Section */}
                    {trendingToday && trendingToday.length > 0 ? (
                      <View className="mt-5">
                        <Text className="text-white text-lg font-semibold mb-4">
                          Trending Today
                        </Text>
                        <FlatList
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          ItemSeparatorComponent={() => (
                            <View className="w-4" />
                          )}
                          data={trendingToday.slice(0, 10)}
                          renderItem={({ item }) => (
                            <View className="w-32">
                              <MediaCard item={item} width="w-full" />
                            </View>
                          )}
                          keyExtractor={(item) => `trending-${item.id}`}
                        />
                      </View>
                    ) : null}

                    {/* Popular TV Shows */}
                    {tvShows && tvShows.length > 0 ? (
                      <View className="mt-5">
                        <Text className="text-white text-lg font-semibold mb-4">
                          Popular TV Shows
                        </Text>
                        <FlatList
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          ItemSeparatorComponent={() => (
                            <View className="w-4" />
                          )}
                          data={tvShows.slice(0, 10)}
                          renderItem={({ item }) => (
                            <View className="w-32">
                              <TVShowCard {...item} width="w-full" />
                            </View>
                          )}
                          keyExtractor={(item) => `tv-${item.id}`}
                        />
                      </View>
                    ) : null}

                    {/* Trending Movies from Appwrite */}
                    {trendingMovies && trendingMovies.length > 0 ? (
                      <View className="mt-5">
                        <Text className="text-white text-lg font-semibold mb-4">
                          Most Searched
                        </Text>
                        <FlatList
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          ItemSeparatorComponent={() => (
                            <View className="w-4" />
                          )}
                          data={trendingMovies}
                          renderItem={({ item, index }) => (
                            <TrendingCard movie={item} index={index} />
                          )}
                          keyExtractor={(item) => item.movie_id.toString()}
                        />
                      </View>
                    ) : null}
                  </View>

                  <View className="flex-1 mt-5">
                    <Text className="text-white text-lg font-semibold mb-3">
                      Latest Movies
                    </Text>
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
                      className="mt-2 mb-32"
                      scrollEnabled={false}
                    />
                  </View>
                </>
              )}
            </ScrollView>
          )}
        </SafeAreaView>
      </>
    );
}
