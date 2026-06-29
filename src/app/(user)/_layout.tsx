import { Stack } from 'expo-router'

export default function UserLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="learn" />
      <Stack.Screen name="visualizer" />
      <Stack.Screen name="algorithm/[id]" />
      <Stack.Screen name="summary/[id]" />
      <Stack.Screen name="flashcards/[id]" />
      <Stack.Screen name="algoQuiz/[id]" />
      <Stack.Screen name="leetcode/index" />
      <Stack.Screen name="forum" />
    </Stack>
  )
}
