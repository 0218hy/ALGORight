import Colors from "@/src/constants/Colors";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function Controls({
    isPlaying,
    play,
    pause,
    next,
    prev,
    reset,
    index,
    total,
}: {
    isPlaying: boolean;
    play: () => void;
    pause: () => void;
    next: () => void;
    prev: () => void;
    reset: () => void;
    index: number;
    total: number;
}) {
    return (
        <View style={styles.container}>
            <Pressable onPress={isPlaying ? pause : play} style={styles.button}>
                <Text style={styles.buttonText}>
                    {isPlaying ? 'Pause' : 'Play'}
                </Text>
            </Pressable>

            <Pressable onPress={prev} disabled={index == 0} style={[styles.button, index == 0 && styles.disabledButton]}>
                <Text style={[styles.buttonText, index == 0 && styles.disabledText]}>
                    Prev
                </Text>
            </Pressable>

            <Text style={styles.centeredText}>
                Step {index + 1} / {total}
            </Text>

            <Pressable onPress={next} disabled={index >= total - 1} style={[styles.button, index >= total - 1 && styles.disabledButton]}>
                <Text style={[styles.buttonText, index >= total - 1 && styles.disabledText]}>
                    Next
                </Text>
            </Pressable>

            <Pressable onPress={reset} disabled={index == 0}
                style={[styles.button, index == 0 && styles.disabledButton]}>
                <Text style={[styles.buttonText, index == 0 && styles.disabledText]}>
                    Reset
                </Text>
            </Pressable>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        padding: 15,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 12,
    },
    centeredText: {
        textAlign: 'center', 
        fontSize: 12,
        paddingTop: 10,
    },
    button: {
        backgroundColor: Colors.potato.darker,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#E5E5EA',
    },
    disabledText: {
        color: '#AEAEB2',
    },
});