import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "cloudinary-react-native";
// Import required actions and qualifiers.
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { cld } from "@/lib/cloudinary";

const PostCard = ({ post }: { post: any }) => {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const { width } = useWindowDimensions();

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const myImage = cld.image(post.image);
  myImage.resize(thumbnail().width(width).height(250));

  const avatar = cld.image(post.user.avatar_url);
  avatar.resize(
    thumbnail().width(48).height(48).gravity(focusOn(FocusOn.face()))
  );
  return (
    <View>
      {/* Header */}
      <View className="p-4 flex flex-row justify-between items-center">
        <View className="flex flex-row justify-start items-center gap-3">
          <AdvancedImage
            cldImg={avatar}
            className="w-12 aspect-square rounded-full p-2 border-gradient"
          />
          <Text className="text-black font-bold">{post.user.username}</Text>
        </View>
        <View>
          <TouchableOpacity>
            <FontAwesome6 name="ellipsis-vertical" size={18} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {/* content */}
      <AdvancedImage cldImg={myImage} className="w-full aspect-[4/3]" />
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
