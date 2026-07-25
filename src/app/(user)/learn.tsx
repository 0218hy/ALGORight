import { ScreenWrapper } from '@/src/components/ScreenWrapper'
import Colors from '@/src/constants/Colors'
import { useXP } from '@/src/hooks/useXP'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback } from 'react'
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

export default function LearnScreen() {
  const { algorithms, loading, refresh } = useXP()
  const router = useRouter()

  useFocusEffect(
    useCallback(() => {
      refresh()
    }, [])
  )

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.potato.darker} />
      </View>
    )
  }

  return (
    <ScreenWrapper showBack pillLabel="Learning" pillIcon="book">
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: Colors.potato.background }}
      >
        {/* decorative potato */}
        <View style={styles.potatoContainer}>
          <Image
            source={require('@/assets/images/potato.png')}
            style={styles.potatoImage}
          />
        </View>

        <Text style={styles.title}>Choose an Algorithm</Text>

        {algorithms.map((algorithm) => (
          <Pressable
            key={algorithm.id}
            style={({ pressed }) => [
              styles.card,
              pressed && algorithm.is_unlocked && styles.cardPressed,
              !algorithm.is_unlocked && styles.cardLocked,
            ]}
            onPress={() => algorithm.is_unlocked
              ? router.push(`/algorithm/${algorithm.id}`)
              : null
            }
          >
            <View style={styles.cardLeft}>
              <View style={styles.titleRow}>
                <FontAwesome
                  name={algorithm.is_unlocked ? 'unlock' : 'lock'}
                  size={13}
                  color={algorithm.is_unlocked ? Colors.potato.tint : Colors.potato.border}
                />
                <Text style={[
                  styles.algorithmTitle,
                  !algorithm.is_unlocked && styles.algorithmTitleLocked
                ]}>
                  {algorithm.title}
                </Text>
              </View>
              {algorithm.description && algorithm.is_unlocked && (
                <Text style={styles.description} numberOfLines={2}>
                  {algorithm.description}
                </Text>
              )}
              {!algorithm.is_unlocked && (
                <Text style={styles.xpNeeded}>
                  {algorithm.xp_needed} XP to unlock
                </Text>
              )}
            </View>
            <View style={styles.cardRight}>
              <View style={[
                styles.badge,
                !algorithm.is_unlocked && styles.badgeLocked,
              ]}>
                <Text style={styles.badgeText}>{algorithm.difficulty}</Text>
              </View>
              <Text style={styles.category}>{algorithm.category}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: 15,
    paddingBottom: 100,
    backgroundColor: Colors.potato.background,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.potato.darker,
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.8,
  },
  cardLocked: {
    opacity: 0.5,
    backgroundColor: Colors.potato.background,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  cardLeft: {
    flex: 1,
    marginRight: 10,
  },
  algorithmTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.potato.darker,
  },
  algorithmTitleLocked: {
    color: Colors.potato.text,
  },
  description: {
    fontSize: 12,
    color: Colors.potato.text,
    lineHeight: 18,
  },
  xpNeeded: {
    fontSize: 11,
    color: Colors.potato.tint,
    marginTop: 4,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 5,
  },
  badge: {
    backgroundColor: Colors.potato.darker,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeLocked: {
    backgroundColor: Colors.potato.border,
  },
  badgeText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '600',
  },
  category: {
    fontSize: 11,
    color: Colors.potato.text,
  },
  potatoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  potatoImage: {
    width: 80,
    height: 80,
    opacity: 0.4,
  },
})