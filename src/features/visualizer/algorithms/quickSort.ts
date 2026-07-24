import { Step } from "../step";

export const quickSort = {
    name: "Quick Sort",

    run(input: number[]): Step[] {
        const steps: Step[] = [];
        const a = [...input];

        // Stores pivots that have reached their final sorted position
        const sortedIndices: number[] = [];

        function partition(low: number, high: number): number {
            const pivotValue = a[high];

            // Step 1: Highlight the current pivot
            steps.push({
                type: "pivot_select",
                array: [...a],
                metadata: {
                    lowIndex: low,
                    highIndex: high,
                    pivotIndex: high,
                    sortedIndices: [...sortedIndices],
                },
            });

            let i = low - 1;

            for (let j = low; j < high; j++) {
                if (a[j] < pivotValue) {
                    i++;
                    [a[i], a[j]] = [a[j], a[i]];
                }
            }

            const pivotIndex = i + 1;

            if (pivotIndex !== high) {
                [a[pivotIndex], a[high]] = [a[high], a[pivotIndex]];
            }

            // This pivot is now fixed forever
            sortedIndices.push(pivotIndex);

            // Step 2: Show the completed partition
            steps.push({
                type: "pivot_place",
                array: [...a],
                metadata: {
                    lowIndex: low,
                    highIndex: high,
                    pivotIndex,
                    sortedIndices: [...sortedIndices],
                },
            });

            return pivotIndex;
        }

        function sort(low: number, high: number) {
            if (low >= high) {
                // Single element is already sorted
                if (low === high && !sortedIndices.includes(low)) {
                    sortedIndices.push(low);

                    steps.push({
                        type: "sorted",
                        array: [...a],
                        metadata: {
                            sortedIndices: [...sortedIndices],
                        },
                    });
                }
                return;
            }

            const pivot = partition(low, high);

            sort(low, pivot - 1);
            sort(pivot + 1, high);
        }

        sort(0, a.length - 1);

        return steps;
    },
};