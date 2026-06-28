import { ScreenWrapper } from "@/src/components/ScreenWrapper";
import Colors from "@/src/constants/Colors";
import { useForumPostDetails } from "@/src/hooks/useForum";
import {
    deletePostFromDB,
    deleteReplyFromDB,
    saveReplyToDB,
    updatePostInDB,
    updateReplyInDB
} from "@/src/lib/queries/forum";
import { ForumReply } from "@/src/types/forum";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator, Alert,
    FlatList,
    KeyboardAvoidingView, Platform,
    StyleSheet,
    Text,
    TextInput, TouchableOpacity,
    View
} from "react-native";

const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function PostDetailScreen() {
    const { postId } = useLocalSearchParams<{ postId: string }>();
    const router = useRouter();
    
    const { post, replies, loading, currentUserId, refresh } = useForumPostDetails(postId);
    
    const [replyText, setReplyText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Editing States
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [editPostTitle, setEditPostTitle] = useState("");
    const [editPostBody, setEditPostBody] = useState("");

    const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
    const [editReplyText, setEditReplyText] = useState("");

    const handleDeletePost = useCallback(() => {
        Alert.alert("Delete Post", "Are you sure? This action is permanent.", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: async () => {
                await deletePostFromDB(postId);
                router.back();
            }}
        ]);
    }, [postId, router]);

    const handleUpdatePost = useCallback(async () => {
        if (!editPostTitle.trim()) return;
        await updatePostInDB(postId, editPostTitle.trim(), editPostBody.trim());
        setIsEditingPost(false);
        refresh();
    }, [postId, editPostTitle, editPostBody, refresh]);

    const handleDeleteReply = useCallback((replyId: string) => {
        Alert.alert("Delete Comment", "Remove this reply permanently?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: async () => {
                await deleteReplyFromDB(replyId);
                refresh();
            }}
        ]);
    }, [refresh]);

    const handleUpdateReply = useCallback(async (replyId: string) => {
        if (!editReplyText.trim()) return;
        await updateReplyInDB(replyId, editReplyText.trim());
        setEditingReplyId(null);
        refresh();
    }, [editReplyText, refresh]);

    const handleSendReply = async () => {
        if (!replyText.trim()) return;
        try {
            setSubmitting(true);
            await saveReplyToDB({ post_id: postId, reply: replyText.trim() });
            setReplyText("");
            refresh();
        } catch (error) {
            Alert.alert("Error", "Could not send reply.");
        } finally {
            setSubmitting(false);
        }
    };

    // Stable Render Layout Callbacks
    const renderReplyItem = useCallback(({ item }: { item: ForumReply }) => (
        <ReplyItemCard 
            item={item}
            currentUserId={currentUserId}
            editingReplyId={editingReplyId}
            editReplyText={editReplyText}
            setEditReplyText={setEditReplyText}
            setEditingReplyId={setEditingReplyId}
            handleUpdateReply={handleUpdateReply}
            handleDeleteReply={handleDeleteReply}
        />
    ), [currentUserId, editingReplyId, editReplyText, handleUpdateReply, handleDeleteReply]);

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: Colors.potato.background }]}>
                <ActivityIndicator size="large" color={Colors.potato.tint} />
            </View>
        );
    }

    return (
        <ScreenWrapper showBack pillLabel="Post" pillIcon="comments">
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
            <View style={styles.innerLayout}>
                <FlatList 
                    data={replies} 
                    keyExtractor={(item) => item.id.toString()} 
                    renderItem={renderReplyItem} 
                    ListHeaderComponent={(
                        <PostHeaderCard 
                            post={post}
                            isEditingPost={isEditingPost}
                            editPostTitle={editPostTitle}
                            editPostBody={editPostBody}
                            setEditPostTitle={setEditPostTitle}
                            setEditPostBody={setEditPostBody}
                            handleUpdatePost={handleUpdatePost}
                            setIsEditingPost={setIsEditingPost}
                            currentUserId={currentUserId}
                            handleDeletePost={handleDeletePost}
                            repliesCount={replies?.length || 0}
                        />
                    )} 
                    contentContainerStyle={styles.listContent} 
                />
                {/* Input dock — hide when editing post or reply */}
                {!isEditingPost && !editingReplyId && (
                    <View style={styles.safeAreaDock}>
                        <View style={styles.inputDockInner}>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Add to the discussion..." 
                                placeholderTextColor="#a29286" 
                                value={replyText} 
                                onChangeText={setReplyText} 
                                multiline 
                                blurOnSubmit={false}
                            />
                            <TouchableOpacity 
                                style={[styles.sendButton, !replyText.trim() && styles.disabledButton]} 
                                onPress={handleSendReply} 
                                disabled={submitting || !replyText.trim()}
                            >
                                {submitting 
                                    ? <ActivityIndicator color="#FFF" size="small" /> 
                                    : <FontAwesome name="send" size={16} color="#fff" />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}


const PostHeaderCard = React.memo(({ 
    post, isEditingPost, editPostTitle, editPostBody, setEditPostTitle, 
    setEditPostBody, handleUpdatePost, setIsEditingPost, currentUserId, handleDeletePost, repliesCount 
}: any) => {
    if (!post) return null;

    if (isEditingPost) {
        return (
            <View style={styles.mainPostCard}>
                <TextInput style={styles.editInput} value={editPostTitle} onChangeText={setEditPostTitle} placeholder="Edit Title" />
                <TextInput style={[styles.editInput, { height: 100 }]} value={editPostBody} onChangeText={setEditPostBody} multiline placeholder="Edit Body" />
                <View style={styles.actionButtonGroup}>
                    <TouchableOpacity style={styles.saveBtn} onPress={handleUpdatePost}><Text style={styles.btnText}>Save</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditingPost(false)}><Text style={styles.btnText}>Cancel</Text></TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.mainPostCard}>
            <Text style={styles.mainTitle}>{post.title}</Text>
            <Text style={styles.mainBody}>{post.body}</Text>
            <View style={styles.mainFooter}>
                <Text style={styles.mainAuthor}>By {post.profiles?.username ?? "Anonymous"}</Text>
                <Text style={styles.mainMeta}>{formatDate(post.created_at)}</Text>
            </View>

            {currentUserId === post.user_id && (
                <View style={styles.ownerControls}>
                    <TouchableOpacity onPress={() => { setIsEditingPost(true); setEditPostTitle(post.title); setEditPostBody(post.body); }}>
                        <Text style={styles.editLink}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDeletePost}>
                        <Text style={styles.deleteLink}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
            <Text style={styles.repliesSectionDivider}>Discussion ({repliesCount})</Text>
        </View>
    );
});

const ReplyItemCard = React.memo(({ 
    item, currentUserId, editingReplyId, editReplyText, 
    setEditReplyText, setEditingReplyId, handleUpdateReply, handleDeleteReply 
}: any) => {
    if (editingReplyId === item.id) {
        return (
            <View style={styles.replyCard}>
                <TextInput style={styles.editInput} value={editReplyText} onChangeText={setEditReplyText} multiline />
                <View style={styles.actionButtonGroup}>
                    <TouchableOpacity style={styles.saveBtn} onPress={() => handleUpdateReply(item.id)}><Text style={styles.btnText}>Save</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditingReplyId(null)}><Text style={styles.btnText}>Cancel</Text></TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.replyCard}>
            <View style={styles.replyHeader}>
                <Text style={styles.replyAuthor}>{item.profiles?.username ?? "Anonymous"}</Text>
                <Text style={styles.replyMeta}>{formatDate(item.created_at)}</Text>
            </View>
            <Text style={styles.replyBody}>{item.reply}</Text>

            {currentUserId === item.user_id && (
                <View style={[styles.ownerControls, { marginTop: 8 }]}>
                    <TouchableOpacity onPress={() => { setEditingReplyId(item.id); setEditReplyText(item.reply); }}>
                        <Text style={styles.editLink}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteReply(item.id)}>
                        <Text style={styles.deleteLink}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.potato.background },
    innerLayout: { flex: 1 },
    centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    listContent: { padding: 16, paddingBottom: 20 },

    // Main post card
    mainPostCard: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: Colors.potato.darker },
    mainTitle: { fontSize: 22, fontWeight: "700", color: Colors.potato.darker, marginBottom: 10 },
    mainBody: { fontSize: 15, color: Colors.potato.text, lineHeight: 22, marginBottom: 16 },
    mainFooter: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: Colors.potato.darker, paddingTop: 12, marginBottom: 6 },
    mainAuthor: { fontSize: 13, fontWeight: "700", color: Colors.potato.darker },
    mainMeta: { fontSize: 12, color: "#8a7565" },
    repliesSectionDivider: { fontSize: 14, fontWeight: "700", color: Colors.potato.tint, marginTop: 12, textTransform: "uppercase", letterSpacing: 0.5 },

    // Reply card
    replyCard: { backgroundColor: Colors.potato.background, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.potato.warm, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
    replyHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
    replyAuthor: { fontSize: 13, fontWeight: "700", color: Colors.potato.darker },
    replyMeta: { fontSize: 11, color: "#8a7565" },
    replyBody: { fontSize: 14, color: Colors.potato.text, lineHeight: 19 },

    // Owner controls
    ownerControls: { flexDirection: "row", gap: 14, alignSelf: "flex-end", marginTop: 4 },
    editLink: { fontSize: 13, color: Colors.potato.tint, fontWeight: "600" },
    deleteLink: { fontSize: 13, color: "#b3261e", fontWeight: "600" },

    // Edit inputs
    editInput: { borderWidth: 1, borderColor: Colors.potato.border, borderRadius: 8, padding: 10, marginBottom: 10, color: Colors.potato.darker, backgroundColor: Colors.potato.background },
    actionButtonGroup: { flexDirection: "row", gap: 10, justifyContent: "flex-end" },
    saveBtn: { backgroundColor: Colors.potato.tint, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
    cancelBtn: { backgroundColor: "#8a7565", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
    btnText: { color: "#FFF", fontSize: 12, fontWeight: "600" },

    // Input dock
    safeAreaDock: { backgroundColor: Colors.potato.background, borderTopWidth: 1, borderColor: Colors.potato.border, paddingBottom: 30 },
    inputDockInner: { flexDirection: "row", alignItems: "center", paddingHorizontal: 15, paddingVertical: 10, gap: 10 },
    input: { flex: 1, backgroundColor: '#ffffff', borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, maxHeight: 100, color: Colors.potato.darker, borderWidth: 1, borderColor: Colors.potato.border },
    sendButton: { backgroundColor: Colors.potato.tint, borderRadius: 22, width: 44, height: 44, justifyContent: "center", alignItems: "center" },
    disabledButton: { backgroundColor: "#cbbcb1" },
    sendButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
});