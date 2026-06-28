import { LearningHeader } from '@/src/components/LearningHeader'
import { ScreenWrapper } from '@/src/components/ScreenWrapper'
import Colors from '@/src/constants/Colors'
import { AlgorithmSummary } from '@/src/features/learning/components/AlgorithmSummary'
import { useAlgorithm } from '@/src/hooks/useAlgorithm'
import { useAlgorithmSummary } from '@/src/hooks/useAlgorithmSummary'
import { useLocalSearchParams } from 'expo-router'
import { ScrollView, StyleSheet } from 'react-native'

export default function SummaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { summary, loading: summaryLoading } = useAlgorithmSummary(id)
  const { algorithm, loading: algorithmLoading } = useAlgorithm(id)

  return (
    <ScreenWrapper showBack pillLabel="Summary" pillIcon="book">
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <LearningHeader
          category={algorithm?.category ?? 'Algorithm'}
          title={algorithm?.title ?? 'Algorithm'}
        />
        <AlgorithmSummary
          summary={summary}
          loading={summaryLoading || algorithmLoading}
        />
      </ScrollView>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Colors.potato.background,
  },
})