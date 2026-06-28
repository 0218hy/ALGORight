import Colors from '@/src/constants/Colors'
import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

const CIRCLE_SIZE = 90
const STROKE_WIDTH = 8
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function CircleProgress({ progress, level }: { progress: number; level: number }) {
  const animatedValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start()
  }, [progress])

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  })

  const AnimatedCircle = Animated.createAnimatedComponent(Circle)

  return (
    <View style={styles.circleContainer}>
      <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
        <Circle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={Colors.potato.warm}
          strokeWidth={STROKE_WIDTH}
        />
        <AnimatedCircle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={Colors.potato.darker}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={`${CIRCUMFERENCE}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
        />
      </Svg>
      <View style={styles.circleLabelContainer}>
        <Text style={styles.levelNumber}>{level}</Text>
        <Text style={styles.levelLabel}>Level</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    // Circle progress
      circleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        marginBottom: 10,
      },
      circleLabelContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
      },
      levelNumber: {
        fontSize: 36,
        fontWeight: 'bold',
        color: Colors.potato.darker,
      },
      levelLabel: {
        fontSize: 12,
        color: Colors.potato.text,
        fontWeight: '600',
      },
    }
)