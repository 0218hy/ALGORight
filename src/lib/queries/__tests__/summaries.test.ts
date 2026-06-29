import { supabase } from '../../supabase'
import { getAlgorithmSummary } from '../summaries'

jest.mock('../../supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

const mockSummary = {
  id: 'summary-1',
  algorithm_id: 'algo-1',
  content: 'Bubble Sort is a simple sorting algorithm.',
  how_it_works: '["Compare adjacent elements", "Swap if needed"]',
  key_points: ['Simple', 'O(n²) time'],
  when_to_use: 'Small datasets',
  time_complexity: 'O(n²)',
  space_complexity: 'O(1)',
}

const createSingleQuery = (response: any) => {
  const query: any = {
    select: jest.fn(() => query),
    eq: jest.fn(() => query),
    single: jest.fn().mockResolvedValue(response),
  }
  return query
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getAlgorithmSummary', () => {
  it('fetches summary for a valid algorithm ID', async () => {
    const query = createSingleQuery({ data: mockSummary, error: null })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    const result = await getAlgorithmSummary('algo-1')

    expect(result.data).toEqual(mockSummary)
    expect(result.error).toBeNull()
    expect(supabase.from).toHaveBeenCalledWith('algorithm_summaries')
    expect(query.select).toHaveBeenCalledWith('*')
    expect(query.eq).toHaveBeenCalledWith('algorithm_id', 'algo-1')
    expect(query.single).toHaveBeenCalled()
  })

  it('returns error when summary not found', async () => {
    const mockError = { message: 'No rows found' }
    const query = createSingleQuery({ data: null, error: mockError })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    const result = await getAlgorithmSummary('invalid-id')

    expect(result.data).toBeNull()
    expect(result.error).toEqual(mockError)
  })

  it('queries the correct table', async () => {
    const query = createSingleQuery({ data: mockSummary, error: null })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    await getAlgorithmSummary('algo-1')

    expect(supabase.from).toHaveBeenCalledWith('algorithm_summaries')
  })

  it('filters by algorithm_id', async () => {
    const query = createSingleQuery({ data: mockSummary, error: null })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    await getAlgorithmSummary('algo-1')

    expect(query.eq).toHaveBeenCalledWith('algorithm_id', 'algo-1')
  })
})