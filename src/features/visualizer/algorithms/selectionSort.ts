import { Step } from "../step";

export const selectionSort = {
    name: "Selection Sort",

    run(input: number[]): Step[] {
        const steps: Step[] = [];
        const a = [...input];

        for (let i = 0; i < a.length - 1; i++) {
            let minIdx = i;

            // initial minimum 
            steps.push({
                type: "select_min",
                array: [...a],
                metadata: {
                    minIndex: minIdx,
                },
            });

            for (let j = i + 1; j < a.length; j++) {

                steps.push({
                    type: "compare",
                    array: [...a],
                    indices: [j],
                    metadata: {
                        minIndex: minIdx,
                    },
                });

                if (a[j] < a[minIdx]) {
                    minIdx = j;

                    steps.push({
                        type: "new_min",
                        array: [...a],
                        indices: [j],
                        metadata: {
                            minIndex: minIdx,
                        },
                    });
                }
            }

            if (minIdx !== i) {
                [a[i], a[minIdx]] = [a[minIdx], a[i]];

                steps.push({
                    type: "swap",
                    array: [...a],
                    indices: [i, minIdx],
                    metadata: {
                        minIndex: minIdx,
                    },
                });
            }
        }

        return steps;
    },
};