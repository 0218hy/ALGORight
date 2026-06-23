export interface AlgoMultipleChoiceOption {
    id: 'A' | 'B' | 'C' | 'D';
    text: string;
  }
  
  export interface AlgoQuizQuestion {
    type: 'mechanics' | 'runtime' | 'space' | 'stability' | 'edge_case';
    question_text: string;
    options: AlgoMultipleChoiceOption[];
    correct_option_id: 'A' | 'B' | 'C' | 'D';
    explanation: string;
  }
  
  export interface AlgoQuizAttemptDetail {
    question_number: number;
    question_type: 'mechanics' | 'runtime' | 'space' | 'stability' | 'edge_case';
    user_answer: 'A' | 'B' | 'C' | 'D';
    correct_answer: 'A' | 'B' | 'C' | 'D';
    is_correct: boolean;
  }
  
  export interface AlgoQuizAttempt {
    algorithm_id: string;
    score: number;
    details: AlgoQuizAttemptDetail[];
  }