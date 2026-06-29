import { supabase } from '../../supabase'
import { getFlashCards } from '../flashcards'

jest.mock('../../supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

const mockFlashcards = [
  {
    id: 'card-1',
    algorithm_id: 'algo-1',
    question: 'What is Bubble Sort?',
    answer: 'A sorting algorithm that swaps adjacent elements.',
    order_index: 1,
  },
  {
    id: 'card-2',
    algorithm_id: 'algo-1',
    question: 'What is the time complexity?',
    answer: 'O(n²)',
    order_index: 2,
  },
]

const createListQuery = (response: any) => {
  const query: any = {
    select: jest.fn(() => query),
    eq: jest.fn(() => query),
    order: jest.fn().mockResolvedValue(response),
  }
  return query
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getFlashCards', () => {
  it('fetches flashcards for a valid algorithm ID', async () => {
    const query = createListQuery({ data: mockFlashcards, error: null })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    const result = await getFlashCards('algo-1')

    expect(result.data).toEqual(mockFlashcards)
    expect(result.error).toBeNull()
    expect(supabase.from).toHaveBeenCalledWith('flashcards')
    expect(query.select).toHaveBeenCalledWith('*')
    expect(query.eq).toHaveBeenCalledWith('algorithm_id', 'algo-1')
  })

  it('orders flashcards by order_index ascending', async () => {
    const query = createListQuery({ data: mockFlashcards, error: null })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    await getFlashCards('algo-1')

    expect(query.order).toHaveBeenCalledWith('order_index', { ascending: true })
  })

  it('queries the correct table', async () => {
    const query = createListQuery({ data: mockFlashcards, error: null })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    await getFlashCards('algo-1')

    expect(supabase.from).toHaveBeenCalledWith('flashcards')
  })

  it('returns empty array when no flashcards found', async () => {
    const query = createListQuery({ data: [], error: null })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    const result = await getFlashCards('algo-1')

    expect(result.data).toEqual([])
    expect(result.error).toBeNull()
  })

  it('returns error when query fails', async () => {
    const mockError = { message: 'Database error' }
    const query = createListQuery({ data: null, error: mockError })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    const result = await getFlashCards('invalid-id')

    expect(result.data).toBeNull()
    expect(result.error).toEqual(mockError)
  })
})