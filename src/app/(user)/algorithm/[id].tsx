import Colors from '@/src/constants/Colors'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

export default function AlgorithmDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  
  const options = [
    {
        icon: '📖',
        title: 'Summary',
        description: 'Learn the concept and key points',
        onPress: () => router.push(`/summary/${id}`),
    },
    {
        icon: '🃏',
        title: 'Flashcards',
        description: 'Test your recall',
        onPress: () => router.push(`/flashcards/${id}`),
    },
    {
      icon: '📝',
      title: 'Quiz',
      description: 'Test your understanding',
      onPress: () => router.push(`/quiz/${id}`),
  },
  ]

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {options.map((option) => (
        <Pressable
          key={option.title}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={option.onPress}
        >
          <Text style={styles.icon}>{option.icon}</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{option.title}</Text>
            <Text style={styles.cardDescription}>{option.description}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
    flexGrow: 1,
  },
  card: {
    backgroundColor: Colors.potato.background,
    borderRadius: 15,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.8,
  },
  icon: {
    fontSize: 28,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.potato.darker,
    marginBottom: 3,
  },
  cardDescription: {
    fontSize: 12,
    color: Colors.potato.text,
  },
  arrow: {
    fontSize: 24,
    color: Colors.potato.darker,
    opacity: 0.5,
  },
})