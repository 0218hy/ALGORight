import { generateQuiz, getQuestionBySlug, getQuizBySlug, MultipleChoiceOption, QuizQuestion } from '@/src/lib/queries/challenge';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';

export default function QuizScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const { width } = useWindowDimensions();

    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: 'A' | 'B' | 'C' | null }>({});
    const [submittedQuestions, setSubmittedQuestions] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        const fetchOrGenerateQuiz = async () => {
            if (!slug) return;

            try {
                setLoading(true);

                let quizData = await getQuizBySlug(slug);
                if (!quizData) {
                    console.log("No cached quiz found. Getting details about this problem ...");

                    // Need to get title and description
                    const parentProblem = await getQuestionBySlug(slug);
                    if (!parentProblem) {
                        throw new Error("Problem data not found. Cannot generate quiz.");
                    }

                    console.log("Generating quiz...");
                    quizData = await generateQuiz(
                        parentProblem.leetcode_slug,
                        parentProblem.title,
                        parentProblem.description
                    );
                }

                let finalQuizData: QuizQuestion[] = [];
                if (quizData) {
                    // Scenario A: It came from the DB cache and is wrapped in an object { quiz_json: [...] }
                    if (!Array.isArray(quizData) && (quizData as any).quiz_json) {
                        finalQuizData = (quizData as any).quiz_json;
                    }
                    // Scenario B: It came straight from the Edge Function array response [...]
                    else if (Array.isArray(quizData)) {
                        finalQuizData = quizData;
                    }
                    // Scenario C: It came back as a raw JSON string that needs parsing
                    else if (typeof quizData === 'string') {
                        try {
                            finalQuizData = JSON.parse(quizData);
                        } catch (e) {
                            console.error("Failed to parse quizData string", e);
                        }
                    }
                }

                if (finalQuizData && finalQuizData.length > 0) {
                    setQuestions(finalQuizData);
                } else {
                    throw new Error("Failed to retrieve valid quiz structure.");
                }

            } catch (err) {
                console.error(err);
                Alert.alert("Quiz Unavailable", "Could not load or generate the conceptual quiz for this challenge.");
                router.push("/(user)/challenge")
            } finally {
                setLoading(false);
            }
        };

        fetchOrGenerateQuiz();
    }, [slug]);

    const handleSelectOption = (questionIndex: number, optionId: 'A' | 'B' | 'C') => {
        if (submittedQuestions[questionIndex]) return;

        setSelectedOptions((prev) => ({
            ...prev,
            [questionIndex]: optionId,
        }));
    };

    const handleSubmitAnswer = (questionIndex: number) => {
        if (!selectedOptions[questionIndex]) return;

        setSubmittedQuestions((prev) => ({
            ...prev,
            [questionIndex]: true,
        }));
    };

    const handleReset = () => {
        setSelectedOptions({});
        setSubmittedQuestions({});
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.loadingCard}>
                    {/* Animated Spinner Icon */}
                    <ActivityIndicator size="large" color="#4A2306" style={styles.spinner} />

                    {/* Title and Subtitles */}
                    <Text style={styles.loadingTitle}>Analyzing Patterns...</Text>
                    <Text style={styles.loadingSubtitle}>
                        Gemini is breaking down the solution space to build a custom concept checkpoint for you.
                    </Text>

                    {/* Helpful Tip Box to keep user engaged */}
                    <View style={styles.tipBox}>
                        <Text style={styles.tipTitle}>💡 INTERVIEW TIP</Text>
                        <Text style={styles.tipText}>
                            Always clarify your input boundaries (like negative numbers, empty arrays, or memory constraints) before writing any code during technical assessments!
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Back Navigation */}
            <TouchableOpacity
                style={styles.backNavigationButton}
                onPress={() => router.push(`/challenge/${slug}`)}
                activeOpacity={0.7}
            >
                <Text style={styles.backNavigationText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.screenHeader}> Quiz! </Text>
            <Text style={styles.screenSubtitle}> {slug} </Text>

            {questions.map((quiz, qIdx) => {
                const selectedOption = selectedOptions[qIdx] || null;
                const isSubmitted = submittedQuestions[qIdx] || false;
                const isCorrect = selectedOption === quiz.correct_option_id;

                return (
                    <View key={qIdx} style={styles.quizCard}>
                        {/* Header / Type Badge */}
                        <View style={styles.cardHeaderRow}>
                            <View style={[styles.typeBadge, styles[`badge_${quiz.type}` as keyof typeof styles] as object]}>
                                <Text style={styles.typeBadgeText}>{quiz.type.toUpperCase()}</Text>
                            </View>
                            <Text style={styles.questionTracker}>Question {qIdx + 1} of {questions.length}</Text>
                        </View>

                        {/* Question Description */}
                        <Text style={styles.questionText}>{quiz.question_text}</Text>

                        {/* Multiple Choice Options List */}
                        <View style={styles.optionsContainer}>
                            {quiz.options.map((option: MultipleChoiceOption) => {
                                const isSelected = selectedOption === option.id;

                                // Production UI Color Modifiers
                                let optionStyle = [styles.optionRow];
                                let textStyle = [styles.optionText];
                                let indicatorStyle = [styles.optionIndicator];

                                if (isSelected) {
                                    optionStyle.push(styles.optionSelected as never);
                                    textStyle.push(styles.optionTextSelected as never);
                                    indicatorStyle.push(styles.indicatorSelected as never);
                                }

                                if (isSubmitted) {
                                    if (option.id === quiz.correct_option_id) {
                                        // Always reveal correct answers cleanly
                                        optionStyle.push(styles.optionCorrect as never);
                                        indicatorStyle.push(styles.indicatorCorrect as never);
                                    } else if (isSelected && !isCorrect) {
                                        // Flag the wrong user choice red
                                        optionStyle.push(styles.optionIncorrect as never);
                                        indicatorStyle.push(styles.indicatorIncorrect as never);
                                    }
                                }

                                return (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={optionStyle}
                                        activeOpacity={0.7}
                                        onPress={() => handleSelectOption(qIdx, option.id)}
                                        disabled={isSubmitted}
                                    >
                                        <View style={indicatorStyle}>
                                            <Text style={styles.indicatorIdText}>{option.id}</Text>
                                        </View>
                                        <Text style={textStyle}>{option.text}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Action Submit Control Wrapper */}
                        {!isSubmitted ? (
                            <TouchableOpacity
                                style={[styles.submitButton, !selectedOption && styles.submitButtonDisabled]}
                                disabled={!selectedOption}
                                onPress={() => handleSubmitAnswer(qIdx)}
                            >
                                <Text style={styles.submitButtonText}>Verify Answer</Text>
                            </TouchableOpacity>
                        ) : (
                            /* Post-Submission Feedback Accordion Block */
                            <View style={[styles.feedbackBlock, isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect]}>
                                <Text style={styles.feedbackTitleText}>
                                    {isCorrect ? '✅ Correct Approach!' : '❌ Incorrect Analysis'}
                                </Text>

                                <View style={styles.divider} />

                                <Text style={styles.explanationLabel}>Explanation:</Text>
                                <Text style={styles.explanationBodyText}>{quiz.explanation}</Text>
                            </View>
                        )}
                    </View>
                );
            })}
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <Text style={styles.resetText}>Reset & Try Again</Text>
            </TouchableOpacity>
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF6F0', // Matches your custom potato theme palette background
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
    },
    screenHeader: {
        fontSize: 24,
        fontWeight: '800',
        color: '#4A2306',
    },
    screenSubtitle: {
        fontSize: 14,
        color: '#7E6C5C',
        marginBottom: 20,
        marginTop: 4,
    },
    quizCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#EDE6DC',
        shadowColor: '#542706',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    typeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
    },
    badge_approach: { backgroundColor: '#EBF5FF', borderColor: '#BCE0FD' },
    badge_runtime: { backgroundColor: '#E6F4EA', borderColor: '#A8DAB5' },
    badge_space: { backgroundColor: '#FEF3D6', borderColor: '#FAD889' },
    typeBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#555555',
        letterSpacing: 0.5,
    },
    questionTracker: {
        fontSize: 12,
        color: '#A3907F',
        fontWeight: '600',
    },
    questionText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4A2306',
        lineHeight: 24,
        marginBottom: 16,
    },
    optionsContainer: {
        gap: 10,
        marginBottom: 16,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FCFAF7',
        borderWidth: 1,
        borderColor: '#EFEAE2',
        borderRadius: 8,
        padding: 12,
        gap: 12,
    },
    optionSelected: {
        backgroundColor: '#FFF2E6',
        borderColor: '#FFB366',
    },
    optionCorrect: {
        backgroundColor: '#E6F4EA',
        borderColor: '#34A853',
    },
    optionIncorrect: {
        backgroundColor: '#FCE8E6',
        borderColor: '#EA4335',
    },
    optionIndicator: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#EFEAE2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicatorSelected: { backgroundColor: '#FF9933' },
    indicatorCorrect: { backgroundColor: '#34A853' },
    indicatorIncorrect: { backgroundColor: '#EA4335' },
    indicatorIdText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#4A2306',
    },
    optionText: {
        flex: 1,
        fontSize: 14,
        color: '#555555',
        lineHeight: 20,
    },
    optionTextSelected: {
        color: '#4A2306',
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: '#4A2306',
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    submitButtonDisabled: {
        backgroundColor: '#D1C7BD',
    },
    submitButtonText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 15,
    },
    feedbackBlock: {
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        marginTop: 4,
    },
    feedbackCorrect: { backgroundColor: '#F4FAF6', borderColor: '#A8DAB5' },
    feedbackIncorrect: { backgroundColor: '#FDF3F2', borderColor: '#F5B7B1' },
    feedbackTitleText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#4A2306',
    },
    divider: {
        height: 1,
        backgroundColor: '#EFEAE2',
        marginVertical: 10,
    },
    explanationLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#7E6C5C',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
        marginBottom: 4,
    },
    explanationBodyText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#555555',
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAF6F0',
        padding: 24
    },
    loadingCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        width: '100%',
        maxWidth: 450,
        borderWidth: 1,
        borderColor: '#EDE6DC',
        shadowColor: '#542706',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
    },
    spinner: {
        marginBottom: 20,
        transform: [{ scale: 1.2 }]
    },
    loadingTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#4A2306',
        textAlign: 'center',
        marginBottom: 8
    },
    loadingSubtitle: {
        fontSize: 14,
        color: '#7E6C5C',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24
    },
    tipBox: {
        backgroundColor: '#FCFAF7',
        borderWidth: 1,
        borderColor: '#EFEAE2',
        borderRadius: 8,
        padding: 14,
        width: '100%',
    },
    tipTitle: {
        fontSize: 11,
        fontWeight: '800',
        color: '#FF9933',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    tipText: {
        fontSize: 12,
        lineHeight: 18,
        color: '#635345',
    },
    resetButton: { backgroundColor: '#333', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 40 },
    resetText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});