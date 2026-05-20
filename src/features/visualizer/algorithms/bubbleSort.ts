import { Step } from "../step";

export const bubbleSort = {
    name: "Bubble Sort",
    run(input: number[]): Step[] {
        const steps: Step[] = [];
        const a = [...input];

        // normal bubble sort
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < a.length - i - 1; j++) {
                steps.push({
                    type: "compare",
                    array: [...a],
                    indices: [j, j + 1],
                });

                if (a[j] > a[j + 1]) {
                    [a[j], a[j + 1]] = [a[j + 1], a[j]];

                    steps.push({
                        type: "swap",
                        array: [...a],
                        indices: [j, j + 1],
                    });
                }
            }
        }

        return steps;
    }
}