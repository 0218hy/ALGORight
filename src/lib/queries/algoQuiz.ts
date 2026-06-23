import { AlgoQuizAttempt, AlgoQuizQuestion } from "@/src/types/algoQuiz";
import { supabase } from "../supabase";


export const getAlgoQuizById = async (algorithm_id: string): Promise<AlgoQuizQuestion[] | null> => {
  const { data, error } = await supabase
    .from('algorithm_quizzes')
    .select('quiz_json')
    .eq('algorithm_id', algorithm_id)
    .maybeSingle();

  if (error) {
    console.error("Failed to get quizzes:", error);
    return null;
  }
  return data?.quiz_json as AlgoQuizQuestion[] | null;
};

export const generateAlgoQuiz = async (
  algorithm_id: string,
  algorithm_name: string
): Promise<AlgoQuizQuestion[] | null> => {
  try{
    console.log(`Generating quiz for ${algorithm_name}`);

    const {data, error} = await supabase.functions.invoke('generate-algorithm-quiz', {
      body: {algorithm_id, algorithm_name}
    });
    if (error) throw error;

    return  data?.questions || null;
  } catch (err) {
    console.error("Failed to execute separate quiz function:", err);
    throw err;
  }
}

export const saveAlgoQuizAttempt = async (payload: AlgoQuizAttempt): Promise<void> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("No authenticated user session found.");

    const { data: attemptData, error: attemptError } = await supabase
      .from('algorithm_attempts')
      .insert({
        user_id: user.id,
        algorithm_id: payload.algorithm_id,
        score: payload.score,
      })
      .select('id')
      .single();

    if (attemptError) throw attemptError;

    const detailRows = payload.details.map((detail) => ({
      attempt_id: attemptData.id,
      question_number: detail.question_number,
      question_type: detail.question_type,
      user_answer: detail.user_answer,
      correct_answer: detail.correct_answer,
      is_correct: detail.is_correct,
    }));

    const { error: detailsError } = await supabase
      .from('algorithm_attempt_details')
      .insert(detailRows);

    if (detailsError) throw detailsError;
  } catch (err) {
    console.error("Failed to save quiz attempt history:", err);
  }
}
  