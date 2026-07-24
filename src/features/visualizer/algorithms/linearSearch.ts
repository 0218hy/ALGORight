import { Step } from "../step";

export const linearSearch = {
    name: "Linear Search",

    run(input: number[], target: number): Step[] {
        const steps: Step[] = [];

        for (let i = 0; i < input.length; i++) {

            // Check current element
            steps.push({
                type: "check",
                array: [...input],
                indices: [i],
                metadata: {
                    targetValue: target,
                },
            });

            if (input[i] === target) {
                steps.push({
                    type: "found",
                    array: [...input],
                    indices: [i],
                    metadata: {
                        targetValue: target,
                    },
                });

                return steps;
            }
        }

        steps.push({
            type: "not_found",
            array: [...input],
            metadata: {
                targetValue: target,
            },
        });

        return steps;
    },
};