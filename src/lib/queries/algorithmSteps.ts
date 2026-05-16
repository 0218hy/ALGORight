import { supabase } from '../supabase'

//check if steps alr exist in cache, if yes, retrieve steps
export const getCachedSteps = async (
    algorithmId: string,
    inputData: any
) => {
    const arrayKey = JSON.stringify(inputData) //database stores text 

    const { data, error } = await supabase
        .from('algorithm_steps')
        .select('steps')
        .eq('algorithm_id', algorithmId)
        .eq('input_array', arrayKey)
        .single() 

    return { data, error }
}

//insert steps if not cached 
export const cacheSteps = async (
    algorithmId: string,
    inputData: any,
    steps: any[]
) => {
    const dataKey = JSON.stringify(inputData) 

    const { data, error } = await supabase
        .from('algorithm_steps')
        .insert({
            algorithm_id: algorithmId, 
            input_data: dataKey,
            steps: steps 
        }) 

    return { data, error }
}

//call Edge Function to generate steps 
export const generateSteps = async (
    algorithmTitle: string,
    inputData: any
) => {
    const { data, error } = await supabase.functions.invoke('generate-steps', {
        body: {
            algorithm: algorithmTitle,
            inputData: inputData 
        }
    })
    return { data, error }
}



