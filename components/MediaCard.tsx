import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalContext } from "../context/GlobalContext";
import { addToWatchlist, checkIsSaved, removeFromWatchlist } from "../services/appwrite";

interface MediaCardProps {
  item: TrendingItem;
  width?: string;
  showBookmark?: boolean;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, width = "w-[30%]", showBookmark = false }) => {
  const router = useRouter();
  const { user, isLogged } = useGlobalContext();
  const [isSaved, setIsSaved] = useState(false);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (isLogged && user && item.media_type !== "person") {
        const savedDoc = await checkIsSaved(user.accountId, item.id);
        if (savedDoc) {
          setIsSaved(true);
          setSavedDocId(savedDoc.$id);
        }
      }
    };
    checkIfSaved();
  }, [isLogged, user, item.id]);

  const handleSave = async () => {
    if (!isLogged) {
      Alert.alert("Login Required", "Please sign in to save movies to your watchlist.", [
        { text: "Cancel", style: "cancel" },
        { text: "Sign In", onPress: () => router.push("/sign-in") }
      ]);
      return;
    }

    setLoading(true);
    try {
      if (isSaved && savedDocId) {
        await removeFromWatchlist(savedDocId);
        setIsSaved(false);
        setSavedDocId(null);
      } else {
        const newDoc = await addToWatchlist(item);
        if (newDoc) {
          setIsSaved(true);
          setSavedDocId(newDoc.$id);
        }
      }
    } catch (error: any) {
      Alert.alert("Error", "Could not update watchlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    if (item.media_type === "movie") {
      router.push(`/movies/${item.id}` as any);
    } else if (item.media_type === "tv") {
      router.push(`/tv/${item.id}` as any);
    } else if (item.media_type === "person") {
      router.push(`/person/${item.id}` as any);
    }
  };

  const getTitle = () => {
    if (item.media_type === "movie") return item.title;
    if (item.media_type === "tv") return item.name;
    if (item.media_type === "person") return item.name;
    return "Unknown";
  };

  const getImagePath = () => {
    if (item.media_type === "person") {
      return item.profile_path
        ? `https://image.tmdb.org/t/p/w500${item.profile_path}`
        : "https://via.placeholder.com/200x300?text=No+Image";
    }
    return `https://image.tmdb.org/t/p/w500${item.poster_path}`;
  };

  const getSubtitle = () => {
    if (item.media_type === "movie" && item.release_date) {
      return new Date(item.release_date).getFullYear().toString();
    }
    if (item.media_type === "tv" && item.first_air_date) {
      return new Date(item.first_air_date).getFullYear().toString();
    }
    if (item.media_type === "person" && item.known_for_department) {
      return item.known_for_department;
    }
    return null;
  };

  const subtitle = getSubtitle();

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`${width} mb-2`}
      activeOpacity={0.8}
    >
      <View className="relative">
        <Image
          source={{ uri: getImagePath() }}
          className="w-full h-40 rounded-lg"
          resizeMode="cover"
        />
        {/* Media Type Badge */}
        <View className="absolute top-2 left-2 bg-accent/90 rounded px-2 py-1">
          <Text className="text-white text-xs font-semibold uppercase">
            {item.media_type}
          </Text>
        </View>
        
        {/* Save Button */}
        {showBookmark && item.media_type !== "person" && (
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            className={`absolute bottom-2 right-2 p-1.5 rounded-full ${isSaved ? 'bg-accent' : 'bg-black/60'}`}
          >
            <Ionicons 
              name={isSaved ? "bookmark" : "bookmark-outline"} 
              size={16} 
              color="white" 
            />
          </TouchableOpacity>
        )}

        {/* Rating Badge - only for movies and TV */}
        {(item.vote_average ?? 0) > 0 && item.media_type !== "person" ? (
          <View className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1">
            <Text className="text-yellow-400 text-xs font-semibold">
              ⭐ {item.vote_average?.toFixed(1)}
            </Text>
          </View>
        ) : null}
      </View>
      <Text className="text-white text-sm font-medium mt-2" numberOfLines={2}>
        {getTitle()}
      </Text>
      {subtitle && (
        <Text className="text-gray-500 text-xs mt-1">{subtitle}</Text>
      )}
    </TouchableOpacity>
  );
};

export default MediaCard;
