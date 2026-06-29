import {
  calculateChallengeXP,
  calculateLevel,
  calculateQuizXP,
  calculateStreakBonus,
  calculateUnlockProgress,
  calculateXPProgress,
} from '../../xp'

describe('calculateQuizXP', () => {
  it('returns 0 for 0 correct', () => expect(calculateQuizXP(0)).toBe(0))
  it('returns 50 for full marks', () => expect(calculateQuizXP(5)).toBe(50))
  it('returns 10 XP per correct answer', () => expect(calculateQuizXP(3)).toBe(30))
})

describe('calculateChallengeXP', () => {
  it('returns 60 for full easy', () => expect(calculateChallengeXP(3, 'Easy')).toBe(60))
  it('returns 150 for full medium', () => expect(calculateChallengeXP(3, 'Medium')).toBe(150))
  it('returns 210 for full hard', () => expect(calculateChallengeXP(3, 'Hard')).toBe(210))
  it('returns 0 for no correct', () => expect(calculateChallengeXP(0, 'Easy')).toBe(0))
})

describe('calculateLevel', () => {
  it('level 1 at 0 XP', () => expect(calculateLevel(0)).toBe(1))
  it('level 2 at 100 XP', () => expect(calculateLevel(100)).toBe(2))
  it('level 3 at 300 XP', () => expect(calculateLevel(300)).toBe(3))
  it('level 5 at 1500 XP', () => expect(calculateLevel(1500)).toBe(5))
})

describe('calculateStreakBonus', () => {
  it('5 XP day 1', () => expect(calculateStreakBonus(1)).toBe(5))
  it('10 XP day 3', () => expect(calculateStreakBonus(3)).toBe(10))
  it('25 XP day 7', () => expect(calculateStreakBonus(7)).toBe(25))
  it('50 XP day 30', () => expect(calculateStreakBonus(30)).toBe(50))
})

// calculateXPProgress
describe('calculateXPProgress', () => {
  it('returns 50% progress at 50 XP', () => {
    const result = calculateXPProgress(50)
    expect(result.progress).toBe(0.5)
    expect(result.xpToNext).toBe(50)
  })

  it('returns 0 progress at level start', () => {
    const result = calculateXPProgress(0)
    expect(result.progress).toBe(0)
  })

  it('caps progress at 1 beyond max level', () => {
    const result = calculateXPProgress(9999)
    expect(result.progress).toBeLessThanOrEqual(1)
    expect(result.xpToNext).toBe(0)
  })
})

// calculateUnlockProgress
describe('calculateUnlockProgress', () => {
  it('returns 1 for threshold 0 (always unlocked)', () => {
    expect(calculateUnlockProgress(0, 0)).toBe(1)
  })

  it('returns 0.5 at halfway to threshold', () => {
    expect(calculateUnlockProgress(100, 200)).toBe(0.5)
  })

  it('caps at 1 when XP exceeds threshold', () => {
    expect(calculateUnlockProgress(500, 200)).toBe(1)
  })
})

// edge cases
describe('XP edge cases', () => {
  it('challenge XP is higher for harder difficulty at same score', () => {
    expect(calculateChallengeXP(1, 'Easy')).toBeLessThan(calculateChallengeXP(1, 'Medium'))
    expect(calculateChallengeXP(1, 'Medium')).toBeLessThan(calculateChallengeXP(1, 'Hard'))
  })

  it('level increases monotonically with XP', () => {
    const xpValues = [0, 50, 100, 200, 300, 500, 700, 1000, 1500]
    const levels = xpValues.map(calculateLevel)
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i]).toBeGreaterThanOrEqual(levels[i - 1])
    }
  })

  it('quiz XP never exceeds challenge XP for same score count', () => {
    expect(calculateQuizXP(3)).toBeLessThan(calculateChallengeXP(3, 'Easy'))
  })
})