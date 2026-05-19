import { Canvas, Rect } from "@shopify/react-native-skia";
import { StyleSheet, useWindowDimensions } from "react-native";
import { Step } from "../step";

export function SortingVisualizer({ step }: { step: Step }) {
    const { width: windowWidth } = useWindowDimensions();

    if (!step.array) return null;

    // change later
    const canvasHeight = 220;
    const maxCardWidth = Math.min(windowWidth - 60, 360);
    const paddingGap = 5;
    const totalBars = step.array.length;
    const totalGapsWidth = paddingGap * (totalBars + 1);
    const barWidth = totalBars > 0 ? (maxCardWidth - totalGapsWidth) / totalBars : 0;
    const maxVal = totalBars > 0 ? Math.max(...step.array) : 1;

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

                const barHeight = (value / maxVal) * (canvasHeight - 20);
                const xPosition = paddingGap + index * (barWidth + paddingGap);
                const yPosition = canvasHeight - barHeight;

                return (
                    <Rect
                        key={index}
                        x={xPosition}
                        y={yPosition}
                        width={barWidth}
                        height={barHeight}
                        color={color}
                    />
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