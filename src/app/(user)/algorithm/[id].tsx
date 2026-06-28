import { ScreenWrapper } from '@/src/components/ScreenWrapper'
import Colors from '@/src/constants/Colors'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

export default function AlgorithmDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  
  const options = [
    {
      icon: 'play-circle' as const,
      title: 'Visualizer',
      description: 'Watch the algorithm in action',
      onPress: () => router.push(`/visualizer`),
    },
    {
      icon: 'book' as const,
      title: 'Summary',
      description: 'Learn the concept and key points',
      onPress: () => router.push(`/summary/${id}`),
    },
    {
      icon: 'clone' as const,
      title: 'Flashcards',
      description: 'Test your recall',
      onPress: () => router.push(`/flashcards/${id}`),
    },
    {
      icon: 'question-circle' as const,
      title: 'Quiz',
      description: 'Test your understanding',
      onPress: () => router.push(`/algoQuiz/${id}`),
    },
  ]

  return (
    <ScreenWrapper showBack pillLabel="ALgorithm" pillIcon="th-large">
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* potato watermark */}
        <Image
          source={require('@/assets/images/potato.png')}
          style={styles.potatoWatermark}
        />

        {options.map((option) => (
          <Pressable
            key={option.title}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={option.onPress}
          >
            <View style={styles.iconContainer}>
              <FontAwesome name={option.icon} size={22} color={Colors.potato.tint} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{option.title}</Text>
              <Text style={styles.cardDescription}>{option.description}</Text>
            </View>
            <FontAwesome name="chevron-right" size={14} color={Colors.potato.border} />
          </Pressable>
        ))}
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
  card: {
     backgroundColor: Colors.potato.background,
     borderRadius: 15,
     padding: 18,
     marginBottom: 12,
     gap: 15, 
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.1,
     shadowRadius: 3,
     elevation: 2,
   },
  cardPressed: {
    opacity: 0.8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.potato.warm,
    alignItems: 'center',
    justifyContent: 'center',
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
  potatoWatermark: {
    position: 'absolute',
    right: 120,
    top: 350,
    width: 350,
    height: 350,
    opacity: 0.06,
    transform: [{ rotate: '5deg' }],
  },
})