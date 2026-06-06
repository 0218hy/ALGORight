import Colors from '@/src/constants/Colors'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

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

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.topicPill}>
          <FontAwesome name="clone" size={12} color={Colors.potato.darker} />
          <Text style={styles.topicText}>Flashcard</Text>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Card {index + 1} of {total}
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>
      </View>

      <Pressable
        style={[styles.card, flipped && styles.cardFlipped]}
        onPress={() => setFlipped(!flipped)}
      >
        <View style={styles.holePunch} />

        {!flipped ? (
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <FontAwesome
                name="lightbulb-o"
                size={24}
                color={Colors.potato.darker}
              />
            </View>

            <Text style={styles.cardLabel}>Question</Text>
            <Text style={styles.questionText}>{flashcard.question}</Text>

            <View style={styles.tapRow}>
              <Text style={styles.tapHint}>Tap to reveal answer</Text>
              <FontAwesome name="refresh" size={12} color={Colors.potato.text} />
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
              <FontAwesome name="check-circle" size={13} color="#ffddc2" />
            </View>
          </View>
        )}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 18,
  },

  topRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },

  topicPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.potato.background,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.potato.background,
  },

  topicText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.potato.text,
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
    width: 130,
    height: 7,
    borderRadius: 999,
    backgroundColor: Colors.potato.tint,
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
    borderColor: Colors.potato.tint,
    shadowColor: '#381b06',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  cardFlipped: {
    backgroundColor: Colors.potato.tint,
    borderColor: Colors.potato.darker,
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
    backgroundColor: '#ffddc2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },

  cardLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.potato.darker,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },

  answerLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffddc2',
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
    backgroundColor: Colors.potato.background,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#ffddc2',
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
    position: 'absolute',
    bottom: -48,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  tapHint: {
    fontSize: 11,
    color: Colors.potato.text,
    opacity: 0.7,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  flippedHint: {
    fontSize: 11,
    color: '#ffddc2',
    opacity: 0.9,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.8,
  },
})