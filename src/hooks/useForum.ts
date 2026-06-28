import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { getAllForumPost, getForumPostById, getForumReplyByPostId } from "../lib/queries/forum";

import { supabase } from "../lib/supabase";
import { ForumPost, ForumReply } from "../types/forum";


export function useForumPosts() {
    const [posts, setPosts] = useState<ForumPost[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const loadPostData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllForumPost();
            setPosts(data);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not populate problem details.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPostData();
    }, [loadPostData]);

    return { posts, loading , refresh: loadPostData};
}

export function useForumReplies(postId: string) {
    const [replies, setReplies] = useState<ForumReply[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const loadRepliesData = useCallback( async () => {
        if (!postId) return;

        try {
            const data = await getForumReplyByPostId(postId);
            setReplies(data);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not populate problem details.");
        } finally {
            setLoading(false);
        }

    loadRepliesData();
    }, [postId]);

    useEffect(() => {
        setLoading(true);
        loadRepliesData();
    }, [loadRepliesData]);

    return { 
        replies, 
        loading, 
        refresh: loadRepliesData 
    };
}

export function useForumPostDetails(postId: string) {
    const [post, setPost] = useState<ForumPost | null>(null);
    const [replies, setReplies] = useState<ForumReply[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const loadThreadData = useCallback(async () => {
        if (!postId) return;

        try {
            const [postData, repliesData, { data: authData }] = await Promise.all([
                getForumPostById(postId),
                getForumReplyByPostId(postId),
                supabase.auth.getUser()
            ]);

            setPost(postData);
            setReplies(repliesData || []);
            setCurrentUserId(authData?.user?.id || null);
        } catch (error) {
            console.error("Failed to load forum thread data:", error);
            Alert.alert("Error", "Could not populate discussion thread.");
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        setLoading(true);
        loadThreadData();
    }, [loadThreadData]);

    return { 
        post, 
        replies, 
        loading,
        currentUserId, 
        refresh: loadThreadData 
    };
}
