import { supabase } from '../../supabase'
import { fetchUserProfile, signIn, SignOut, signUp } from '../auth'

jest.mock('../../supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(),
  },
}))

const mockUser = {
  id: 'user-1',
  email: 'test@test.com',
}

const mockProfile = {
  username: 'algoright12',
  total_xp: 225,
  current_level: 2,
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('signUp', () => {
  it('signs up a new user with email and password', async () => {
    ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    const result = await signUp('test@test.com', 'password123')

    expect(result.data).toEqual({ user: mockUser })
    expect(result.error).toBeNull()
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123',
    })
  })

  it('returns error when sign up fails', async () => {
    const mockError = { message: 'Email already registered' }
    ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: null,
      error: mockError,
    })

    const result = await signUp('existing@test.com', 'password123')

    expect(result.error).toEqual(mockError)
  })
})

describe('signIn', () => {
  it('signs in with correct credentials', async () => {
    ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    const result = await signIn('test@test.com', 'password123')

    expect(result.data).toEqual({ user: mockUser })
    expect(result.error).toBeNull()
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123',
    })
  })

  it('returns error for wrong credentials', async () => {
    const mockError = { message: 'Invalid login credentials' }
    ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: null,
      error: mockError,
    })

    const result = await signIn('test@test.com', 'wrongpassword')

    expect(result.error).toEqual(mockError)
    expect(result.data).toBeNull()
  })
})

describe('SignOut', () => {
  it('signs out current user', async () => {
    ;(supabase.auth.signOut as jest.Mock).mockResolvedValue({
      error: null,
    })

    const result = await SignOut()

    expect(result.error).toBeNull()
    expect(supabase.auth.signOut).toHaveBeenCalled()
  })

  it('returns error when sign out fails', async () => {
    const mockError = { message: 'Sign out failed' }
    ;(supabase.auth.signOut as jest.Mock).mockResolvedValue({
      error: mockError,
    })

    const result = await SignOut()

    expect(result.error).toEqual(mockError)
  })
})

describe('fetchUserProfile', () => {
  const createSingleQuery = (response: any) => {
    const query: any = {
      select: jest.fn(() => query),
      eq: jest.fn(() => query),
      single: jest.fn().mockResolvedValue(response),
    }
    return query
  }

  it('fetches user profile for valid user ID', async () => {
    const query = createSingleQuery({ data: mockProfile, error: null })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    const result = await fetchUserProfile('user-1')

    expect(result.data).toEqual(mockProfile)
    expect(result.error).toBeNull()
    expect(supabase.from).toHaveBeenCalledWith('profiles')
    expect(query.select).toHaveBeenCalledWith('username, total_xp, current_level')
    expect(query.eq).toHaveBeenCalledWith('id', 'user-1')
    expect(query.single).toHaveBeenCalled()
  })

  it('returns error when profile not found', async () => {
    const mockError = { message: 'No rows found' }
    const query = createSingleQuery({ data: null, error: mockError })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    const result = await fetchUserProfile('invalid-id')

    expect(result.data).toBeNull()
    expect(result.error).toEqual(mockError)
  })

  it('queries correct table and columns', async () => {
    const query = createSingleQuery({ data: mockProfile, error: null })
    ;(supabase.from as jest.Mock).mockReturnValue(query)

    await fetchUserProfile('user-1')

    expect(supabase.from).toHaveBeenCalledWith('profiles')
    expect(query.select).toHaveBeenCalledWith('username, total_xp, current_level')
  })
})