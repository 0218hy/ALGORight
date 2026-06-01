import { supabase } from '../supabase'

export const getFlashCards = async (algorithmId: string) => {
    const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('algorithm_id', algorithmId)
        .order('order_index', { ascending: true })

    return { data, error }
}