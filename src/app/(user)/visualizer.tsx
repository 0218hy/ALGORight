import Button from '@/src/components/Button';
import { Text } from '@/src/components/Themed';
import Colors from '@/src/constants/Colors';
import { Controls } from '@/src/features/visualizer/components/Controls';
import { SortingVisualizer } from '@/src/features/visualizer/components/SortingVisualizer';
import { useVisualizer } from '@/src/features/visualizer/hooks/useVisualizer';
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, View } from 'react-native';


export default function Visualizer() {
    const router = useRouter();

    const [inputText, setInputText] = useState("5 3 8 4 1 2");
    const [currentInput, setCurrentInput] = useState([5, 3, 8, 4, 1, 2]);

    // hard coded as of now
    const visualizer = useVisualizer({
        algorithmKey: "bubbleSort",
        input: currentInput,
    })

    // handle data input
    const handleLoadData = () => {
        const numberArray = inputText
            ? inputText
                .split(' ')
                .map(item => item.trim())
                .filter(item => item !== '')
                .map(item => Number(item))
                .filter(num => !isNaN(num))
            : [];
        if (numberArray.length > 0) {
            setCurrentInput(numberArray);
            visualizer.reset();
        } else {
            Alert.alert("Error", "No input detected. Key in space separated numbers!");
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.screenView} showsVerticalScrollIndicator={false}>

            {/* Visualization */}
            <View style={styles.card}>
                <Text style={styles.title}> Selected Algorithm </Text>
                <Text> Some drop down option </Text>

                {/* Skia */}
                <View style={styles.greyCard}>
                    <SortingVisualizer step={visualizer.step} />
                </View>

                {/* Control */}
                <Controls
                    isPlaying={visualizer.isPlaying}
                    play={visualizer.play}
                    pause={visualizer.pause}
                    next={visualizer.next}
                    prev={visualizer.prev}
                    reset={visualizer.reset}
                    index={visualizer.index}
                    total={visualizer.total}
                />
            </View>

            {/* Input & Load Data Card */}
            <View style={styles.card}>
                <Text style={styles.title}> Custom Input </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Eg. 5 3 8 4 1 2"
                    placeholderTextColor="#888"
                    keyboardType='numbers-and-punctuation'
                    value={inputText}
                    onChangeText={setInputText}
                />

                <Button text="Load Data"
                    onPress={handleLoadData}
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
