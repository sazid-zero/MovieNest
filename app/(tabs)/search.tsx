import React, { useEffect, useState } from "react";
import { FlatList, StatusBar, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "@/components/Loading";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import { useGlobalContext } from "@/context/GlobalContext";
import { fetchMultiSearch } from "@/services/api";
import useFetch from "@/services/useFetch";
import SearchBar from "@/components/SearchBar";
import { updateSearchCount } from "@/services/appwrite";
import MediaCard from "@/components/MediaCard";

const search = () => {
  const router = useRouter();
  const { language, includeAdult } = useGlobalContext();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: searchResults,
    loading: searchLoading,
    error: searchError,
    refetch: loadResults,
    reset
  } = useFetch(() => fetchMultiSearch(searchQuery, language, includeAdult), false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadResults();
      } else {
        reset();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]); 

  useEffect(() => {
     if (searchResults && searchResults.length > 0) {
          updateSearchCount(searchQuery, searchResults[0] as any);
        }
  }, [searchResults]);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView className="flex-1 bg-primary" edges={["top"]}>
        <Image source={images.bg} className="w-full absolute z-0 flex-1" 
        resizeMode="cover"/>
        
        <View className="px-5 my-5 z-10">
          <SearchBar 
            placeholder="Search movies, TV shows & people..."
            value={searchQuery}
            onChangeText={(text: string) => setSearchQuery(text)}
          />
        </View>

        {searchLoading ? (
          <Loading />
        ) : (
          <FlatList 
            data={searchResults} 
            renderItem={({item}) => <MediaCard item={item} />} 
            keyExtractor={(item) => item.id.toString()}
            className="px-5"
            numColumns={3}
            columnWrapperStyle={{ 
              justifyContent: "flex-start", 
              gap: 16,
              marginVertical: 16, 
            }}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListHeaderComponent={
              <>
                {searchError ? (
                  <Text className="text-red-500 px-5 my-3">
                    Error: {searchError.message}
                  </Text>
                ) : searchQuery.trim() && searchResults && searchResults.length > 0 ? (
                  <Text className="text-white text-xl font-bold">
                    Search Results for <Text className="text-accent">{searchQuery}</Text>
                  </Text>
                ) : null}
              </>
            }
            ListEmptyComponent={
              !searchError ? (
                <View className="mt-10 px-5">
                  <Text className="text-gray-500 text-center">
                    {searchQuery.trim() ? "No results found." : "Start typing to search for movies, TV shows or people."}
                  </Text>
                </View>
              ): null
            }
          />
        )}
      </SafeAreaView>
    </>
  );
};

export default search;
