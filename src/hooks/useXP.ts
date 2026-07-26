import { useEffect, useState } from 'react'
import {
  getAlgorithmsWithUnlockStatus,
  getNextLockedAlgorithm,
  getRecommendedChallenge,
  getUserProfile,
} from '../lib/queries/xp'
import { calculateXPProgress } from '../lib/xp'

interface Profile {
  total_xp: number
  current_level: number
  streak_count: number
  last_active: string
  username: string
}

interface AlgorithmWithStatus {
  id: string
  title: string
  difficulty: string
  unlock_order: number
  xp_threshold: number
  is_unlocked: boolean
  xp_needed: number
  best_score: number | null  
  attempted: boolean          
  description: string | null  
  category: string 
}

interface NextLocked {
  id: string
  title: string
  xp_threshold: number
  unlock_order: number
}

interface XPProgress {
  level: number
  current: number
  next: number
  progress: number
  xpToNext: number
}

interface RecommendedChallenge {
  title: string
  leetcode_slug: string
  difficulty: string
  tags: string[]
}

export const useXP = () => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [algorithms, setAlgorithms] = useState<AlgorithmWithStatus[]>([])
  const [nextLocked, setNextLocked] = useState<NextLocked | null>(null)
  const [xpProgress, setXPProgress] = useState<XPProgress | null>(null)
  const [recommendedChallenge, setRecommendedChallenge] = useState<RecommendedChallenge | null>(null) 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = async () => {
    try {
      setLoading(true)

      const [profileData, algorithmsData, nextLockedData] = await Promise.all([
        getUserProfile(),
        getAlgorithmsWithUnlockStatus(),
        getNextLockedAlgorithm(),
      ])

      setProfile(profileData)
      setAlgorithms(algorithmsData)
      setNextLocked(nextLockedData)
      setXPProgress(calculateXPProgress(profileData.total_xp))

      // fetch recommended challenge based on real XP
      const challengeData = await getRecommendedChallenge(profileData.total_xp ?? 0)
      setRecommendedChallenge(challengeData) 

    } catch (err) {
      console.error('useXP error:', err)
      setError('Failed to load XP data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  // call this after quiz or challenge completes to refresh dashboard
  const refresh = () => fetchAll()

  return {
    profile,
    algorithms,
    nextLocked,
    xpProgress,
    recommendedChallenge,
    loading,
    error,
    refresh,
  }
} 

