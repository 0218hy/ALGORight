import { supabase } from '../supabase';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface LeetCodeQuestion {
    id: string;
    leetcode_slug: string;
    difficulty: Difficulty;
    tags: string[];
    title: string;
    description: string;
    metadata_json?: any;
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

export const getQuestionFromDB = async (difficulty: Difficulty, tag: string): Promise<LeetCodeQuestion | null> => {
  // to handle all tag
  let query = supabase
    .from('challenge_leetcode')
    .select('*')
    .eq('difficulty', difficulty); 
  
  // if the tag if not all
  if (tag.toLowerCase() !== 'all') {
    query = query.contains('tags', [tag.toLowerCase()]);
  }

  const { data, error } = await query.limit(1).maybeSingle();

  if (error) {
    console.error('Database fetch failed:', error);
    throw error;
  }
  
  return data as LeetCodeQuestion | null;
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