import { TopicPill } from '@/src/components/TopicPill'
import Colors from '@/src/constants/Colors'
import { AlgorithmSummary } from '@/src/features/learning/components/AlgorithmSummary'
import { useAlgorithmSummary } from '@/src/hooks/useAlgorithmSummary'
import { useAlgorithms } from '@/src/hooks/useAlgorithms'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { Pressable, ScrollView, StyleSheet } from 'react-native'

export default function SummaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { summary, loading: summaryLoading } = useAlgorithmSummary(id)
  const { algorithms, loading: algorithmsLoading } = useAlgorithms()

  const algorithm = algorithms.find((algo) => algo.id == id)

  return ( 
    <> 
      <Stack.Screen 
        options={{ 
          title: 'Summary',
          headerBackTitle: 'Back',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <FontAwesome name="chevron-left" size={18} color={Colors.potato.darker} />
            </Pressable>
          )
        }}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <TopicPill
          label="Summary"
          icon="file-text"
        />
        <AlgorithmSummary 
          summary={summary} 
          loading={summaryLoading || algorithmsLoading} 
          algorithmTitle={algorithm?.title ?? 'Algorithm'}
          algorithmCategory={algorithm?.category ?? 'Algorithm'}
        />
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Colors.potato.background,
  },
})