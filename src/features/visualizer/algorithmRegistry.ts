import { bubbleSort } from "./algorithms/bubbleSort";
import { insertionSort } from "./algorithms/insertionSort";
import { linearSearch } from "./algorithms/linearSearch";
import { quickSort } from "./algorithms/quickSort";
import { selectionSort } from "./algorithms/selectionSort";
import { Step } from "./step";

export interface Algorithm {
    name: string;
    run: (input: number[]) => Step[];
}

export const algorithmRegistry: Algorithm[] = [
    bubbleSort,
    insertionSort,
    quickSort,
    selectionSort,
    linearSearch,
];