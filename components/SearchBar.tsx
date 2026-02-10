import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, View } from "react-native";

interface Props {
  onPress?: () => void;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

const SearchBar = ({
  onPress,
  placeholder,
  value = "",
  onChangeText = () => {},
}: Props) => {
  return (
    <View
      className="flex-row items-center bg-dark-200 rounded-full px-5 py-1"
      style={{
        borderWidth: 1,
        borderColor: "rgba(171, 139, 255, 0.3)",
        shadowColor: "#AB8BFF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
      }}
    >
      <Ionicons name="search" size={20} color="#AB8BFF" />
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#ffffff"
        className="flex-1 ml-2 text-white"
      />
    </View>
  );
};

export default SearchBar;
