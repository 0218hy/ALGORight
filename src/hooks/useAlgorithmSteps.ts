import { useState } from 'react';
import { cacheSteps, generateSteps, getCachedSteps } from '../lib/queries/algorithmSteps';

//sorting step
interface SortingStep {
    algorithmType: 'sorting'
    array: number[]
    comparing: number[]
    swapped: boolean
    sorted: number[]
}

//tree step 
interface TreeStep {
    algorithmType: 'tree'
    tree: object 
    visited: number
    action: string
}

//graph step 
interface GraphStep {
    algorithmType: 'graph'
    graph: object
    visited: number[]
    current: number 
    action: string 
}

//union steps
type Step = SortingStep | TreeStep | GraphStep 

export const useAlgorithmSteps = () => {
    const [steps, setSteps] = useState<Step[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getSteps = async (
        algorithmId: string,
        algorithmTitle: string, 
        inputData: any 
    ) => {
        setLoading(true)
        setError(null)

        //check cached or not 
        const { data: cached } = await getCachedSteps(algorithmId, inputData)

        if (cached) {
            setSteps(cached.steps)
            setLoading(false)
            return 
        }

        //not cached -> call Edge Function 
        const { data, error: generateError } = await generateSteps(
            algorithmTitle,
            inputData 
        )

        //error check 
        if (generateError || !data) {
            setError(generateError?.message || 'Failed to generate steps')
            setLoading(false)
            return
        }

        //store to cache
        await cacheSteps(algorithmId, inputData, data.steps)

        setSteps(data.steps)
        setLoading(false) 
    } 

    return { steps, loading, error, getSteps }
}




