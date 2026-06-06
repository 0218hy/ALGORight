import Colors from '@/src/constants/Colors'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { StyleSheet, Text, View } from 'react-native'

interface AlgorithmSummaryData {
  content: string
  how_it_works: string | string[]
  key_points: string[]
  when_to_use: string
  time_complexity: string
  space_complexity: string
}

interface Props {
  summary: AlgorithmSummaryData | null
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
      <Text style={styles.label}>SORTING ALGORITHM</Text>
      <Text style={styles.title}>Bubble Sort</Text>

      {/* Core Idea */}
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <View style={styles.iconContainer}>
            <FontAwesome
              name="lightbulb-o"
              size={24}
              color={Colors.potato.darker}
            />
          </View>

          <Text style={styles.cardTitle}>Core Idea</Text>
        </View>
        <Text style={styles.bodyText}>{summary.content}</Text>
      </View>

      {/* Complexity badges */}
      <View style={styles.badgeRow}>
        <View style={styles.complexityCard}>
          <Text style={styles.badgeLabel}><FontAwesome name="clock-o" size={14} /> Time</Text>
          <Text style={styles.badgeValue}>{summary.time_complexity}</Text>
        </View>

        <View style={styles.complexityCard}>
          <Text style={styles.badgeLabel}><FontAwesome name="inbox" size={14} /> Space</Text>
          <Text style={styles.badgeValue}>{summary.space_complexity}</Text>
        </View>
      </View>

      {/* How it works */}
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <View style={styles.iconContainer}>
            <FontAwesome
                name="gear"
                size={24}
                color={Colors.potato.darker}
              />
            </View>

            <Text style={styles.cardTitle}>How It Works</Text>
         </View>

        {(() => {
          let steps: string[] = []

          if (Array.isArray(summary.how_it_works)) {
            steps = summary.how_it_works
          } else {
            try {
              const parsed = JSON.parse(summary.how_it_works as string)
              steps = Array.isArray(parsed) ? parsed : [summary.how_it_works as string]
            } catch {
              steps = (summary.how_it_works as string).split('. ').filter(s => s.trim())
            }
          }

          return steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <Text style={styles.stepNumber}>{index + 1}.</Text>
              <Text style={styles.bulletText}>{step.trim()}</Text>
            </View>
          ))
        })()}
      </View>
      
      {/* Key Takeaways */}
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <View style={styles.iconContainer}>
            <FontAwesome
                name="check-circle"
                size={24}
                color={Colors.potato.darker}
              />
            </View>

            <Text style={styles.cardTitle}>Key Takeaways</Text>
         </View>

        {summary.key_points.map((point, index) => (
          <View key={index} style={styles.bulletRow}>
            <Text style={styles.check}><FontAwesome name="circle-thin" /></Text>
            <Text style={styles.bulletText}>{point}</Text>
          </View>
        ))}
      </View>

      {/* When to use */}
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <View style={styles.iconContainer}>
            <FontAwesome
                name="bullseye"
                size={24}
                color={Colors.potato.darker}
              />
            </View>

            <Text style={styles.cardTitle}>When To Use</Text>
         </View>
        <Text style={styles.bodyText}>{summary.when_to_use}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },

  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: Colors.potato.darker,
    textTransform: 'uppercase',
    marginBottom: -8,
    paddingLeft: 4
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.potato.text,
    marginBottom: 4,
    paddingLeft: 4,
  },

  card: {
    backgroundColor: Colors.potato.background,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#d3c8bf',
    shadowColor: '#381b06',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    marginLeft: -4,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffddc2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.potato.darker,
    lineHeight: 24,
    includeFontPadding: false,
  },

  bodyText: {
    fontSize: 15,
    color: Colors.potato.text,
    lineHeight: 24,
  },

  badgeRow: {
    flexDirection: 'row',
    gap: 12,
  },

  complexityCard: {
    flex: 1,
    backgroundColor: Colors.potato.tint,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#381b06',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },

  badgeLabel: {
    fontSize: 14,
    color: '#ffddc2',
    marginBottom: 4,
    fontWeight: '700',
  },

  badgeValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.dark.text, 
  },

  stepRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    marginLeft:6,
    alignItems: 'flex-start',
  },

  stepNumber: {
    color: Colors.potato.text,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '800',
    fontSize: 15,
  },

  bulletText: {
    flex: 1,
    fontSize: 14,
    color: Colors.potato.text,
    lineHeight: 20,
  },

  bulletRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    marginLeft: 6,
    alignItems: 'flex-start',
  },

  check: {
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '800',
    fontSize: 13,
  },

  loadingText: {
    color: Colors.potato.darker,
    textAlign: 'center',
    padding: 20,
  },
})