import { supabase } from '../supabase';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface MultipleChoiceOption {
  id: 'A' | 'B' | 'C';
  text: string;
}

export interface QuizQuestion {
  type: 'approach' | 'runtime' | 'space';
  question_text: string;
  options: MultipleChoiceOption[];
  correct_option_id: 'A' | 'B' | 'C';
  explanation: string;
}

export interface LeetCodeQuestion {
    id: string;
    leetcode_slug: string;
    difficulty: Difficulty;
    tags: string[];
    title: string;
    description: string;
    metadata_json?: any;
}

export interface QuizAttemptDetail {
  question_number: number;
  question_type: 'approach' | 'runtime' | 'space';
  user_answer: 'A' | 'B' | 'C';
  correct_answer: 'A' | 'B' | 'C';
  is_correct: boolean;
}

export interface QuizAttempt {
  leetcode_slug: string;
  score: number;
  details: QuizAttemptDetail[];
}

export const getQuestionBySlug = async (leetcode_slug: string): Promise<LeetCodeQuestion | null> => {
    const { data, error } = await supabase
      .from('challenge_leetcode')
      .select('*')
      .eq('leetcode_slug', leetcode_slug)
      .maybeSingle();
  
    if (error) {
      console.error('Database fetch by slug failed:', error);
      throw error;
    }

    return data as LeetCodeQuestion | null;
};

export const getQuizBySlug = async (leetcode_slug: string): Promise<QuizQuestion[] | null> => {
  const { data, error } = await supabase
    .from('challenge_quizzes')
    .select('quiz_json')
    .eq('leetcode_slug', leetcode_slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to get quizzes:", error);
    return null;
  }
  return data?.quiz_json as QuizQuestion[] | null;
};

export const getQuestionsFromDB = async (difficulty: Difficulty, tag: string): Promise<LeetCodeQuestion[]> => {
  // to handle all tag
  let query = supabase
    .from('challenge_leetcode')
    .select('*')
    .eq('difficulty', difficulty); 
  
  // if the tag if not all
  if (tag.toLowerCase() !== 'all') {
    query = query.contains('tags', [tag.toLowerCase()]);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Database fetch failed:', error);
    throw error;
  }
  
  return (data as LeetCodeQuestion[]) || [];
};

export const fetchFromApi = async (difficulty: Difficulty, tag: string): Promise<string | null> => {
  try {
      console.log('Getting Leetcode question...');

      const { data, error } = await supabase.functions.invoke('get_leetcode_problem', {
          body: { difficulty, tag },
      });

      if (error) throw error;

      return data?.leetcode_slug || null;
      
  } catch (err) {
      console.error("Failed to get Leetcode question:", err);
      throw err;
  }
};

export const generateQuiz = async (
  leetcode_slug: string,
  title: string,
  description: string
): Promise<QuizQuestion[] | null> => {
  try{
    console.log(`Generating quiz for ${leetcode_slug}`);

    const {data, error} = await supabase.functions.invoke('generate-leetcode-quiz', {
      body: {leetcode_slug, title, description}
    });
    if (error) throw error;

    return  data?.questions || null;
  } catch (err) {
    console.error("Failed to execute separate quiz function:", err);
    throw err;
  }
}

export const saveQuizAttempt = async (payload: QuizAttempt): Promise<void> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("No authenticated user session found.");

    const { data: attemptData, error: attemptError } = await supabase
      .from('challenge_attempts')
      .insert({
        user_id: user.id,
        leetcode_slug: payload.leetcode_slug,
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
      .from('challenge_attempt_details')
      .insert(detailRows);

    if (detailsError) throw detailsError;
  } catch (err) {
    console.error("Failed to save quiz attempt history:", err);
  }
}