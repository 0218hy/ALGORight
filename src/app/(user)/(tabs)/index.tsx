import Colors from '@/src/constants/Colors';
import { useAuthContext } from '@/src/context/AuthContext';
import { useXP } from '@/src/hooks/useXP';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Href, useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenWrapper } from '@/src/components/ScreenWrapper';

export default function HomePage() {
  const router = useRouter()
  const { profile: authProfile, loading: authLoading } = useAuthContext()
  const { profile, algorithms, nextLocked, xpProgress, recommendedChallenge, loading, refresh } = useXP()

  useFocusEffect(
    useCallback(() => {
      refresh()
    }, [])
  )

  if (authLoading || loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color={Colors.potato.darker} />
  }

  const username = profile?.username ?? authProfile?.username ?? 'Learner'
  const totalXP = profile?.total_xp ?? 0
  const streakCount = profile?.streak_count ?? 0
  const level = xpProgress?.level ?? 1

  const navItems = [
    { label: 'Visualizer', icon: 'play-circle', route: '/visualizer' },
    { label: 'Learning', icon: 'book', route: '/learn' },
    { label: 'Challenges', icon: 'trophy', route: '/leetcode' },
    { label: 'Forum', icon: 'comments', route: '/forum' },
  ]

  return (
    <ScreenWrapper showLogout>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerCard}>

        <Image
          source={require('@/assets/images/potato.png')}
          style={styles.potatoWatermark}
        />

          <View style={styles.headerInfo}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.username}>{username}</Text>
            <View style={styles.streakRow}>
              <FontAwesome name="bolt" size={14} color="#E85D5D" />
              <Text style={styles.streakText}>
                {streakCount} day{streakCount !== 1 ? 's' : ''} streak
              </Text>
            </View>
          </View>
          <View style={styles.xpBadge}>
            <Text style={styles.xpBadgeValue}>{totalXP}</Text>
            <Text style={styles.xpBadgeLabel}>XP</Text>
            <Text style={styles.xpBadgeLevel}>Lv {level}</Text>
          </View>
        </View>

        {/* Nav Cards */}
        <View style={styles.gridContainer}>
          {navItems.map((item) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [styles.navCard, pressed && styles.cardPressed]}
              onPress={() => router.push(item.route as Href)}
            >
              <FontAwesome name={item.icon as any} size={24} color={Colors.potato.darker} />
              <Text style={styles.navCardText}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Recommended Challenge */}
        {recommendedChallenge && (
          <Pressable
            style={({ pressed }) => [styles.challengeCard, pressed && styles.cardPressed]}
            onPress={() => router.push(`/leetcode/${recommendedChallenge.leetcode_slug}` as Href)}
          >
            <View style={styles.sectionTitleRow}>
              <FontAwesome name="trophy" size={16} color={Colors.potato.warm} />
              <Text style={styles.challengeLabel}>RECOMMENDED CHALLENGE</Text>
            </View>
            <View style={styles.challengeRow}>
              <View style={styles.challengeInfo}>
                <Text style={styles.challengeTitle}>{recommendedChallenge.title}</Text>
                {nextLocked && (
                  <Text style={styles.challengeSub}>
                    Earn XP to unlock {nextLocked.title}
                  </Text>
                )}
              </View>
              <View style={[
                styles.difficultyBadge,
                recommendedChallenge.difficulty === 'Easy' && styles.badgeEasy,
                recommendedChallenge.difficulty === 'Medium' && styles.badgeMedium,
                recommendedChallenge.difficulty === 'Hard' && styles.badgeHard,
              ]}>
                <Text style={styles.difficultyText}>{recommendedChallenge.difficulty}</Text>
              </View>
            </View>
          </Pressable>
        )}

        {/* Learning Path */}
        <View style={styles.card}>
          <View style={styles.sectionTitleRow}>
            <FontAwesome name="map-o" size={16} color={Colors.potato.text} />
            <Text style={styles.sectionTitle}>Your Learning Path</Text>
          </View>
          {algorithms.map((algo, index) => (
            <View key={algo.id}>
              <Pressable
                style={[styles.pathRow, !algo.is_unlocked && styles.pathRowLocked]}
                onPress={() => algo.is_unlocked
                  ? router.push(`/algorithm/${algo.id}` as Href)
                  : null
                }
              >
                <View style={[
                  styles.pathDot,
                  algo.is_unlocked ? styles.pathDotUnlocked : styles.pathDotLocked
                ]}>
                  <FontAwesome
                    name={algo.is_unlocked ? 'unlock' : 'lock'}
                    size={12}
                    color={algo.is_unlocked ? '#fff' : Colors.potato.border}
                  />
                </View>
                <View style={styles.pathInfo}>
                  <Text style={[
                    styles.pathTitle,
                    !algo.is_unlocked && styles.pathTitleLocked
                  ]}>
                    {algo.title}
                  </Text>
                  {!algo.is_unlocked && (
                    <Text style={styles.pathXP}>{algo.xp_needed} XP to unlock</Text>
                  )}
                </View>
                {algo.is_unlocked && (
                  <FontAwesome name="chevron-right" size={12} color={Colors.potato.tint} />
                )}
              </Pressable>
              {index < algorithms.length - 1 && (
                <View style={styles.pathConnector} />
              )}
            </View>
          ))}
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

  safeArea: {
    flex: 1,
    backgroundColor: Colors.potato.background,
  },

  //Custom Header 
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoAlgo: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.potato.darker,
    letterSpacing: 1,
  },
  logoRight: {
    fontSize: 26,
    fontWeight: '400',
    color: Colors.potato.tint,
    letterSpacing: 1,
  },

  // Header 
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.potato.warm,
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    gap: 15,
    overflow: 'hidden',
  },
  potatoWatermark: {
    position: 'absolute',
    left: 150,
    width: 150,
    height: 155, 
    opacity: 0.15,
    transform: [{ rotate: '20deg' }],
  },

  headerInfo: {
    flex: 1,
    gap: 4,
  },
  welcomeText: {
    fontSize: 20,
    color: Colors.potato.text,
    fontWeight: '300',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.potato.darker,
    marginBottom: 2,
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
  xpBadge: {
    alignItems: 'center',
    backgroundColor: Colors.potato.background,
    borderRadius: 12,
    padding: 10,
    minWidth: 60,
    borderWidth: 1,
    borderColor: Colors.potato.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  xpBadgeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.potato.darker,
  },
  xpBadgeLabel: {
    fontSize: 11,
    color: Colors.potato.darker,
    fontWeight: '700',
    marginBottom: 2,
  },
  xpBadgeLevel: {
    fontSize: 18,
    color: Colors.potato.tint,
    fontWeight: '600',
  },

  // Nav grid 
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  navCard: {
    backgroundColor: '#ffffff',
    width: '47%',
    height: 85,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.8,
  },
  navCardText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.potato.darker,
    textAlign: 'center',
  },

  // Challenge card 
  challengeCard: {
    backgroundColor: Colors.potato.darker,
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    gap: 8,
  },
  challengeLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.potato.warm,
    letterSpacing: 0.5,
  },
  challengeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  challengeInfo: {
    flex: 1,
    gap: 4,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  challengeSub: {
    fontSize: 12,
    color: Colors.potato.warm,
    opacity: 0.8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeEasy: { backgroundColor: '#e8f5e9' },
  badgeMedium: { backgroundColor: '#fff3e0' },
  badgeHard: { backgroundColor: '#fce4ec' },
  difficultyText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.potato.darker,
  },

  // Card 
  card: {
    backgroundColor: Colors.potato.background,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: Colors.potato.border,

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

  // Learning path
  pathRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.potato.border,
  },
  pathRowLocked: {
    opacity: 0.5,
  },
  pathDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pathDotUnlocked: {
    backgroundColor: Colors.potato.tint,
  },
  pathDotLocked: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: Colors.potato.border,
  },
  pathInfo: {
    flex: 1,
  },
  pathTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.potato.darker,
  },
  pathTitleLocked: {
    color: Colors.potato.text,
  },
  pathXP: {
    fontSize: 11,
    color: Colors.potato.tint,
    marginTop: 2,
  },
  pathConnector: {
    width: 2,
    height: 16,
    backgroundColor: Colors.potato.border,
    marginLeft: 15,
  },
})