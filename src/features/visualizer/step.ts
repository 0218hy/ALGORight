// export type Step = {
//     type: string;
//     array?: number[];
//     indices?: [number, number];
//     nodes?: number[]; // jic we want to make tree
// }

export type Step = {
    // type: "compare", "swap", "found", "not_found", "pivot_select", "range_discard"
    type: string; 
    array?: number[]; 
    indices?: number[]; 
    metadata?: {
        // quick sort
        pivotIndex?: number;
        sortedIndices?: number[];
        lowIndex?: number;      
        highIndex?: number;   
        
        // selection sort
        minIndex?: number;
        
        // binary search 
        midIndex?: number; 
        targetValue?: number;   
        
    };
    nodes?: number[]; // jic for future trees/graphs
};