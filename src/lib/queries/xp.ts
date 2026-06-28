import { supabase } from '../supabase'
import { calculateChallengeXP, calculateLevel, calculateQuizXP, calculateStreakBonus } from '../xp'

// Get user profile (XP, level, streak) to display on dashboard 
export const getUserProfile = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) throw new Error('No authenticated user')

  const { data, error } = await supabase
    .from('profiles')
    .select('total_xp, current_level, streak_count, last_active, username')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

// Get all algorithms with unlock status for this user 
// combine 3 queries (get user total XP, get all algo with threshold, get algo user ady unlocked)
export const getAlgorithmsWithUnlockStatus = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) throw new Error('No authenticated user')

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('total_xp')
    .eq('id', user.id)
    .single()

  if (profileError) throw profileError

  const { data: algorithms, error: algoError } = await supabase
    .from('algorithms')
    .select('id, title, difficulty, unlock_order, xp_threshold')
    .order('unlock_order', { ascending: true })

  if (algoError) throw algoError

  const { data: unlocks, error: unlockError } = await supabase
    .from('algorithm_unlocks')
    .select('algorithm_id')
    .eq('user_id', user.id)

  if (unlockError) throw unlockError

  const unlockedIds = new Set(unlocks?.map(u => u.algorithm_id) ?? [])

  // for each algo, add boolean is_unlocked, how much XP still needed, 0 if unlocked) 
  return algorithms.map(algo => ({
    ...algo,
    is_unlocked: algo.xp_threshold === 0 || unlockedIds.has(algo.id),
    xp_needed: Math.max(algo.xp_threshold - (profile?.total_xp ?? 0), 0),
  }))
}

// Get next locked algorithm 
// used for Progress Bar 
export const getNextLockedAlgorithm = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) throw new Error('No authenticated user')

  const { data: profile } = await supabase
    .from('profiles')
    .select('total_xp')
    .eq('id', user.id)
    .single()

  const { data, error } = await supabase
    .from('algorithms')
    .select('id, title, xp_threshold, unlock_order')
    .gt('xp_threshold', 0)
    .order('unlock_order', { ascending: true })

  if (error) throw error

  const totalXP = profile?.total_xp ?? 0
  const nextLocked = data?.find(algo => !isAlgorithmUnlocked(algo.xp_threshold, totalXP))
  return nextLocked ?? null
}

const isAlgorithmUnlocked = (threshold: number, totalXP: number) => {
  return threshold === 0 || totalXP >= threshold
}

// CORE LOGIC: award XP and update profile 
// called by awardQuizXP, awardChallengeXP, update Streak
export const awardXP = async (
  xpEarned: number,
  reason: string,
  sourceType: 'quiz' | 'challenge' | 'streak'
) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) throw new Error('No authenticated user')

  // get current total_xp from current profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('total_xp, current_level')
    .eq('id', user.id)
    .single()

  if (profileError) throw profileError

  //add XP earned -> newXP 
  const oldXP = profile.total_xp ?? 0
  const newXP = oldXP + xpEarned
  const newLevel = calculateLevel(newXP)

  // update profile XP and level
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      total_xp: newXP,
      current_level: newLevel,
    })
    .eq('id', user.id)

  if (updateError) throw updateError

  // log XP event (for every XP transaction) 
  const { error: eventError } = await supabase
    .from('xp_events')
    .insert({
      user_id: user.id,
      amount: xpEarned,
      reason,
    })

  if (eventError) throw eventError

  // check and unlock algorithms
  await checkAndUnlockAlgorithms(user.id, newXP)

  return { oldXP, newXP, newLevel, xpEarned }
}

// Check and unlock algorithms based on new XP 
// called inside awardXP 
const checkAndUnlockAlgorithms = async (userId: string, totalXP: number) => {
  // get all algorithms that should be unlocked
  const { data: algorithms, error } = await supabase
    .from('algorithms')
    .select('id, xp_threshold')
    .gt('xp_threshold', 0)
    .lte('xp_threshold', totalXP)

  if (error) throw error

  // get already unlocked algorithms
  const { data: existing } = await supabase
    .from('algorithm_unlocks')
    .select('algorithm_id')
    .eq('user_id', userId)

  const existingIds = new Set(existing?.map(u => u.algorithm_id) ?? [])

  // insert new unlocks
  const newUnlocks = algorithms
    ?.filter(algo => !existingIds.has(algo.id))
    .map(algo => ({
      user_id: userId,
      algorithm_id: algo.id,
    })) ?? []

  if (newUnlocks.length > 0) {
    await supabase.from('algorithm_unlocks').insert(newUnlocks)
  }

  return newUnlocks
}

// Award quiz XP (handles reattempt — only award difference) 
export const awardQuizXP = async (
  algorithmId: string,
  score: number,
) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

  const xpEarned = calculateQuizXP(score)

  // get best previous attempt
  const { data: previous } = await supabase
    .from('algorithm_attempts')
    .select('xp_earned')
    .eq('user_id', user.id)
    .eq('algorithm_id', algorithmId)
    .order('xp_earned', { ascending: false })
    .limit(1)
    .maybeSingle()

  const previousBest = previous?.xp_earned ?? 0
  const xpDiff = Math.max(xpEarned - previousBest, 0)

  // award only the difference
  if (xpDiff > 0) {
    await awardXP(xpDiff, `Quiz: algorithm ${algorithmId}`, 'quiz')
  }

  return { xpEarned, previousBest, xpDiff }
}

// Award challenge XP (handles reattempt) 
export const awardChallengeXP = async (
  leetcodeSlug: string,
  score: number,
  difficulty: 'Easy' | 'Medium' | 'Hard'
) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

  const xpEarned = calculateChallengeXP(score, difficulty)

  // get best previous attempt
  const { data: previous } = await supabase
    .from('challenge_attempts')
    .select('xp_earned')
    .eq('user_id', user.id)
    .eq('leetcode_slug', leetcodeSlug)
    .order('xp_earned', { ascending: false })
    .limit(1)
    .maybeSingle()

  const previousBest = previous?.xp_earned ?? 0
  const xpDiff = Math.max(xpEarned - previousBest, 0)

  if (xpDiff > 0) {
    await awardXP(xpDiff, `Challenge: ${leetcodeSlug}`, 'challenge')
  }

  return { xpEarned, previousBest, xpDiff }
}

// Update streak and award streak bonus XP 
// called every time user opens the app (compare current date with last_active)
export const updateStreak = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No authenticated user')

  const { data: profile } = await supabase
    .from('profiles')
    .select('streak_count, last_active')
    .eq('id', user.id)
    .single()

  const today = new Date().toISOString().split('T')[0]
  const lastActive = profile?.last_active
  const streak = profile?.streak_count ?? 0

  // already updated today
  if (lastActive === today) return { streak, bonusXP: 0 }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  const newStreak = lastActive === yesterdayStr ? streak + 1 : 1
  const bonusXP = calculateStreakBonus(newStreak)

  // update streak
  await supabase
    .from('profiles')
    .update({
      streak_count: newStreak,
      last_active: today,
    })
    .eq('id', user.id)

  // award streak bonus XP
  await awardXP(bonusXP, `Streak day ${newStreak}`, 'streak')

  return { streak: newStreak, bonusXP }
}

// Get best quiz score for an algorithm 
// used for personalised recommendations 
export const getBestQuizScore = async (algorithmId: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('algorithm_attempts')
    .select('score, xp_earned')
    .eq('user_id', user.id)
    .eq('algorithm_id', algorithmId)
    .order('score', { ascending: false })
    .limit(1)
    .maybeSingle()

  return data ?? null
}

export const getRecommendedChallenge = async (totalXP: number) => {
  const difficulty = totalXP < 100 ? 'Easy' : totalXP < 300 ? 'Medium' : 'Hard'

  const { data, error } = await supabase
    .from('challenge_leetcode')
    .select('title, leetcode_slug, difficulty, tags')
    .eq('difficulty', difficulty)
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data ?? null
}