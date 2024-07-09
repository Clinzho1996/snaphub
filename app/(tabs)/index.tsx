import { FlatList } from "react-native";
import React, { useState } from "react";
import posts from "../../assets/data/posts.json";
import PostCard from "@/components/PostCard";

const post1 = posts[0];

const Feeds = () => {
  return (
    <FlatList
      className="bg-white"
      data={posts}
      renderItem={({ item }) => <PostCard post={item} />}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default Feeds;
