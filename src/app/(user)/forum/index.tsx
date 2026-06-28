import { ScreenWrapper } from "@/src/components/ScreenWrapper";
import Colors from "@/src/constants/Colors";
import { useForumPosts } from "@/src/hooks/useForum";
import { ForumPost } from "@/src/types/forum";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ForumScreen() {
    const router = useRouter();
    const { posts, loading, refresh } = useForumPosts();

    useFocusEffect(
        useCallback(() => {
            refresh();
        }, [refresh])
    );

    const renderPostCard = ({ item }: { item: ForumPost }) => {
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/forum/${item.id}`)}
                activeOpacity={0.7}
            >
                <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                </Text>

                <Text style={styles.body} numberOfLines={3}>
                    {item.body}
                </Text>

                {/* tags */}
                {item.tags && item.tags.length > 0 && (
                    <View style={styles.tagContainer}>
                        {item.tags.map((tag, idx) => (
                            <View key={idx} style={styles.tagBadge}>
                                <Text style={styles.tagText}>#{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Author Metadata Row */}
                <View style={styles.footer}>
                    <Text style={styles.authorText}>
                        By: {item.profiles?.username ?? "Anonymous"}
                    </Text>
                    <Text style={styles.xpText}>
                        Lvl {item.profiles?.current_level ?? 1} • {item.profiles?.total_xp ?? 0} XP
                    </Text>
                </View>

                {/* View Replies Action Row */}
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={styles.commentActionButton}
                        onPress={() => router.push(`/forum/${item.id}`)}
                        activeOpacity={0.6}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <FontAwesome name="comment" size={13} color={Colors.potato.tint} />
                            <Text style={styles.commentActionText}>View Replies</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.potato.tint} />
            </View>
        );
    }

    return (
        <ScreenWrapper showBack pillLabel="Forum" pillIcon="comments">
        <View style={styles.container}>
            
            {/* potato watermark */}
            <Image
                source={require('@/assets/images/potato.png')}
                style={styles.potatoWatermark}
            />

            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={renderPostCard}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Text style={styles.emptyText}>No forum posts found. Start a conversation!</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push("/forum/create")}
                activeOpacity={0.8}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.potato.background,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    listContent: {
        padding: 16,
        paddingBottom: 90, // Ensures room to scroll past the floating action button safely
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: Colors.potato.border,
        shadowColor: Colors.potato.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.potato.darker,
        marginBottom: 6,
    },
    body: {
        fontSize: 14,
        color: Colors.potato.text,
        lineHeight: 20,
        marginBottom: 12,
    },
    tagContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 12,
        gap: 6,
    },
    tagBadge: {
        backgroundColor: Colors.potato.warm,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    tagText: {
        fontSize: 12,
        color: Colors.potato.darker,
        fontWeight: "600",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: Colors.potato.border,
        paddingTop: 10,
        marginBottom: 12, // Separation space before the reply button container
    },
    authorText: {
        fontSize: 13,
        fontWeight: "700",
        color: Colors.potato.text,
    },
    xpText: {
        fontSize: 12,
        color: "#8a7565",
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "flex-end", // Aligns button beautifully on the right edge
    },
    commentActionButton: {
        backgroundColor: "#f2eae1", // Warm matching accent background tint
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    commentActionText: {
        fontSize: 13,
        fontWeight: "700",
        color: Colors.potato.tint,
    },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 20,
        backgroundColor: Colors.potato.tint,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: Colors.potato.darker,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 6,
    },
    fabText: {
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "300",
        lineHeight: 32,
    },
    emptyText: {
        color: "#8a7565",
        textAlign: "center",
        fontSize: 15,
    },
    potatoWatermark: {
        position: 'absolute',
        right: 120,
        top: 350,
        width: 350,
        height: 350,
        opacity: 0.06,
        transform: [{ rotate: '5deg' }],
  },
});