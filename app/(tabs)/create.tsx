import { View, Text, Image, TextInput, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { upload } from "cloudinary-react-native";
import { cld } from "@/lib/cloudinary";

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

  const uploadImage = async () => {
    // upload to cloudinary
    if (!image) {
      return;
    }

    const options = {
      upload_preset: "default",
      unsigned: true,
    };

    await upload(cld, {
      file: image,
      options: options,
      callback: (error: any, response: any) => {
        //.. handle response
        console.log("error", error);
        console.log(response);
      },
    });
  };

  const createPost = async () => {
    // save post in database
    await uploadImage();
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
        onPress={uploadImage}
      >
        <Text className="text-white font-semibold">Share</Text>
      </Pressable>
    </View>
  );
};

export default Create;
