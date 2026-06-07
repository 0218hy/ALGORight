import Colors from '@/src/constants/Colors';
import { getQuestionBySlug, LeetCodeQuestion } from '@/src/lib/queries/challenge';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import RenderHTML from 'react-native-render-html';

export default function ProblemDetailScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const router = useRouter();
    const { width } = useWindowDimensions();

    const [question, setQuestion] = useState<LeetCodeQuestion | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [expandedHintIndex, setExpandedHintIndex] = useState<number | null>(null);

    useEffect(() => {
        const loadProblemData = async () => {
            if (!slug) return;
            try {
                setLoading(true);
                const data = await getQuestionBySlug(slug);
                setQuestion(data);
            } catch (error) {
                console.error(error);
                Alert.alert("Error", "Could not populate problem details.");
            } finally {
                setLoading(false);
            }
        };

        loadProblemData();
    }, [slug]);

    const toggleHint = (index: number) => {
        setExpandedHintIndex(expandedHintIndex === index ? null : index);
    };

    if (loading) {
        return (
            <View style={[styles.centered, { backgroundColor: Colors.potato.background }]}>
                <ActivityIndicator size="large" color={Colors.potato.darker} />
                <Text style={[styles.loadingText, { color: Colors.potato.text }]}>Preparing Workspace...</Text>
            </View>
        );
    }

    if (!question) {
        return (
            <View style={[styles.centered, { backgroundColor: Colors.potato.background }]}>
                <Text style={styles.errorText}>Problem data missing.</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Return to Filters</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const hints: string[] = question.metadata_json?.hints || [];
    const testcases: string = question.metadata_json?.exampleTestcases || "";

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Back Navigation */}
            <TouchableOpacity
                style={styles.backNavigationButton}
                onPress={() => router.push('/challenge')}
                activeOpacity={0.7}
            >
                <Text style={styles.backNavigationText}>← Back</Text>
            </TouchableOpacity>
            {/* Header Card */}
            <View style={styles.headerCard}>
                <Text style={styles.title}>{question.title}</Text>

                <View style={styles.metaRow}>
                    <View style={[
                        styles.difficultyBadge,
                        question.difficulty === 'Easy' && styles.badgeEasy,
                        question.difficulty === 'Medium' && styles.badgeMedium,
                        question.difficulty === 'Hard' && styles.badgeHard,
                    ]}>
                        <Text style={[
                            styles.badgeText,
                            question.difficulty === 'Easy' && { color: '#137333' },
                            question.difficulty === 'Medium' && { color: '#b06000' },
                            question.difficulty === 'Hard' && { color: '#c5221f' },
                        ]}>{question.difficulty}</Text>
                    </View>
                </View>

                {/* Display tags */}
                {question.tags && question.tags.length > 0 && (
                    <View style={styles.tagRow}>
                        {question.tags.map((tag, index) => (
                            <View key={index} style={styles.tagBubble}>
                                <Text style={styles.tagText}># {tag}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Problem Description */}
            <View style={styles.contentCard}>
                <Text style={styles.sectionHeaderTitle}>Problem Description</Text>
                <View style={styles.innerDivider} />

                <RenderHTML
                    contentWidth={width - 72}
                    source={{ html: question.description || "<p>No description available.</p>" }}
                    classesStyles={{
                        'example': { marginTop: 0 } // Tightens up any element with class="example"
                    }}
                    tagsStyles={{
                        p: { color: Colors.potato.text, fontSize: 15, lineHeight: 24, marginBottom: 4, marginTop: 0 },
                        code: { fontFamily: 'monospace', backgroundColor: '#f6f8fa', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4, color: '#cf222e' },
                        strong: { fontWeight: '700', color: Colors.potato.darker },
                        li: { color: Colors.potato.text, fontSize: 15, lineHeight: 24, marginBottom: 4 },
                        pre: {
                            backgroundColor: '#f3eae0',
                            paddingVertical: 2,
                            paddingHorizontal: 12,
                            borderRadius: 6,
                            borderWidth: 1,
                            borderColor: '#e4d5c3',
                            marginVertical: 5,
                            // Ensures the raw line breaks inside your database string are strictly followed
                            whiteSpace: 'pre',
                            fontFamily: 'monospace',
                        }
                    }}
                />
            </View>

            {/* Accordion Hint List View */}
            {hints.length > 0 && (
                <View style={styles.hintSectionContainer}>
                    <Text style={[styles.sectionHeaderTitle, { marginLeft: 4, marginBottom: 4 }]}>
                        Hints ({hints.length})
                    </Text>

                    {hints.map((hint, index) => {
                        const isExpanded = expandedHintIndex === index;
                        return (
                            <View key={index} style={styles.accordionCard}>
                                <TouchableOpacity
                                    style={[styles.accordionHeader, isExpanded && styles.accordionHeaderActive]}
                                    onPress={() => toggleHint(index)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.accordionHeaderTitle}>💡 Code Hint {index + 1}</Text>
                                    <Text style={styles.accordionChevron}>{isExpanded ? '▲' : '▼'}</Text>
                                </TouchableOpacity>

                                {isExpanded && (
                                    <View style={styles.accordionContent}>
                                        <Text style={styles.hintBodyText}>{hint}</Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>
            )}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.potato.background,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 14,
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    errorText: {
        fontSize: 16,
        color: '#cf222e',
        fontWeight: '600',
        marginBottom: 16,
    },
    backButton: {
        backgroundColor: Colors.potato.darker,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 6,
    },
    backButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    // Reusable Cards Layout
    headerCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ede6dc',
        elevation: 2,
        shadowColor: '#542706',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
    },
    contentCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ede6dc',
        elevation: 2,
        shadowColor: '#542706',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.potato.darker,
        lineHeight: 30,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 12,
    },
    difficultyBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
    },
    badgeEasy: { backgroundColor: '#E6F4EA', borderColor: '#34a853' },
    badgeMedium: { backgroundColor: '#FEF3D6', borderColor: '#fbbc05' },
    badgeHard: { backgroundColor: '#FCE8E6', borderColor: '#ea4335' },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    slugText: {
        fontSize: 13,
        color: '#7e6c5c',
        fontFamily: 'monospace',
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 14,
    },
    tagBubble: {
        backgroundColor: '#f3eae0',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#e4d5c3',
    },
    tagText: {
        fontSize: 12,
        color: Colors.potato.text,
        fontWeight: '600',
    },
    sectionHeaderTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.potato.darker,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    innerDivider: {
        height: 1,
        backgroundColor: '#f0e6da',
        marginVertical: 12,
    },
    codeBlock: {
        backgroundColor: '#faf6f0',
        borderRadius: 8,
        padding: 14,
        borderWidth: 1,
        borderColor: '#e9decb',
    },
    codeText: {
        fontFamily: 'monospace',
        fontSize: 13,
        color: '#4a2306',
        lineHeight: 18,
    },
    // Hint Accordions Layout
    hintSectionContainer: {
        marginTop: 12,
    },
    accordionCard: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ede6dc',
        marginTop: 10,
        overflow: 'hidden',
        elevation: 1,
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#ffffff',
    },
    accordionHeaderActive: {
        backgroundColor: '#fdfbfa',
    },
    accordionHeaderTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.potato.text,
    },
    accordionChevron: {
        fontSize: 11,
        color: '#a3907f',
    },
    accordionContent: {
        padding: 16,
        backgroundColor: '#fbf7f0',
        borderTopWidth: 1,
        borderColor: '#ede6dc',
    },
    hintBodyText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#704214', // Clear, dark hazel for clean visibility
    },
    backNavigationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 4,
        marginBottom: 12,
        alignSelf: 'flex-start', // Keeps the tap target localized to the text width
    },
    backNavigationText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#8b5a2b', // Using your exact tintColorPotato string
        letterSpacing: 0.3,
    },
});