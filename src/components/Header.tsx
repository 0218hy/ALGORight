import Colors from '@/src/constants/Colors'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useRouter } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { TopicPill } from './TopicPill'

interface Props {
  title?: string
  showBack?: boolean
  showLogout?: boolean
  pillLabel?: string
  pillIcon?: keyof typeof FontAwesome.glyphMap
}

export function Header({ title, showBack, showLogout, pillLabel, pillIcon }: Props) {
  const router = useRouter()

  return (
    <View style={styles.header}>
      {/* Left */}
      {showBack ? (
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <FontAwesome name="chevron-left" size={16} color={Colors.potato.darker} />
        </Pressable>
      ) : (
        <View style={styles.logo}>
          <Text style={styles.logoAlgo}>ALGO</Text>
          <Text style={styles.logoRight}>Right</Text>
        </View>
      )}

      {/* Middle — pill or title */}
      {pillLabel && pillIcon ? (
        <TopicPill label={pillLabel} icon={pillIcon} />
      ) : title ? (
        <Text style={styles.title}>{title}</Text>
      ) : (
        <View />
      )}

      {/* Right */}
      {showLogout ? (
        <Pressable
          onPress={() => router.replace('/(auth)/sign-in')}
          style={styles.iconBtn}     
        >
          <FontAwesome name="sign-out" size={18} color={Colors.potato.text} />
        </Pressable>
      ) : showBack ? (
        <Pressable
          onPress={() => router.replace('/')} 
          style={styles.iconBtn}
        >
          <FontAwesome name="home" size={22} color={Colors.potato.text} />
        </Pressable>
      ) : (
        <View style={styles.iconBtn} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 4,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoAlgo: {
    fontSize: 25,
    fontWeight: '900',
    color: Colors.potato.darker,
    letterSpacing: 1,
  },
  logoRight: {
    fontSize: 25,
    fontWeight: '400',
    color: Colors.potato.tint,
    letterSpacing: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.potato.darker,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft:-10,
    marginBottom: 4,
  },
})