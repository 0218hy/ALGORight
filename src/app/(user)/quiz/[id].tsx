import Colors from '@/src/constants/Colors'
import { AlgorithmSummary } from '@/src/features/learning/components/AlgorithmSummary'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native'

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <> 
      <Stack.Screen 
        options={{ 
          title: 'Quiz',
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
       <Text> Hi checking if quiz is appearing</Text>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'white',
  },
})