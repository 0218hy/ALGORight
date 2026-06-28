import Button from '@/src/components/Button'
import Colors from '@/src/constants/Colors'
import { signUp } from '@/src/lib/queries/auth'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SignUpScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const { error } = await signUp(email, password)

    if (error) {
      Alert.alert('Sign up failed', error.message)
      setLoading(false)
      return
    }

    Alert.alert(
      'Account created!',
      'Please check your email to confirm your account',
      [{ text: 'OK', onPress: () => router.replace('/sign-in') }]
    )
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Image
        source={require('@/assets/images/potato.png')}
        style={styles.potatoWatermark}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View>
              <View style={styles.logoRow}>
                <Text style={styles.logoAlgo}>ALGO</Text>
                <Text style={styles.logoRight}>Right</Text>
              </View>
              <Text style={styles.subtitle}>Create your account</Text>
            </View>
            <Image
              source={require('@/assets/images/Logo.png')}
              style={styles.logo}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="jon@gmail.com"
              placeholderTextColor="#c0b0a0"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#c0b0a0"
              style={[styles.input, styles.inputLast]}
              secureTextEntry
              autoCapitalize="none"
            />

            {loading
              ? <ActivityIndicator size="small" color={Colors.potato.tint} style={styles.spinner} />
              : <Button text="Create account" onPress={handleSignUp} />
            }
          </View>

          <Link href="/sign-in" style={styles.link}>
            Already have an account?{' '}
            <Text style={styles.linkBold}>Sign in</Text>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.potato.background,
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 28,
    justifyContent: 'center',
  },
  potatoWatermark: {
    position: 'absolute',
    right: -40,
    bottom: 60,
    width: 300,
    height: 300,
    opacity: 0.07,
    transform: [{ rotate: '-10deg' }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 1000,
    borderWidth: 1,
    resizeMode: 'contain',
    marginLeft: 10,
    borderColor: Colors.potato.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  logoAlgo: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.potato.darker,
    letterSpacing: 1,
  },
  logoRight: {
    fontSize: 36,
    fontWeight: '400',
    color: Colors.potato.tint,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.potato.text,
    fontWeight: '400',
  },
  card: {
   backgroundColor: Colors.potato.background,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.potato.text,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.potato.border,
    backgroundColor: Colors.potato.background,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.potato.darker,
    marginBottom: 18,
  },
  inputLast: {
    marginBottom: 4,
  },
  spinner: {
    marginVertical: 10,
  },
  link: {
    alignSelf: 'center',
    fontSize: 14,
    color: Colors.potato.text,
  },
  linkBold: {
    fontWeight: '700',
    color: Colors.potato.tint,
  },
})
