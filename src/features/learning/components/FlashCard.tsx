import Colors from '@/src/constants/Colors'
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

  return (
    <View style={styles.container}>

      {/* Progress indicator */}
      <Text style={styles.progress}>{index + 1} / {total}</Text>

      {/* Card */}
      <Pressable
        style={[styles.card, flipped && styles.cardFlipped]}
        onPress={() => setFlipped(!flipped)}
      >
        {!flipped ? (
          <View style={styles.cardContent}>
            <Text style={styles.cardLabel}>Question</Text>
            <Text style={styles.questionText}>{flashcard.question}</Text>
            <Text style={styles.tapHint}>tap to reveal answer</Text>
          </View>
        ) : (
          <View style={styles.cardContent}>
            <Text style={styles.cardLabel}>Answer</Text>
            <Text style={styles.answerText}>{flashcard.answer}</Text>
            <Text style={styles.tapHint}>tap to see question</Text>
          </View>
        )}
      </Pressable>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  progress: {
    fontSize: 13,
    color: Colors.potato.darker,
    marginBottom: 10,
    fontWeight: '600',
  },
  card: {
    width: '100%',
    minHeight: 200,
    backgroundColor: Colors.potato.background,
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardFlipped: {
    backgroundColor: Colors.potato.darker,
  },
  cardContent: {
    alignItems: 'center',
    gap: 15,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.potato.darker,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.potato.darker,
    textAlign: 'center',
    lineHeight: 24,
  },
  answerText: {
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 22,
  },
  tapHint: {
    fontSize: 11,
    color: Colors.potato.darker,
    opacity: 0.5,
  },
})