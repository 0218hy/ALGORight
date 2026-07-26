import { Canvas, Rect, Text as SkiaText, matchFont } from "@shopify/react-native-skia";
import { Platform, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Step } from "../step";
import React from "react";


export function SortingVisualizer({ step }: { step: Step }) {
    const { width: windowWidth } = useWindowDimensions();

    if (!step?.array) return null;

    const canvasHeight = 220;
    const maxCardWidth = Math.min(windowWidth - 60, 360);
    const paddingGap = 5;
    const totalBars = step.array.length;
    const totalGapsWidth = paddingGap * (totalBars + 1);
    const barWidth = totalBars > 0 ? (maxCardWidth - totalGapsWidth) / totalBars : 0;
    const maxVal = totalBars > 0 ? Math.max(...step.array) : 1;

    const getBarColor = (index: number) => {
        const isHighlighted = step.indices?.includes(index);
        const meta = step.metadata;

        // binary search
        if (step.type === "found" && isHighlighted) return "green";
        if (step.type === "not_found") return "#ffcccb";
        if (meta?.midIndex === index) return "purple";

        // quicksort 
        if (meta?.pivotIndex !== undefined) {
            // in final sorted
            if (meta.sortedIndices?.includes(index)) {
                return "#57b369";
            }

            // out of partition
            if (
                meta.lowIndex !== undefined &&
                meta.highIndex !== undefined &&
                (index < meta.lowIndex || index > meta.highIndex)
            ) {
                return "#777879";
            }
    
            // pivot
            if (index === meta.pivotIndex)
                return "#9333ea";
    
            // Current active partition
            return "skyblue";
        }
    
        // bubble sort, insertion sort
        if (isHighlighted) {
            if (step.type === "compare") return "orange";
            if (step.type === "swap") return "red";
        }

        // selection sort
        if (meta?.minIndex !== undefined) {
            if (index === meta.minIndex) return "#9333ea";

            if (isHighlighted) {
                if (step.type === "compare") return "orange";
                if (step.type === "swap") return "red";
                if (step.type === "new_min") return "red";
            }
    
            return "skyblue";
        }


        return "skyblue";
    };

    if (Platform.OS === "web") {
        return (
            <View style={[styles.webCanvas, { width: maxCardWidth, height: canvasHeight }]}>
                {step.array.map((value, index) => {
                    const barHeight = (value / maxVal) * (canvasHeight - 40);

                    return (
                        <View
                            key={index}
                            style={[
                                styles.webBarSlot,
                                {
                                    width: barWidth,
                                    marginLeft: index === 0 ? paddingGap : 0,
                                    marginRight: paddingGap,
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.webBar,
                                    {
                                        height: barHeight,
                                        backgroundColor: getBarColor(index),
                                    },
                                ]}
                            />
                            <Text style={styles.webBarLabel}>{value}</Text>
                        </View>
                    );
                })}
            </View>
        );
    }

    const defaultFont = matchFont({
        fontFamily: Platform.select({ ios: "Helvetica", android: "sans-serif", default: "serif" }),
        fontSize: 14,
        fontWeight: "bold"
    });

    return (
        <Canvas style={[styles.canvas, { width: maxCardWidth, height: canvasHeight }]}>
            {step.array.map((value, index) => {
                const barHeight = (value / maxVal) * (canvasHeight - 40);
                const xPosition = paddingGap + index * (barWidth + paddingGap);
                const yPosition = canvasHeight - 25 - barHeight;
                
                const textString = value.toString();
                const textWidth = defaultFont ? defaultFont.measureText(textString).width : 0;
                const centeredX = xPosition + (barWidth / 2) - (textWidth / 2);

                return (
                    <React.Fragment key={index}>
                        <Rect
                            x={xPosition}
                            y={yPosition}
                            width={barWidth}
                            height={barHeight}
                            color={getBarColor(index)}
                        />
                        <SkiaText
                            x={centeredX}
                            y={yPosition + barHeight + 20 }
                            text={textString}
                            font={defaultFont}
                            color="black"
                        />
                    </React.Fragment>
                );
            })}
        </Canvas>
    )


}

const styles = StyleSheet.create({
    canvas: {
        backgroundColor: "transparent",
        marginTop: 10,
    },
    webCanvas: {
        alignItems: "flex-end",
        backgroundColor: "transparent",
        flexDirection: "row",
        marginTop: 10,
    },
    webBarSlot: {
        alignItems: "center",
        height: "100%",
        justifyContent: "flex-end",
    },
    webBar: {
        width: "100%",
    },
    webBarLabel: {
        color: "black",
        fontSize: 14,
        fontWeight: "bold",
        height: 20,
        lineHeight: 20,
        marginTop: 5,
        textAlign: "center",
    },
});
