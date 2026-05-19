import { bubbleSort } from "./algorithms/bubbleSort";
import { Step } from "./step";

export interface Algorithm {
    name: string;
    run: (input: number[]) => Step[];
}

export const algorithmRegistry = {
    bubbleSort,
}