 import { supabase } from '../supabase'

 export const getAlgorithmSummary = async (algorithmId: string) => {
    const { data, error } = await supabase
        .from('algorithm_summaries') 
        .select('*')
        .eq('algorithm_id', algorithmId)
        .single() 

        return { data, error }
 }