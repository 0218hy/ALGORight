import { LeetcodeTopicTag } from "./leetcode";

export interface ForumUserProfile {
    username: string;
    total_xp: number;
    current_level: number;
}

export interface ForumPost  {
    id: string;
    user_id: string;
    tags: LeetcodeTopicTag[];
    title: string;
    body: string;
    created_at: string;
    profiles: ForumUserProfile | null;
}

export interface ForumReply  {
    id: string;
    user_id: string;
    post_id: string;
    reply: string;
    created_at: string;
    profiles: ForumUserProfile | null;
}

export interface CreatePostPayload {
    tags: string[];
    title: string;
    body: string | null;
}

export interface CreateReplyPayload {
    post_id: string;
    reply: string;
}

