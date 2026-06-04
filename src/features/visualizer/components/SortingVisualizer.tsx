import { Canvas, Rect, Text, matchFont } from "@shopify/react-native-skia";
import { StyleSheet, useWindowDimensions } from "react-native";
import { Step } from "../step";
import React from "react";
import {Platform} from "react-native";


export function SortingVisualizer({ step }: { step: Step }) {
    const { width: windowWidth } = useWindowDimensions();

    if (!step.array) return null;

    const canvasHeight = 220;
    const maxCardWidth = Math.min(windowWidth - 60, 360);
    const paddingGap = 5;
    const totalBars = step.array.length;
    const totalGapsWidth = paddingGap * (totalBars + 1);
    const barWidth = totalBars > 0 ? (maxCardWidth - totalGapsWidth) / totalBars : 0;
    const maxVal = totalBars > 0 ? Math.max(...step.array) : 1;

    const defaultFont = matchFont({
        fontFamily: Platform.select({ ios: "Helvetica", android: "sans-serif", default: "serif" }),
        fontSize: 14,
        fontWeight: "bold"
    });

    return (
        <Canvas style={[styles.canvas, { width: maxCardWidth, height: canvasHeight }]}>
            {step.array.map((value, index) => {
                const highlighted = step.indices?.includes(index);
                let color = "skyblue";

                if (highlighted && step.type == "compare") {
                    color = "orange";
                }

                if (highlighted && step.type == "swap") {
                    color = "red";
                }

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
                            color={color}
                        />
                        <Text
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
});