import { supabase } from '../supabase';
import { 
    Difficulty, 
    LeetcodeQuestion, 
    LeetcodeQuizQuestion, 
    LeetcodeQuizAttempt 
  } from '@/src/types/leetcode';

export const getLeetcodeQuestionBySlug = async (leetcode_slug: string): Promise<LeetcodeQuestion | null> => {
    const { data, error } = await supabase
      .from('challenge_leetcode')
      .select('*')
      .eq('leetcode_slug', leetcode_slug)
      .maybeSingle();
  
    if (error) {
      console.error('Database fetch by slug failed:', error);
      throw error;
    }

    return data as LeetcodeQuestion | null;
};

export const getLeetcodeQuizBySlug = async (leetcode_slug: string): Promise<LeetcodeQuizQuestion[] | null> => {
  const { data, error } = await supabase
    .from('challenge_quizzes')
    .select('quiz_json')
    .eq('leetcode_slug', leetcode_slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to get quizzes:", error);
    return null;
  }
  return data?.quiz_json as LeetcodeQuizQuestion[] | null;
};

export const getLeetcodeQuestionsFromDB = async (difficulty: Difficulty, tag: string): Promise<LeetcodeQuestion[]> => {
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
  
  return (data as LeetcodeQuestion[]) || [];
};

export const fetchLeetcodeFromApi = async (difficulty: Difficulty, tag: string): Promise<string | null> => {
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

export const generateLeetcodeQuiz = async (
  leetcode_slug: string,
  title: string,
  description: string
): Promise<LeetcodeQuizQuestion[] | null> => {
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

export const saveLeetcodeQuizAttempt = async (payload: LeetcodeQuizAttempt): Promise<void> => {
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