//This file is for XP Calculation Logic only 

// XP per correct answer
export const QUIZ_XP_PER_CORRECT = 10
export const EASY_XP_PER_CORRECT = 20
export const MEDIUM_XP_PER_CORRECT = 50
export const HARD_XP_PER_CORRECT = 70

// Level thresholds (index + 1 = level)
export const LEVEL_THRESHOLDS = [0, 100, 300, 700, 1500]

// Streak bonus XP
export const calculateStreakBonus = (streakCount: number): number => {
  if (streakCount >= 30) return 50
  if (streakCount >= 7)  return 25
  if (streakCount >= 3)  return 10
  return 5
}

// Quiz XP
export const calculateQuizXP = (score: number): number => {
  return score * QUIZ_XP_PER_CORRECT
}

// Challenge XP
export const calculateChallengeXP = (
  score: number,
  difficulty: 'Easy' | 'Medium' | 'Hard'
): number => {
  const xpPerCorrect = {
    Easy: EASY_XP_PER_CORRECT,
    Medium: MEDIUM_XP_PER_CORRECT,
    Hard: HARD_XP_PER_CORRECT,
  }
  return score * xpPerCorrect[difficulty]
}

// Level from total XP
export const calculateLevel = (totalXP: number): number => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) return i + 1
  }
  return 1
}

// Progress to next level
export const calculateXPProgress = (totalXP: number): {
  level: number
  current: number
  next: number
  progress: number
  xpToNext: number
} => {
  const level = calculateLevel(totalXP)
  const current = LEVEL_THRESHOLDS[level - 1]
  const next = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  const progress = Math.min((totalXP - current) / (next - current), 1)
  const xpToNext = Math.max(next - totalXP, 0)
  return { level, current, next, progress, xpToNext }
}

// Unlock progress to next algorithm
export const calculateUnlockProgress = (
  totalXP: number,
  nextThreshold: number
): number => {
  if (nextThreshold === 0) return 1
  return Math.min(totalXP / nextThreshold, 1)
}