import { CircleProgress } from '@/src/components/CircleProgress'
import { ScreenWrapper } from '@/src/components/ScreenWrapper'
import Colors from '@/src/constants/Colors'
import { useAuthContext } from '@/src/context/AuthContext'
import { useXP } from '@/src/hooks/useXP'
import { avataaars } from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'
import { Ionicons } from '@expo/vector-icons'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SvgXml } from 'react-native-svg'

export default function ProfileScreen() {
  const { profile: authProfile } = useAuthContext()
  const { profile, algorithms, nextLocked, xpProgress, loading, refresh } = useXP()
  const [avatarUri, setAvatarUri] = useState<string | null>(null)

  const totalXP = profile?.total_xp ?? 0
  const streakCount = profile?.streak_count ?? 0
  const username = profile?.username ?? authProfile?.username ?? 'Learner'

  useEffect(() => {
    const generateAvatar = async () => {
      const avatar = createAvatar(avataaars, {
        seed: username,
        eyes: ['happy', 'squint'],
        mouth: ['smile', 'twinkle'],
        eyebrows: ['raisedExcited', 'raisedExcitedNatural', 'upDown'],
        skinColor: ['c68642']
      })
      const uri = avatar.toString() // raw SVG string 
      console.log('Avatar URI:', uri?.substring(0, 100))
      setAvatarUri(uri) 
    }
    generateAvatar()
  }, [username])

  useFocusEffect(
  useCallback(() => {
    refresh()
  }, [])
)

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    )
  }
  
  return (
    <ScreenWrapper showLogout>
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerCard}>
        {/* Avatar */}
        <View style={styles.avatarCircle}>
          {avatarUri ? (
            <SvgXml xml={avatarUri} width={68} height={68} />
          ) : (
            <Ionicons name="person" size={40} color={Colors.potato.darker} />
          )}
        </View>

        {/* Username + Streak */}
        <View style={styles.headerInfo}>
          <Text style={styles.username}>{username}</Text>
          <View style={styles.streakRow}>
            <FontAwesome name="bolt" size={20} color="#E85D5D" />
            <Text style={styles.streakText}>
              {streakCount} day{streakCount !== 1 ? 's' : ''} streak
            </Text>
          </View>
          <Text style={styles.xpTotal}>{totalXP} XP total</Text>
        </View>
      </View>

      {/* Level + Unlock side by side */}
      <View style={styles.rowCard}>
        <Image
          source={require('@/assets/images/potato.png')}
          style={[styles.rowCardWatermark, { transform: [{ scaleX: -1 }] }]}
        />
        
        {/* Left — Level Circle */}
        <View style={styles.leftHalf}>
          <Text style={styles.sectionTitle}>Level</Text>
          {xpProgress && (
            <>
              <CircleProgress
                progress={xpProgress.progress}
                level={xpProgress.level}
              />
              <Text style={styles.xpProgressText}>
                {xpProgress.xpToNext > 0
                  ? `${xpProgress.xpToNext} XP to Lv ${xpProgress.level + 1}`
                  : 'Max level!'}
              </Text>
            </>
          )}
        </View>

        {/* Right — Unlock Progress */}
        <View style={styles.rightHalf}>
          <Text style={styles.sectionTitle}>Next Unlock</Text>
          {nextLocked ? (
            <>
              <Text style={styles.unlockAlgoName}>{nextLocked.title}</Text>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(
                        (totalXP / nextLocked.xp_threshold) * 100,
                        100
                      )}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.unlockText}>
                {Math.max(nextLocked.xp_threshold - totalXP, 0)} XP to unlock {nextLocked.title}
              </Text>
            </>
          ) : (
            <Text style={styles.unlockText}>All algorithms unlocked! 🎉</Text>
          )}
        </View>

      </View>

      {/* Algorithm List */}
      <View style={styles.card}>
        <View style={styles.sectionTitleRow}>
          <FontAwesome
            name="th-large"
            size={16}
            color={Colors.potato.text}
          />
          <Text style={styles.sectionTitle}>
            Your Algorithms
          </Text>
        </View>

        {algorithms.map((algo) => (
          <View key={algo.id} style={styles.algoRow}>
              {algo.is_unlocked ? (
              <FontAwesome
                name="unlock"
                size={16}
                color={Colors.potato.tint}
              />
              ) : (
                <FontAwesome
                  name="lock"
                  size={16}
                  color={Colors.potato.border}
                />
              )}
            <View style={styles.algoInfo}>
              <Text
                style={[
                  styles.algoTitle,
                  !algo.is_unlocked && styles.algoLocked,
                ]}
              >
                {algo.title}
              </Text>
              {!algo.is_unlocked && (
                <Text style={styles.algoXPNeeded}>
                  {algo.xp_needed} XP needed
                </Text>
              )}
            </View>
            <View
              style={[
                styles.difficultyBadge,
                algo.difficulty === 'beginner' && styles.badgeBeginner,
              ]}
            >
              <Text style={styles.difficultyText}>{algo.difficulty}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Recommendations */}
      <View style={styles.card}>
        <View style={styles.sectionTitleRow}>
          <FontAwesome
            name="magic"
            size={16}
            color={Colors.potato.text}
          />
          <Text style={styles.sectionTitle}>
            Recommended Next
          </Text>
        </View>
        {algorithms
          .filter((algo) => algo.is_unlocked)
          .map((algo) => (
            <View key={algo.id} style={styles.recommendRow}>
              <FontAwesome name="clone" size={16} color={Colors.potato.tint}/>
              <View>
                <Text style={styles.recommendTitle}>
                  Review {algo.title} flashcards
                </Text>
                <Text style={styles.recommendSub}>
                  Strengthen your understanding
                </Text>
              </View>
            </View>
          ))}
        {nextLocked && (
          <View style={styles.recommendRow}>
            <FontAwesome name="trophy" size={16} color={Colors.potato.tint} />
            <View>
              <Text style={styles.recommendTitle}>
                Complete a challenge to earn XP
              </Text>
              <Text style={styles.recommendSub}>
                {Math.max(nextLocked.xp_threshold - totalXP, 0)} XP to unlock{' '}
                {nextLocked.title}
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.potato.background,
  },
  container: {
    padding: 15,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: Colors.potato.text,
  },

  // Header
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.potato.warm,
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    gap: 15,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.potato.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.potato.border,
    overflow: 'hidden', 
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.potato.darker,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    fontSize: 14,
    color: Colors.potato.text,
    fontWeight: '600',
  },
  xpTotal: {
    fontSize: 14,
    color: Colors.potato.tint,
    fontWeight: '600',
  },

  avatarImage: {
  width: 68,
  height: 68,
  borderRadius: 34,
  },

  //Level + Unlock 
  rowCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  rowCardWatermark: {
    position: 'absolute',
    right: 10,
    bottom: 70,
    width: 120,
    height: 120,
    opacity: 0.10,
    transform: [{ rotate: '5deg' }],
  },
  leftHalf: {
    alignItems: 'center',
    width: 120,  // fixed width for circle side
  },
  rightHalf: {
    flex: 1,     // takes remaining space for progress bar
    gap: 8,
  },

  // Card
  card: {
    backgroundColor: Colors.potato.background,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: Colors.potato.border,
    marginBottom: 15,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
    elevation: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.potato.text,
  },
  // XP progress
  xpProgressText: {
    textAlign: 'center',
    fontSize: 13,
    color: Colors.potato.text,
  },
  // Unlock progress bar
  unlockAlgoName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.potato.darker,
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: Colors.potato.warm,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.potato.darker,
    borderRadius: 5,
  },
  unlockText: {
    fontSize: 12,
    color: Colors.potato.text,
  },

  // Algorithm list
  algoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.potato.border,
    gap: 10,
  },
  algoInfo: {
    flex: 1,
  },
  algoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.potato.darker,
  },
  algoLocked: {
    color: Colors.potato.text,
    opacity: 0.5,
  },
  algoXPNeeded: {
    fontSize: 11,
    color: Colors.potato.tint,
    marginTop: 2,
  },
  difficultyBadge: {
    backgroundColor: Colors.potato.warm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeBeginner: {
    backgroundColor: '#e8f5e9',
  },
  difficultyText: {
    fontSize: 11,
    color: Colors.potato.darker,
    fontWeight: '600',
  },

  // Recommendations
  recommendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.potato.border,
    gap: 10,
  },
  recommendTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.potato.darker,
  },
  recommendSub: {
    fontSize: 11,
    color: Colors.potato.text,
    marginTop: 2,
  },
})

