import type { PostgrestError } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { getAlgorithmSummary } from '../lib/queries/summaries'

interface AlgorithmSummary {
    id: string
    algorithm_id: string
    content: string
    how_it_works: string
    key_points: string[]
    when_to_use: string
    time_complexity: string
    space_complexity: string
    created_at: string
} 

export const useAlgorithmSummary = (algorithmId: string) => {
    const [ summary, setSummary ] = useState<AlgorithmSummary | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<PostgrestError | null>(null)

    useEffect(() => {
        const fetchSummary = async () => {
            const { data, error } = await getAlgorithmSummary(algorithmId)

            if (error) {
                setError(error)
                setLoading(false)
                return
            }

            setSummary(data)
            setLoading(false)
        }

        fetchSummary()
    }, [algorithmId])

    return { summary, loading, error }
} 