import { PostgrestError } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { getFlashCards } from '../lib/queries/flashcards'

interface Flashcard {
    id: string
    algorithm_id: string
    question: string
    answer: string
    order_index: number
    created_at: string
}

export const useFlashcards = (algorithmId: string) => {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<PostgrestError | null>(null)

    useEffect(() => {
        const fetchFlashcards = async () => {
        const { data, error } = await getFlashCards(algorithmId)

        if (error) {
            setError(error)
            setLoading(false)
            return
        }

        setFlashcards(data || [])
        setLoading(false)
        }

        fetchFlashcards()
    }, [algorithmId])

  return { flashcards, loading, error }
}