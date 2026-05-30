import { useLocalSearchParams } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

export default function QuizScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    return (
        <View style={styles.container}>
            <Text>Quiz for algorithm: { id }</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})