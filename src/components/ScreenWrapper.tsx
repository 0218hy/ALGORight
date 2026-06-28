import Colors from '@/src/constants/Colors'
import { FontAwesome } from '@expo/vector-icons'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header } from './Header'
import { TopicPill } from './TopicPill'

interface Props {
  children: React.ReactNode
  showBack?: boolean
  showLogout?: boolean
  title?: string
  // pill props
  pillLabel?: string
  pillIcon?: keyof typeof FontAwesome.glyphMap
}

export function ScreenWrapper({ 
  children, 
  showBack, 
  showLogout, 
  title,
  pillLabel,
  pillIcon,
}: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header
        title={title}
        showBack={showBack}
        showLogout={showLogout}
      />
      {pillLabel && pillIcon && (
        <View style={styles.pillContainer}>
          <TopicPill label={pillLabel} icon={pillIcon} />
        </View>
      )}
      {children}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.potato.background,
  },
  pillContainer: {
    paddingHorizontal: 15,
  },
})