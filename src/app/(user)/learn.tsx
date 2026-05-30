import { StyleSheet, Text, View } from 'react-native'

export default function LearnScreen() {
    return (
        <View style={styles.container}>
            <Text>Learn Screen</Text>
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