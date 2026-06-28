import Colors from '@/src/constants/Colors'
import { StyleSheet, Text, View } from 'react-native'

interface Props {
  category: string
  title: string
}

export function LearningHeader({ category, title }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {category.toUpperCase()}
      </Text>
      <Text style={styles.title}>
        {title}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: Colors.potato.darker,
    textTransform: 'uppercase',
    paddingLeft: 4,
    marginBottom: 2,
  },
  title: {
    fontSize: 35,
    fontWeight: '800',
    color: Colors.potato.text,
    paddingLeft: 4,
  },
})