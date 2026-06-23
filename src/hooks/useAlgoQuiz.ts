import { useEffect, useState } from "react";
import { AlgoQuizQuestion } from "../types/algoQuiz";
import { generateAlgoQuiz, getAlgoQuizById } from "../lib/queries/algoQuiz";
import { getAlgorithmNameById } from "../lib/queries/algorithms";
import { Alert } from "react-native";
import { Href, router } from "expo-router";

export function useAlgoQuiz(id: string | undefined) {
    const [questions, setQuestions] = useState<AlgoQuizQuestion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [algoTitle, setAlgoTitle] = useState<string>("");

    useEffect(() => {
        const fetchOrGenerateQuiz = async () => {
            if (!id) return;

            try {
                setLoading(true);

                let quizData = await getAlgoQuizById(id);
                let algoName = await getAlgorithmNameById(id);
                setAlgoTitle(algoName);
                
                if (!quizData) {
                    console.log("No cached quiz found. Generating quiz about this algorithm ...");

                    quizData = await generateAlgoQuiz(
                        id, algoName
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
                router.push(`/(user)/algorithm` as Href);
            } finally {
                setLoading(false);
            }
        };

        fetchOrGenerateQuiz();
    }, [id]);

    return { questions, loading, algoTitle };
}