export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type LeetcodeTopicTag = 'All' | 'Sorting'

export interface LeetcodeFilterFormData {
  difficulty: Difficulty;
  topicTagSlug: LeetcodeTopicTag;
}

export interface LeetcodeQuestion {
  id: string;
  leetcode_slug: string;
  difficulty: Difficulty;
  tags: string[];
  title: string;
  description: string;
  metadata_json?: {
    hints?: string[];
    [key: string]: any;
  };
}

export interface LeetcodeMultipleChoiceOption {
  id: 'A' | 'B' | 'C';
  text: string;
}

export interface LeetcodeQuizQuestion {
  type: 'approach' | 'runtime' | 'space';
  question_text: string;
  options: LeetcodeMultipleChoiceOption[];
  correct_option_id: 'A' | 'B' | 'C';
  explanation: string;
}

export interface LeetcodeQuizAttemptDetail {
  question_number: number;
  question_type: 'approach' | 'runtime' | 'space';
  user_answer: 'A' | 'B' | 'C';
  correct_answer: 'A' | 'B' | 'C';
  is_correct: boolean;
}

export interface LeetcodeQuizAttempt {
  leetcode_slug: string;
  score: number;
  details: LeetcodeQuizAttemptDetail[];
}

