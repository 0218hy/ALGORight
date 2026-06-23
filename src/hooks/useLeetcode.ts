import {
    generateLeetcodeQuiz,
    getLeetcodeQuestionBySlug,
    getLeetcodeQuizBySlug
} from '@/src/lib/queries/leetcode';
import { LeetcodeQuestion, LeetcodeQuizQuestion } from '@/src/types/leetcode';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useLeetcodeQuestions(slug: string | undefined) {
    const [question, setQuestion] = useState<LeetcodeQuestion | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadProblemData = async () => {
            if (!slug) return;
            try {
                setLoading(true);
                const data = await getLeetcodeQuestionBySlug(slug);
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

    return { question, loading };
}

export function useLeetcodeQuiz(slug: string | undefined) {
    const [questions, setQuestions] = useState<LeetcodeQuizQuestion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
            const fetchOrGenerateQuiz = async () => {
                if (!slug) return;
    
                try {
                    setLoading(true);
    
                    let quizData = await getLeetcodeQuizBySlug(slug);
                    if (!quizData) {
                        console.log("No cached quiz found. Getting details about this problem ...");
    
                        // Need to get title and description
                        const parentProblem = await getLeetcodeQuestionBySlug(slug);
                        if (!parentProblem) {
                            throw new Error("Problem data not found. Cannot generate quiz.");
                        }
    
                        console.log("Generating quiz...");
                        quizData = await generateLeetcodeQuiz(
                            parentProblem.leetcode_slug,
                            parentProblem.title,
                            parentProblem.description
                        );
                    }
    
                    if (quizData && quizData.length > 0) {
                        setQuestions(quizData);
                    } else {
                        throw new Error("Failed to retrieve valid quiz structure.");
                    }
    
                } catch (err) {
                    console.error(err);
                    Alert.alert("Quiz Unavailable", "Could not load or generate the conceptual quiz for this challenge.");
                    router.push("/(user)/leetcode")
                } finally {
                    setLoading(false);
                }
            };
    
            fetchOrGenerateQuiz();
        }, [slug]);

    return { questions, loading };
}