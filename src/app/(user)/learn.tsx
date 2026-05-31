import Colors from '@/src/constants/Colors'
import { useAlgorithms } from '@/src/hooks/useAlgorithms'
import { useRouter } from 'expo-router'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

export default function LearnScreen() {
  const { algorithms, loading } = useAlgorithms()
  const router = useRouter()

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.potato.darker} />
      </View>
    )
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Choose an Algorithm</Text>

      {algorithms.map((algorithm) => (
        <Pressable
          key={algorithm.id}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => router.push(`/algorithm/${algorithm.id}`)}
        >
          <View style={styles.cardLeft}>
            <Text style={styles.algorithmTitle}>{algorithm.title}</Text>
            {algorithm.description && (
              <Text style={styles.description} numberOfLines={2}>
                {algorithm.description}
              </Text>
            )}
          </View>
          <View style={styles.cardRight}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{algorithm.difficulty}</Text>
            </View>
            <Text style={styles.category}>{algorithm.category}</Text>
          </View>
        </Pressable>
      ))}

    </ScrollView>
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
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.potato.darker,
    marginBottom: 15,
  },
  card: {
    backgroundColor: Colors.potato.background,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
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
  cardLeft: {
    flex: 1,
    marginRight: 10,
  },
  algorithmTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.potato.darker,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: Colors.potato.text,
    lineHeight: 18,
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
  badgeText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '600',
  },
  category: {
    fontSize: 11,
    color: Colors.potato.text,
  },
})