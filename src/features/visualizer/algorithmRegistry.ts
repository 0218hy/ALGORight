import { bubbleSort } from "./algorithms/bubbleSort";
import { testSort } from "./algorithms/testSort";
import { Step } from "./step";

export interface Algorithm {
    name: string;
    run: (input: number[]) => Step[];
}

export const algorithmRegistry: Algorithm[] = [
    bubbleSort,
    testSort,
];