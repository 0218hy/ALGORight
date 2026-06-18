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

export const getAlgorithmNameById = async (id:string): Promise<string> => {
    const { data, error } = await supabase
        .from('algorithms')
        .select('title')
        .eq('id', id)
        .maybeSingle();

        if (error || !data?.title) {
            console.error(`Failed to fetch algorithm name:`, error);
            throw new Error(`Failed to fetch algorithm name`);
        }
        return data.title;    
}