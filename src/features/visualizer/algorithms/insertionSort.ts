import { Step } from "../step";

export const insertionSort = {
    name: "Insertion Sort",
    run(input: number[]): Step[] {
        const steps: Step[] = [];
        const a = [...input];

        for (let i = 1; i < a.length; i++) {
            let j = i;
            while (j > 0) {
                steps.push({
                    type: "compare",
                    array: [...a],
                    indices: [j - 1, j],
                });

                if (a[j - 1] > a[j]) {
                    [a[j - 1], a[j]] = [a[j], a[j - 1]];
                    steps.push({
                        type: "swap",
                        array: [...a],
                        indices: [j - 1, j],
                    });
                    j--;
                } else {
                    break;
                }
            }
        }

        return steps;
    }
}