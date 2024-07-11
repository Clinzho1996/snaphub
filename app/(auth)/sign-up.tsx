import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  TextInput,
  TouchableOpacity,
  Text,
  useWindowDimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
      console.log(error);
    } else {
      router.push("/(tabs)");
    }
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <View className="h-full flex-1 justify-center bg-white px-5">
      <Text className="text-3xl font-extrabold text-center font-mono">
        SnapHub
      </Text>
      <View style={[styles.verticallySpaced]}>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
          className="p-3 w-full bg-[#EEEEEE] mt-5 rounded-md border border-[#c5c5c5]"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
          className="p-3 w-full bg-[#EEEEEE] mt-5 rounded-md border border-[#c5c5c5]"
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        {loading ? (
          <ActivityIndicator color="blue" size={30} />
        ) : (
          <TouchableOpacity
            onPress={() => signUpWithEmail()}
            className="bg-blue-500 w-full p-3 items-center rounded-md"
          >
            <Text className="text-white font-bold">Sign Up</Text>
          </TouchableOpacity>
        )}
      </View>
      <View className=" mt-3 mb-3 justify-center items-center flex-row flex">
        <Text>
          Already have an account?{" "}
          <TouchableOpacity
            className="mt-[-3px]"
            onPress={() => router.push("/(auth)")}
          >
            <Text className="text-black font-bold">Log in</Text>
          </TouchableOpacity>
        </Text>
      </View>
      <View className="flex flex-row justify-center items-center gap-3 px-5 mt-3">
        <Image
          source={require("../../assets/images/dash.png")}
          className="h-full w-[150px] "
          resizeMode="contain"
        />
        <Text>OR</Text>
        <Image
          source={require("../../assets/images/dash.png")}
          className="h-full w-[150px] "
          resizeMode="contain"
        />
      </View>
      <View style={styles.verticallySpaced} className="mt-8">
        <TouchableOpacity className="bg-[#1877F2] w-full pb-3 items-center rounded-md flex flex-row justify-center pt-3">
          <FontAwesome name="facebook-f" size={18} color="white" />
          <Text className="text-white font-bold pl-3">
            Sign Up with Facebook
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
