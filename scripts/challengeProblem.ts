import { supabase } from "@/src/lib/supabase";

const leetcodeApiUrl = process.env.EXPO_PUBLIC_LEETCODE_API_URL

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface LeetCodeQuestion {
    id?: string;
    leetcode_slug: string;
    difficulty: Difficulty;
    tags: string[];
    title: string;
    description?: string | null;
    metadata_json?: any;
}

export const fetchFromApi = async (difficulty: Difficulty, tag: string): Promise<string | null> => {
    console.log('getting question from LeetCode API')
    let url = '';

    // to handle all keyword
    if (tag.toLowerCase() === 'all') {
        url = `${leetcodeApiUrl}/problems?difficulty=${difficulty.toUpperCase()}`;
    } else {
        url = `${leetcodeApiUrl}/problems?tags=${tag.toLowerCase()}&limit=20`;
    }

    const problemResponse = await fetch(url);
    const problemApiData = await problemResponse.json();
    const fetchedProblems = problemApiData.problemsetQuestionList || [];

    // find first problem that match
    const matchingProblem = fetchedProblems.find(
        (p: any) => p.difficulty.toLowerCase() === difficulty.toLowerCase()
    );
    
    if (!matchingProblem) {
        return null;
    }

    // getting details of matching problem
    console.log(`getting question details for: ${matchingProblem.titleSlug}`)
    const detailResponse = await fetch(`${leetcodeApiUrl}/select?titleSlug=${matchingProblem.titleSlug}`);
    const detailApiData = await detailResponse.json();

    const leetcode_problem = {
        leetcode_slug: matchingProblem.titleSlug,
        title: matchingProblem.title,
        difficulty: matchingProblem.difficulty as Difficulty,
        tags: matchingProblem.topicTags.map((t: any) => t.slug),
        description: detailApiData.question,
        metadata_json: {
            hints: detailApiData.hints ?? []
        }
    };

    const { data: savedData, error: insertError } = await supabase
    .from('challenge_leetcode')
    .upsert(leetcode_problem, { onConflict: 'leetcode_slug'})
    .select()
    .single();

    if (insertError) {
    console.error('Failed to save leetcode question to database:', insertError);
    throw insertError;
    }

    return savedData.leetcode_slug;
}