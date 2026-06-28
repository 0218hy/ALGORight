import {
  fetchLeetcodeFromApi,
  generateLeetcodeQuiz,
  getLeetcodeQuestionBySlug,
  getLeetcodeQuizBySlug,
  getLeetcodeQuestionsFromDB,
} from '../leetcode';
import { supabase } from '../../supabase';

// mock Supabase
jest.mock('../../supabase', () => ({
  supabase: {
    from: jest.fn(),
    functions: {
      invoke: jest.fn(),
    },
  },
}));

// fake test data
const mockProblem = {
  id: 'problem-1',
  leetcode_slug: 'two-sum',
  difficulty: 'Easy',
  tags: ['array'],
  title: 'Two Sum',
  description: 'Find two numbers that add up to target.',
};

const mockQuiz = [
  {
    type: 'approach',
    question_text: 'What is the optimal strategy?',
    options: [
      { id: 'A', text: 'Hash map' },
      { id: 'B', text: 'Sorting only' },
      { id: 'C', text: 'Nested loops' },
    ],
    correct_option_id: 'A',
    explanation: 'A hash map gives average O(n) lookup behavior.',
  },
];

const createMaybeSingleQuery = (response) => {
  const query = {
    select: jest.fn(() => query),
    eq: jest.fn(() => query),
    maybeSingle: jest.fn().mockResolvedValue(response),
  };

  return query;
};

const createListQuery = (response) => {
  const query = {
    select: jest.fn(() => query),
    eq: jest.fn(() => query),
    contains: jest.fn(() => query),
    then: (resolve) => Promise.resolve(response).then(resolve), // bahve like awaited supabase query
  };

  return query;
};
 
// replace with empty fake function
beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

// restore it back after test 
afterEach(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

describe('leetcode query functions', () => {
  it('fetches one LeetCode problem by slug', async () => {
    const query = createMaybeSingleQuery({ data: mockProblem, error: null });
    supabase.from.mockReturnValue(query);

    const result = await getLeetcodeQuestionBySlug('two-sum');

    expect(result).toEqual(mockProblem);
    expect(supabase.from).toHaveBeenCalledWith('challenge_leetcode');
    expect(query.select).toHaveBeenCalledWith('*');
    expect(query.eq).toHaveBeenCalledWith('leetcode_slug', 'two-sum');
    expect(query.maybeSingle).toHaveBeenCalled();
  });

  it('returns cached quiz JSON by slug', async () => {
    const query = createMaybeSingleQuery({
      data: { quiz_json: mockQuiz },
      error: null,
    });
    supabase.from.mockReturnValue(query);

    const result = await getLeetcodeQuizBySlug('two-sum');

    expect(result).toEqual(mockQuiz);
    expect(supabase.from).toHaveBeenCalledWith('challenge_quizzes');
    expect(query.select).toHaveBeenCalledWith('quiz_json');
    expect(query.eq).toHaveBeenCalledWith('leetcode_slug', 'two-sum');
  });

  it('filters problems by difficulty and tag', async () => {
    const query = createListQuery({ data: [mockProblem], error: null });
    supabase.from.mockReturnValue(query);

    const result = await getLeetcodeQuestionsFromDB('Easy', 'Array');

    expect(result).toEqual([mockProblem]);
    expect(supabase.from).toHaveBeenCalledWith('challenge_leetcode');
    expect(query.eq).toHaveBeenCalledWith('difficulty', 'Easy');
    expect(query.contains).toHaveBeenCalledWith('tags', ['array']);
  });

  it('does not apply tag filtering when tag is All', async () => {
    const query = createListQuery({ data: [mockProblem], error: null });
    supabase.from.mockReturnValue(query);

    await getLeetcodeQuestionsFromDB('Easy', 'All');

    expect(query.contains).not.toHaveBeenCalled();
  });

  it('invokes the LeetCode problem Edge Function', async () => {
    supabase.functions.invoke.mockResolvedValue({
      data: { leetcode_slug: 'two-sum' },
      error: null,
    });

    const result = await fetchLeetcodeFromApi('Easy', 'Array');

    expect(result).toBe('two-sum');
    expect(supabase.functions.invoke).toHaveBeenCalledWith(
      'get_leetcode_problem',
      { body: { difficulty: 'Easy', tag: 'Array' } }
    );
  });

  it('invokes the LeetCode quiz generation Edge Function', async () => {
    supabase.functions.invoke.mockResolvedValue({
      data: { questions: mockQuiz },
      error: null,
    });

    const result = await generateLeetcodeQuiz(
      'two-sum',
      'Two Sum',
      'Find two numbers that add up to target.'
    );

    expect(result).toEqual(mockQuiz);
    expect(supabase.functions.invoke).toHaveBeenCalledWith(
      'generate-leetcode-quiz',
      {
        body: {
          leetcode_slug: 'two-sum',
          title: 'Two Sum',
          description: 'Find two numbers that add up to target.',
        },
      }
    );
  });
});
