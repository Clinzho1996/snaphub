import { View, Text, Image, TextInput, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "@/lib/cloudinary";

const Create = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (!image) {
      pickImage();
    }
  }, [image]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const createPost = async () => {
    if (!image) {
      return;
    }
    // save post in database
    const response = await uploadImage(image);
    console.log("image id:", response?.public_id);
  };

  return (
    <View className="p-3 items-center h-full">
      {/* image picker */}
      {image ? (
        <Image
          source={{
            uri: image,
          }}
          className="w-52 aspect-[3/4] rounded-lg shadow-md"
        />
      ) : (
        <View className="w-52 aspect-[3/4] rounded-lg shadow-md bg-slate-300" />
      )}
      <TouchableOpacity className="mt-5" onPress={pickImage}>
        <Text className="text-blue-500 font-semibold">Change</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="What is on your mind?"
        className="p-3 w-full bg-white mt-5 rounded-sm"
        value={caption}
        onChangeText={(newValue) => setCaption(newValue)}
      />

      <Pressable
        className="bg-blue-500 w-full p-3 items-center rounded-md absolute bottom-5"
        onPress={createPost}
      >
        <Text className="text-white font-semibold">Share</Text>
      </Pressable>
    </View>
  );
};

export default Create;
