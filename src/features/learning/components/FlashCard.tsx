import Colors from '@/src/constants/Colors'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useEffect, useRef, useState } from 'react'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'

interface Flashcard {
  id: string
  question: string
  answer: string
  order_index: number
}

interface Props {
  flashcard: Flashcard
  index: number
  total: number
}

export function FlashcardCard({ flashcard, index, total }: Props) {
  const [flipped, setFlipped] = useState(false)
  const progressPercent = ((index + 1) / total) * 100

  const scaleAnim = useRef(new Animated.Value(1)).current
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 150,
      useNativeDriver: true,
    }).start()
  }

  useEffect(() => {
    setFlipped(false)
  }, [flashcard.id])

  return (
    <View style={styles.container}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Card {index + 1} of {total}
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

      <Pressable
        onPress={() => setFlipped(!flipped)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.card,
            flipped && styles.cardFlipped,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.holePunch} />

          {!flipped ? (
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <FontAwesome
                  name="lightbulb-o"
                  size={24}
                  color={Colors.potato.tint}
                />
              </View>

              <Text style={styles.cardLabel}>Question</Text>
              <Text style={styles.questionText}>{flashcard.question}</Text>

              <View style={styles.tapRow}>
                <Text style={styles.tapHint}>Tap to reveal answer</Text>
                <FontAwesome name="refresh" size={12} color={Colors.potato.tint} />
              </View>
            </View>
          ) : (
            <View style={styles.cardContent}>
              <Text style={styles.answerLabel}>Answer</Text>

              <View style={styles.answerBox}>
                <Text style={styles.answerText}>{flashcard.answer}</Text>
              </View>

              <View style={styles.tapRow}>
                <Text style={styles.flippedHint}>Tap to see question</Text>
                <FontAwesome name="check-circle" size={12} color= {Colors.potato.warm} />
              </View>
            </View>
          )}
        </Animated.View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 18,
  },

  label: {
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 1.2,
      color: Colors.potato.darker,
      textTransform: 'uppercase',
      marginBottom: -8,
      paddingLeft: 4
    },
  
    title: {
      fontSize: 30,
      fontWeight: '800',
      color: Colors.potato.text,
      marginBottom: 4,
      paddingLeft: 4,
    },

  progressContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },

  progressText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.potato.tint,
    marginBottom: 5,
  },

  progressTrack: {
    width: 180,
    height: 7,
    borderRadius: 999,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: '#a37243',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: Colors.potato.tint,
  },

  card: {
    width: '100%',
    minHeight: 280,
    backgroundColor: Colors.potato.background,
    borderRadius: 22,
    paddingVertical: 34,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.potato.border,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
    elevation: 2,
  },

  cardFlipped: {
    backgroundColor: Colors.potato.tint,
    borderColor: Colors.potato.tint,
  },

  holePunch: {
    position: 'absolute',
    top: 24,
    left: 24,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.potato.background,
    opacity: 0.9,
  },

  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    width: '100%',
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.potato.warm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },

  cardLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.potato.tint,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },

  answerLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.potato.warm,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },

  questionText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.potato.darker,
    textAlign: 'center',
    lineHeight: 30,
    maxWidth: 320,
  },

  answerBox: {
    backgroundColor: Colors.potato.warm,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderLeftWidth: 5,
    borderLeftColor: Colors.potato.darker,
    width: '100%',
  },

  answerText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.potato.text,
    textAlign: 'center',
    lineHeight: 25,
  },

  tapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  tapHint: {
    fontSize: 11,
    color: Colors.potato.tint,
    opacity: 0.7,
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  flippedHint: {
    fontSize: 11,
    color: Colors.potato.warm,
    opacity: 0.9,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.8,
  },
})