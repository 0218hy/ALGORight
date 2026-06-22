import { TopicPill } from '@/src/components/TopicPill'
import Colors from '@/src/constants/Colors'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { StyleSheet, Text, View } from 'react-native'

interface Props {
  label: string
  icon: keyof typeof FontAwesome.glyphMap
  category: string
  title: string
}

export function LearningHeader({
  label,
  icon,
  category,
  title,
}: Props) {
  return (
    <View style={styles.container}>
      <TopicPill
        label={label}
        icon={icon}
      />

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
    fontSize: 30,
    fontWeight: '800',
    color: Colors.potato.text,
    paddingLeft: 4,
  },
})