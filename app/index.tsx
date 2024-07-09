import { View, Text } from "react-native";
import React from "react";
import { Redirect } from "expo-router";
import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
  default: "native",
});

const Home = () => {
  return <Redirect href="/(tabs)" />;
};

export default Home;
