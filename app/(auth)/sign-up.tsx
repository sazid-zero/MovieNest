import { Link, useRouter, Redirect } from "expo-router";
import React, { useState } from "react";
import { Alert, Dimensions, Image, ScrollView, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { images } from "@/constants/images";
import { useGlobalContext } from "@/context/GlobalContext";
import { createUser } from "@/services/appwrite";
import { Ionicons } from "@expo/vector-icons";

const SignUp = () => {
  const { isLogged, refetchUser } = useGlobalContext();
  const router = useRouter();

  if (isLogged) return <Redirect href="/" />;

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createUser(form.email, form.password, form.username);
      await refetchUser();
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary flex-1">
      <Image source={images.bg} className="w-full h-full absolute z-0" resizeMode="cover" />
      
      <ScrollView>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="absolute top-12 left-4 z-10 bg-gray-900/50 p-2 rounded-full border border-gray-800"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View
          className="w-full flex justify-center min-h-[85vh] px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <View className="items-center mb-10">
             <Text className="text-3xl text-white font-bold mt-2">MovieNest</Text>
          </View>

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Sign Up to MovieNest
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex-row justify-center pt-5 gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-accent"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
