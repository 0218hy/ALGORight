import { useLocalSearchParams } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

export default function AlgorithmDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    return (
        <View style={styles.container}>
            <Text>Algorithm { id } Detail Screen</Text>
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