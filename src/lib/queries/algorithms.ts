import { supabase } from '../supabase'

//fetches all algorithms from supabase 
export const getAlgorithms = async () => {
    const { data, error } = await supabase
        .from('algorithms')
        .select('*')
        .order('category', { ascending: true }) //sort by category (if grouped by category) 

    return { data, error }
}

//fetches one specific algorithm by its ID 
export const getAlgorithmById = async (id: string) => {
    const { data, error } = await supabase
        .from('algorithms')
        .select('*')
        .eq('id',id)
        .single()

    return { data, error }    
}