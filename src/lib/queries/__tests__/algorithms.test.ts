import { supabase } from '../../supabase'
import { getAlgorithmById, getAlgorithmNameById, getAlgorithms } from '../algorithms'

jest.mock('../../supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

const mockAlgorithms = [
  {
    id: 'algo-1',
    title: 'Bubble Sort',
    category: 'sorting',
    difficulty: 'beginner',
    description: 'A simple sorting algorithm',
    xp_threshold: 0,
    unlock_order: 1,
  },
  {
    id: 'algo-2',
    title: 'Selection Sort',
    category: 'sorting',
    difficulty: 'beginner',
    description: 'Another sorting algorithm',
    xp_threshold: 200,
    unlock_order: 2,
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

const createSingleQuery = (response: any) => {
  const query: any = {
    select: jest.fn(() => query),
    eq: jest.fn(() => query),
    single: jest.fn().mockResolvedValue(response),
  }
  return query
}

const createMaybeSingleQuery = (response: any) => {
  const query: any = {
    select: jest.fn(() => query),
    eq: jest.fn(() => query),
    maybeSingle: jest.fn().mockResolvedValue(response),
  }
  return query
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})  // suppress console.error
})

afterEach(() => {
  jest.restoreAllMocks()  // restore after each test
})

describe('getAlgorithms', () => {
  it('fetches all algorithms', async () => {
    const query = createListQuery({ data: mockAlgorithms, error: null })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    const result = await getAlgorithms()

    expect(result.data).toEqual(mockAlgorithms)
    expect(result.error).toBeNull()
    expect(supabase.from).toHaveBeenCalledWith('algorithms')
    expect(query.select).toHaveBeenCalledWith('*')
  })

  it('orders by category ascending', async () => {
    const query = createListQuery({ data: mockAlgorithms, error: null })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    await getAlgorithms()

    expect(query.order).toHaveBeenCalledWith('category', { ascending: true })
  })

  it('returns empty array when no algorithms found', async () => {
    const query = createListQuery({ data: [], error: null })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    const result = await getAlgorithms()

    expect(result.data).toEqual([])
    expect(result.error).toBeNull()
  })

  it('returns error when query fails', async () => {
    const mockError = { message: 'Database error' }
    const query = createListQuery({ data: null, error: mockError })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    const result = await getAlgorithms()

    expect(result.data).toBeNull()
    expect(result.error).toEqual(mockError)
  })
})

describe('getAlgorithmById', () => {
  it('fetches correct algorithm by ID', async () => {
    const query = createSingleQuery({ data: mockAlgorithms[0], error: null })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    const result = await getAlgorithmById('algo-1')

    expect(result.data).toEqual(mockAlgorithms[0])
    expect(result.error).toBeNull()
    expect(supabase.from).toHaveBeenCalledWith('algorithms')
    expect(query.eq).toHaveBeenCalledWith('id', 'algo-1')
    expect(query.single).toHaveBeenCalled()
  })

  it('returns error when algorithm not found', async () => {
    const mockError = { message: 'No rows found' }
    const query = createSingleQuery({ data: null, error: mockError })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    const result = await getAlgorithmById('invalid-id')

    expect(result.data).toBeNull()
    expect(result.error).toEqual(mockError)
  })

  it('queries correct table', async () => {
    const query = createSingleQuery({ data: mockAlgorithms[0], error: null })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    await getAlgorithmById('algo-1')

    expect(supabase.from).toHaveBeenCalledWith('algorithms')
  })
})

describe('getAlgorithmNameById', () => {
  it('returns algorithm title for valid ID', async () => {
    const query = createMaybeSingleQuery({ data: { title: 'Bubble Sort' }, error: null })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    const result = await getAlgorithmNameById('algo-1')

    expect(result).toBe('Bubble Sort')
    expect(query.select).toHaveBeenCalledWith('title')
    expect(query.eq).toHaveBeenCalledWith('id', 'algo-1')
  })

  it('throws error when algorithm not found', async () => {
    const query = createMaybeSingleQuery({ data: null, error: null })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    await expect(getAlgorithmNameById('invalid-id')).rejects.toThrow(
      'Failed to fetch algorithm name'
    )
  })

  it('throws error when query fails', async () => {
    const mockError = { message: 'Database error' }
    const query = createMaybeSingleQuery({ data: null, error: mockError })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    await expect(getAlgorithmNameById('algo-1')).rejects.toThrow(
      'Failed to fetch algorithm name'
    )
  })
})