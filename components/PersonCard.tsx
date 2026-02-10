import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface PersonCardProps {
  person: Person;
}

const PersonCard: React.FC<PersonCardProps> = ({ person }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/person/${person.id}` as any)}
      className="items-center mr-4"
      activeOpacity={0.8}
    >
      <View className="w-28">
        <Image
          source={{
            uri: person.profile_path
              ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
              : "https://via.placeholder.com/200x300?text=No+Image",
          }}
          className="w-28 h-28 rounded-full"
          resizeMode="cover"
        />
        <Text
          className="text-white text-sm font-medium mt-2 text-center"
          numberOfLines={2}
        >
          {person.name}
        </Text>
        {person.known_for_department && (
          <Text className="text-gray-500 text-xs text-center mt-1">
            {person.known_for_department}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PersonCard;
