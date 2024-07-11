import { Alert, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import posts from "../../assets/data/posts.json";
import PostCard from "@/components/PostCard";
import { supabase } from "@/lib/supabase";

const post1 = posts[0];

const Feeds = () => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    let { data, error } = await supabase
      .from("posts")
      .select("*, user:profiles(*)")
      .order("created_at", { ascending: false });

    if (error) {
      Alert.alert("Error", "something went wrong");
    }

    setPosts((data as any) || null);
  };

  return (
    <FlatList
      className="bg-white"
      data={posts}
      renderItem={({ item }) => <PostCard post={item} />}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          onRefresh={onRefresh}
          refreshing={refreshing}
          colors={["text-blue-500", "blue"]}
          tintColor="blue"
        />
      }
    />
  );
};

export default Feeds;
