import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";

const PostCard = ({ post }) => {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleSave = () => {
    setSaved(true);
  };

  const handleLike = () => {
    setLiked(true);
  };

  return (
    <View>
      {/* Header */}
      <View className="p-4 flex flex-row justify-between items-center">
        <View className="flex flex-row justify-start items-center gap-3">
          <Image
            source={{ uri: post.user.image_url }}
            className="w-12 aspect-square rounded-full"
          />
          <Text className="text-black font-bold">{post.user.username}</Text>
        </View>
        <View>
          <TouchableOpacity>
            <FontAwesome6 name="ellipsis-vertical" size={18} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <Image
        source={{ uri: post.image_url }}
        alt="post"
        className="w-full aspect-[4/3]"
      />
      <View className="flex flex-row justify-between items-center p-5">
        <View className="flex flex-row justify-start items-center gap-5">
          <TouchableOpacity onPress={handleLike}>
            <AntDesign
              name={liked ? "heart" : "hearto"}
              size={24}
              color={liked ? "red" : "black"}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome name="comment-o" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="send" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={handleSave}>
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="px-4">
        <Text>
          Liked by <Text className="text-black font-bold">Dev-Clinton</Text> and{" "}
          <Text className="text-black font-bold">267,000 others</Text>
        </Text>
        <View className="flex flex-row justify-start gap-2 mt-0">
          <Text className="text-black">
            <Text className="font-bold">{post.user.username} </Text>
            <Text>{post.caption}</Text>
          </Text>
        </View>
        <TouchableOpacity className="mt-2">
          <Text className="font-medium text-gray-400">
            View all 103 comments
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostCard;