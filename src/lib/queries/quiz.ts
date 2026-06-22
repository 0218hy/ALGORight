import { supabase } from "../supabase";

export interface MultipleChoiceOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface QuizQuestion {
  type: 'mechanics' | 'runtime' | 'space' | 'stability' | 'edge_case';
  question_text: string;
  options: MultipleChoiceOption[];
  correct_option_id: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface QuizAttemptDetail {
    question_number: number;
    question_type: 'mechanics' | 'runtime' | 'space' | 'stability' | 'edge_case';
    user_answer: 'A' | 'B' | 'C' | 'D';
    correct_answer: 'A' | 'B' | 'C' | 'D';
    is_correct: boolean;
}
  
export interface QuizAttempt {
    algorithm_id: string;
    score: number;
    details: QuizAttemptDetail[];
}

export const getAlgoQuizById = async (algorithm_id: string): Promise<QuizQuestion[] | null> => {
  const { data, error } = await supabase
    .from('algorithm_quizzes')
    .select('quiz_json')
    .eq('algorithm_id', algorithm_id)
    .maybeSingle();

  if (error) {
    console.error("Failed to get quizzes:", error);
    return null;
  }
  return data?.quiz_json as QuizQuestion[] | null;
};

export const generateAlgoQuiz = async (
  algorithm_id: string,
  algorithm_name: string
): Promise<QuizQuestion[] | null> => {
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

export const saveAlgoQuizAttempt = async (payload: QuizAttempt): Promise<void> => {
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
  