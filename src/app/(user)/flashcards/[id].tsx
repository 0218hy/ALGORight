import Colors from '@/src/constants/Colors'
import { FlashcardCard } from '@/src/features/learning/components/FlashCard'
import { useFlashcards } from '@/src/hooks/useFlashcards'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

export default function FlashcardsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { flashcards, loading } = useFlashcards(id)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading flashcards...</Text>
      </View>
    )
  }

  if (flashcards.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No flashcards available</Text>
      </View>
    )
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Current flashcard */}
      <FlashcardCard
        flashcard={flashcards[currentIndex]}
        index={currentIndex}
        total={flashcards.length}
      />

      {/* Navigation buttons */}
      <View style={styles.navRow}>
        <Pressable
          style={[styles.navButton, currentIndex === 0 && styles.disabled]}
          onPress={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
        >
          <Text style={styles.navButtonText}>← Prev</Text>
        </Pressable>

        <Pressable
          style={[styles.navButton, currentIndex === flashcards.length - 1 && styles.disabled]}
          onPress={() => setCurrentIndex(prev => Math.min(flashcards.length - 1, prev + 1))}
          disabled={currentIndex === flashcards.length - 1}
        >
          <Text style={styles.navButtonText}>Next →</Text>
        </Pressable>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navButton: {
    backgroundColor: Colors.potato.darker,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  disabled: {
    backgroundColor: '#E5E5EA',
  },
  navButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
})