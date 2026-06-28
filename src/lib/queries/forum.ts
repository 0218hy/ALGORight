
import { CreatePostPayload, CreateReplyPayload, ForumPost, ForumReply } from "@/src/types/forum";
import { supabase } from "../supabase";

export const getAllForumPost = async (): Promise<ForumPost[] | null> => {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*, profiles:user_id(username, avatar_url)')
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error('Forum Post DB Fetch failed:', error);
      throw error;
    }

    return data as ForumPost[] | null;
};

export const getForumPostById = async (id: string): Promise<ForumPost | null> => {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*, profiles:user_id(username, avatar_url)')
      .eq('id', id )
      .maybeSingle();
  
    if (error) {
      console.error('Forum Post DB Fetch failed:', error);
      throw error;
    }

    return data as ForumPost | null;
};

export const getForumPostsByUserId = async (user_id: string): Promise<ForumPost[] | null> => {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*, profiles:user_id(username, avatar_url)')
      .eq('user_id', user_id )
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error('Forum Post DB Fetch failed:', error);
      throw error;
    }

    return data as ForumPost[] | null;
};


export const getForumReplyByPostId = async (post_id: string): Promise<ForumReply[] | null> => {
    const { data, error } = await supabase
      .from('forum_replies')
      .select('*, profiles:user_id(username, avatar_url)')
      .eq('post_id', post_id)
      .order('created_at', { ascending: true });
  
    if (error) {
      console.error('Forum Post DB Fetch failed:', error);
      throw error;
    }

    return data as ForumReply[] | null;
};

export const savePostToDB = async (postData: CreatePostPayload ): Promise<ForumPost | null> => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("No authenticated user session found.");

    const { data, error } = await supabase
      .from('forum_posts')
      .insert([
        {
          ...postData,
          user_id: user.id
        }
      ])
      .select('id')
      .single();

      if (error) {
        console.error("Failed to save post to DB:", error);
        throw error;
      }

      return data as ForumPost;
}


export const saveReplyToDB = async (replyData: CreateReplyPayload ): Promise<ForumReply | null> => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("No authenticated user session found.");

    const { data, error } = await supabase
      .from('forum_replies')
      .insert([
        {
          ...replyData,
          user_id: user.id // The query handles injecting it here!
        }
      ])
      .select('post_id')
      .maybeSingle();

      if (error) {
        console.error("Failed to save reply to DB:", error);
        throw error;
      }

      return data as ForumReply | null;
}

export const deletePostFromDB = async (postId: string): Promise<void> => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("No authenticated user session found.");

    const { error } = await supabase.from('forum_posts').delete().eq('id', postId);
    if (error) throw error;
};

export const updatePostInDB = async (postId: string, title: string, body: string): Promise<void> => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("No authenticated user session found.");

    const { error } = await supabase.from('forum_posts').update({ title, body }).eq('id', postId);
    if (error) throw error;
};

export const deleteReplyFromDB = async (replyId: string): Promise<void> => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("No authenticated user session found.");

    const { error } = await supabase.from('forum_replies').delete().eq('id', replyId);
    if (error) throw error;
};

export const updateReplyInDB = async (replyId: string, replyText: string): Promise<void> => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("No authenticated user session found.");

    const { error } = await supabase.from('forum_replies').update({ reply: replyText }).eq('id', replyId);
    if (error) throw error;
};