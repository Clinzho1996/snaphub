import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "@/lib/cloudinary";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";

const Create = () => {
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const { session } = useAuth();

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
    setLoading(true);

    if (!image) {
      return;
    }
    // save post in database
    const response = await uploadImage(image);
    console.log("image id:", response?.public_id);

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          caption: caption,
          image: response?.public_id,
          user_id: session?.user.id,
        },
      ])
      .select();

    setLoading(false);
    router.push("/(tabs)");
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
        <Text className="text-blue-500 font-semibold">Choose Image/Video</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="What is on your mind?"
        className="p-3 w-full bg-white mt-5 rounded-sm"
        value={caption}
        onChangeText={(newValue) => setCaption(newValue)}
      />

      {loading ? (
        <ActivityIndicator
          color="blue"
          size={30}
          className="absolute bottom-5"
        />
      ) : (
        <Pressable
          onPress={createPost}
          className="bg-[#1877F2] w-full p-3 items-center rounded-md absolute bottom-5"
        >
          <Text className="text-white font-bold"> Share</Text>
        </Pressable>
      )}
    </View>
  );
};

export default Create;
