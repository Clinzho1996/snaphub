import {
  Text,
  View,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { uploadImage } from "@/lib/cloudinary";

const Profile = () => {
  const { session } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, name, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setName(data.name);
        setImage(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      let avatar_url = image;

      if (image) {
        const response = await uploadImage(image);
        avatar_url = response?.public_id;

        console.log("Cloudinary response:", response);
        console.log("Avatar URL:", avatar_url);
      }

      const updates = {
        id: session?.user.id,
        username,
        name,
        phone,
        avatar_url,
        updated_at: new Date(),
      };

      console.log("Profile updates:", updates);

      const { data, error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        console.error("Supabase upsert error:", error);
        throw error;
      }

      console.log("Supabase upsert success:", data);
      Alert.alert("Profile updated successfully!");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="p-3 flex-1 bg-white">
      {/* Avatar image picker */}
      {image ? (
        <Image
          source={{ uri: image }}
          className="w-[80px] aspect-square self-center rounded-full bg-slate-300"
        />
      ) : (
        <View className="w-[80px] aspect-square self-center rounded-full bg-slate-300" />
      )}
      <Text
        onPress={pickImage}
        className="text-blue-500 font-semibold m-5 self-center"
      >
        Change profile photo
      </Text>

      {/* Form */}
      <TextInput
        placeholder="Name"
        placeholderTextColor="#757575"
        value={name || ""}
        onChangeText={(text) => setName(text)}
        className="border-b-[0.2px] border-gray-300 p-3"
      />
      <TextInput
        placeholder="Username"
        placeholderTextColor="#757575"
        value={username || ""}
        onChangeText={(text) => setUsername(text)}
        className="border-b-[0.2px] border-gray-300 p-3 mt-3"
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor="#757575"
        value={session?.user.email}
        editable={false}
        className="border-b-[0.2px] border-gray-300 p-3 mt-3"
      />
      <TextInput
        placeholder="Phone Number"
        placeholderTextColor="#757575"
        value={phone || ""}
        onChangeText={(text) => setPhone(text)}
        className="border-b-[0.2px] border-gray-300 p-3 mt-3"
      />

      {/* Button */}
      <View className="gap-2 mt-auto">
        {loading ? (
          <ActivityIndicator color="blue" size={30} />
        ) : (
          <TouchableOpacity
            onPress={updateProfile}
            className="bg-blue-500 w-full p-3 items-center rounded-md"
          >
            <Text className="text-white font-bold">Update Profile</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="bg-[#f2061a] w-full p-3 items-center rounded-md"
          onPress={() => {
            supabase.auth.signOut(), router.push("/(auth)");
          }}
        >
          <Text className="text-white font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
