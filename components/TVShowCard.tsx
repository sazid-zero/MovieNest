import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface TVShowCardProps extends TVShow {
  width?: string;
}

const TVShowCard = ({ width = "w-[30%]", ...tvShow }: TVShowCardProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/tv/${tvShow.id}` as any)}
      className={`${width} mb-2`}
      activeOpacity={0.8}
    >
      <View className="relative">
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`,
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />
        {/* Rating Badge */}
        <View className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1">
          <Text className="text-yellow-400 text-xs font-semibold">
            ⭐ {tvShow.vote_average.toFixed(1)}
          </Text>
        </View>
      </View>
      <Text className="text-white text-sm font-medium mt-2" numberOfLines={2}>
        {tvShow.name}
      </Text>
      {tvShow.first_air_date && (
        <Text className="text-gray-500 text-xs mt-1">
          {new Date(tvShow.first_air_date).getFullYear()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default TVShowCard;
