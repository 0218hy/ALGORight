import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  StyleSheet,
  ScrollView 
} from "react-native";
import { useRouter } from "expo-router";

import { savePostToDB } from "@/src/lib/queries/forum";
import Colors from "@/src/constants/Colors";
import { CreatePostPayload } from "@/src/types/forum";

export default function CreatePostScreen() {
    const router = useRouter();
    
    // Form States
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert("Missing Fields", "Please provide a title for your post.");
            return;
        }

        try {
            setSubmitting(true);

            const cleanTags = tagsInput
                .split(",")
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);

            const payload: CreatePostPayload = {
                title: title.trim(),
                body: body.trim(),
                tags: cleanTags
            };

            const newPost = await savePostToDB(payload);

            if (newPost?.id) {
                router.push(`/forum/${newPost.id}`);
            } else {
                throw new Error("No ID returned from database creation.");
            }

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to submit your post. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.headerTitle}>Start a Discussion</Text>

            {/* Title Input */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., Help with Two-Sum runtime complexity"
                    placeholderTextColor="#999"
                    value={title}
                    onChangeText={setTitle}
                    maxLength={100}
                />
            </View>

            {/* Body Input */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe your problem, ask a question, or share some insight..."
                    placeholderTextColor="#999"
                    value={body}
                    onChangeText={setBody}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                />
            </View>

            {/* Tags Input */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Tags (comma separated)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., Array, TwoPointers, HashTables"
                    placeholderTextColor="#999"
                    value={tagsInput}
                    onChangeText={setTagsInput}
                    autoCapitalize="none"
                />
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
                style={[styles.submitButton, submitting && styles.disabledButton]} 
                onPress={handleSubmit}
                disabled={submitting}
            >
                {submitting ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.submitButtonText}>Publish Post</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.potato.background,
    },
    content: {
        padding: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: Colors.potato.text,
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.potato.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: "#333",
    },
    textArea: {
        height: 150,
    },
    submitButton: {
        backgroundColor: Colors.potato.tabIconSelected,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: Colors.potato.tint,
    },
    submitButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});