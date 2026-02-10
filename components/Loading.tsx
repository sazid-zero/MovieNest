import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Loading = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View 
      style={StyleSheet.absoluteFillObject} 
      className="bg-primary justify-center items-center z-50"
    >
      <View className="relative">
        <Animated.View
          style={{
            transform: [{ rotate: spin }],
          }}
          className="w-20 h-20 rounded-full border-2 border-accent/20 border-t-accent"
        />
        <View className="absolute inset-0 justify-center items-center">
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Ionicons name="film" size={32} color="#AB8BFF" />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default Loading;
