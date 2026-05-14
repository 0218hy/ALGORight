import Button from '@/src/components/Button';
import { Text } from '@/src/components/Themed';
import Colors from '@/src/constants/Colors';
import { useRouter } from "expo-router";
import React from 'react';
import { Image, ScrollView, StyleSheet, TextInput, View } from 'react-native';

export default function Visualizer() {
    const router = useRouter();
    return (
        <ScrollView contentContainerStyle={styles.screenView} showsVerticalScrollIndicator={false}>

            {/* Visualization */}
            <View style={styles.card}>
                <Text style={styles.title}> Selected Algorithm </Text>
                <Text> Some drop down option </Text>
                <View style={styles.greyCard}>
                    <Image
                        source={{ uri: 'picsum.photos' }}
                        style={styles.canvasPlaceholder}
                    />
                </View>
            </View>

            {/* Input & Load Data Card */}
            <View style={styles.card}>
                <Text style={styles.title}> Custom Input </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter data details..."
                    placeholderTextColor="#888"
                />

                <Button text="Load Data"
                    onPress={() => console.log('Load Data Clicked')}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screenView: {
        flex: 1,
        padding: 10,
        justifyContent: 'flex-start',
        backgroundColor: 'white',
    },
    card: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'flex-start',
        backgroundColor: Colors.potato.background,
        padding: 10,
        borderRadius: 15,
        marginBottom: 20,
    },
    greyCard: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: '#eef0f2',
        padding: 10,
        borderRadius: 15,
        marginTop: 10,
        width: '100%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        color: Colors.potato.darker,
    },
    canvasPlaceholder: {
        width: '100%',
        height: 220,
        resizeMode: 'cover', // for image to be put in 
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        borderColor: '#e2e8f0',
        borderWidth: 1,
        marginVertical: 5,
        color: '#000',
    },


});
