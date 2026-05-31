import Colors from '@/src/constants/Colors'
import { StyleSheet, Text, View } from 'react-native'

interface AlgorithmSummary {
  content: string
  how_it_works: string
  key_points: string[]
  when_to_use: string
  time_complexity: string
  space_complexity: string
}

interface Props {
  summary: AlgorithmSummary | null
  loading: boolean
}

export function AlgorithmSummary({ summary, loading }: Props) {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading summary...</Text>
      </View>
    )
  }

  if (!summary) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>No summary available</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>

      {/* What is it */}
      <Text style={styles.content}>{summary.content}</Text>

      {/* Complexity badges */}
      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>⏱ Time</Text>
          <Text style={styles.badgeValue}>{summary.time_complexity}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>💾 Space</Text>
          <Text style={styles.badgeValue}>{summary.space_complexity}</Text>
        </View>
      </View>

      {/* How it works */}
      <Text style={styles.sectionTitle}>How it works</Text>
      {(() => {
        let steps: string[] = []
        
        if (Array.isArray(summary.how_it_works)) {
          steps = summary.how_it_works
        } else {
          try {
            // try parsing as JSON array
            const parsed = JSON.parse(summary.how_it_works)
            steps = Array.isArray(parsed) ? parsed : [summary.how_it_works]
          } catch {
            // fallback — split by sentence
            steps = summary.how_it_works.split('. ').filter(s => s.trim())
          }
        }

        return steps.map((step, index) => (
          <View key={index} style={styles.bulletRow}>
            <Text style={styles.bullet}>{index + 1}.</Text>
            <Text style={styles.bulletText}>{step.trim()}</Text>
          </View>
        ))
      })()}
      
      {/* Key points */}
      <Text style={styles.sectionTitle}>Key Points</Text>
      {summary.key_points.map((point, index) => (
        <View key={index} style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>{point}</Text>
        </View>
      ))}

      {/* When to use */}
      <Text style={styles.sectionTitle}>When to use</Text>
      <Text style={styles.bodyText}>{summary.when_to_use}</Text>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.potato.background,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  loadingText: {
    color: Colors.potato.darker,
    textAlign: 'center',
    padding: 20,
  },
  content: {
    fontSize: 14,
    color: Colors.potato.text,
    lineHeight: 22,
    marginBottom: 15,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  badge: {
    flex: 1,
    backgroundColor: Colors.potato.darker,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  badgeLabel: {
    fontSize: 11,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 2,
  },
  badgeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.potato.darker,
    marginBottom: 6,
    marginTop: 5,
  },
  bodyText: {
    fontSize: 13,
    color: Colors.potato.text,
    lineHeight: 20,
    marginBottom: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  bullet: {
    color: Colors.potato.darker,
    fontSize: 13,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: Colors.potato.text,
    lineHeight: 20,
  },
})