import { LearningHeader } from '@/src/components/LearningHeader'
import { ScreenWrapper } from '@/src/components/ScreenWrapper'
import Colors from '@/src/constants/Colors'
import { FlashcardCard } from '@/src/features/learning/components/FlashCard'
import { useAlgorithm } from '@/src/hooks/useAlgorithm'
import { useFlashcards } from '@/src/hooks/useFlashcards'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
 
export default function FlashcardsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { flashcards, loading } = useFlashcards(id)
  const [ currentIndex, setCurrentIndex ] = useState(0)
  const { algorithm, loading: algorithmLoading } = useAlgorithm(id)

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
    <ScreenWrapper showBack pillLabel="Flashcards" pillIcon="clone">
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
       <LearningHeader
          category={algorithm?.category ?? 'Algorithm'}
          title={algorithm?.title ?? 'Algorithm'}
        />

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
          <View style={styles.buttonContent}>
            <FontAwesome 
              name="chevron-left"
              size={14}
              color='#ffffff'
             />
            <Text style={styles.navButtonText}>Prev</Text>
          </View>
        </Pressable>

        <Pressable
          style={[styles.navButton, currentIndex === flashcards.length - 1 && styles.disabled]}
          onPress={() => setCurrentIndex(prev => Math.min(flashcards.length - 1, prev + 1))}
          disabled={currentIndex === flashcards.length - 1}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.navButtonText}>Next</Text>
            <FontAwesome 
              name="chevron-right"
              size={14}
              color='#ffffff'
             />
          </View>
        </Pressable>
      </View>

      </ScrollView>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Colors.potato.background,
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
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
    elevation: 2,
  },
  disabled: {
    backgroundColor: Colors.potato.border,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
})