import { PostgrestError } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { getAlgorithms } from '../lib/queries/algorithms'

interface Algorithm {
    id: string
    title: string
    category: string
    difficulty: string
    description: string | null
    youtube_url: string | null
    created_at: string 
}

export const useAlgorithms = () => {
    const [algorithms, setAlgorithms] = useState<Algorithm[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<PostgrestError | null>(null)

    useEffect(() => {
        const fetchAlgorithms = async () => {
            const { data, error } = await getAlgorithms()

            if (error) {
                setError(error)
                setLoading(false)
                return
            }

            setAlgorithms((data ?? []) as Algorithm[])
            setLoading(false)
        }

        fetchAlgorithms()
    }, [])

    return { algorithms, loading, error }
}