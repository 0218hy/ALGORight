import { LearningHeader } from '@/src/components/LearningHeader'
import Colors from '@/src/constants/Colors'
import { AlgorithmSummary } from '@/src/features/learning/components/AlgorithmSummary'
import { useAlgorithm } from '@/src/hooks/useAlgorithm'
import { useAlgorithmSummary } from '@/src/hooks/useAlgorithmSummary'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { Pressable, ScrollView, StyleSheet } from 'react-native'

export default function SummaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { summary, loading: summaryLoading } = useAlgorithmSummary(id)
  const { algorithm, loading: algorithmLoading } = useAlgorithm(id)

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
        <LearningHeader
          label="Summary"
          icon="file-text"
          category={algorithm?.category ?? 'Algorithm'}
          title={algorithm?.title ?? 'Algorithm'}
        />
        <AlgorithmSummary 
          summary={summary} 
          loading={summaryLoading || algorithmLoading} 
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