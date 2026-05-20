export type Step = {
    type: string;
    array?: number[];
    indices?: [number, number];
    nodes?: number[]; // jic we want to make tree
}