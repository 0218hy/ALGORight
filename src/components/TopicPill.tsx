import Colors from '@/src/constants/Colors'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { StyleSheet, Text, View } from 'react-native'

interface Props {
    label: string
    icon: keyof typeof FontAwesome.glyphMap
}

export function TopicPill({ label, icon }: Props) {
    return (
    <View style={styles.topRow}>
        <View style={styles.topicPill}>
        <FontAwesome
            name={icon}
            size={12}
            color={Colors.potato.darker}
        />
        <Text style={styles.topicText}>{label}</Text>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    topRow: { 
        width: '100%',
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: 12, 
        marginBottom: 12,
    },
    topicPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.potato.warm,
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 50,
    },

    topicText: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: Colors.potato.text,
    },
})
