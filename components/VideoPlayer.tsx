import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

interface VideoPlayerProps {
  videos: Video[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videos }) => {
  const trailers = videos.filter(
    (video) =>
      video.site === "YouTube" &&
      (video.type === "Trailer" || video.type === "Teaser"),
  );

  const openVideo = async (key: string) => {
    const url = `https://www.youtube.com/watch?v=${key}`;
    await WebBrowser.openBrowserAsync(url);
  };

  const getThumbnailUrl = (key: string) => {
    return `https://img.youtube.com/vi/${key}/hqdefault.jpg`;
  };

  if (trailers.length === 0) {
    return null;
  }

  return (
    <View className="mt-5">
      <Text className="text-white text-lg font-semibold mb-3">
        Trailers & Videos
      </Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={trailers}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View className="w-3" />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openVideo(item.key)}
            className="relative rounded-lg overflow-hidden w-64"
            activeOpacity={0.7}
          >
            {/* Thumbnail Image */}
            <Image
              source={{ uri: getThumbnailUrl(item.key) }}
              className="w-64 h-36 bg-gray-800"
              resizeMode="cover"
            />
            
            {/* Play Button Overlay */}
            <View className="absolute inset-0 items-center justify-center bg-black/30">
              <View className="bg-accent/90 rounded-full p-3">
                <Ionicons name="play" size={32} color="#fff" />
              </View>
            </View>

            {/* Video Title */}
            <View className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
              <Text className="text-white text-xs font-medium" numberOfLines={2}>
                {item.name}
              </Text>
              <Text className="text-gray-300 text-xs mt-0.5">
                {item.type}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default VideoPlayer;
