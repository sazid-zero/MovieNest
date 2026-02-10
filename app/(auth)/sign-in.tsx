import { Link, useRouter, Redirect } from "expo-router";
import React, { useState } from "react";
import { Alert, Dimensions, Image, ScrollView, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { images } from "@/constants/images";
import { useGlobalContext } from "@/context/GlobalContext";
import { signIn } from "@/services/appwrite";
import { Ionicons } from "@expo/vector-icons";

const SignIn = () => {
  const { isLogged, refetchUser } = useGlobalContext();
  const router = useRouter();

  if (isLogged) return <Redirect href="/" />;

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn(form.email, form.password);
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
            Log in to MovieNest
          </Text>

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
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex-row justify-center pt-5 gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-accent"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
