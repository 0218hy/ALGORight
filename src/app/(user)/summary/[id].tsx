import Colors from '@/src/constants/Colors'
import { AlgorithmSummary } from '@/src/features/learning/components/AlgorithmSummary'
import { useAlgorithmSummary } from '@/src/hooks/useAlgorithmSummary'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { Pressable, ScrollView, StyleSheet } from 'react-native'

export default function SummaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { summary, loading } = useAlgorithmSummary(id)

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
        <AlgorithmSummary summary={summary} loading={loading} />
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