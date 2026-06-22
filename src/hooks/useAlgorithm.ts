import { PostgrestError } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { getAlgorithmById } from '../lib/queries/algorithms'

interface Algorithm {
  id: string
  title: string
  category: string
  difficulty: string
  description: string | null
  youtube_url: string | null
  created_at: string
}

export const useAlgorithm = (id?: string) => {
  const [algorithm, setAlgorithm] = useState<Algorithm | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<PostgrestError | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetchAlgorithm = async () => {
      setLoading(true)

      const { data, error } = await getAlgorithmById(id)

      if (error) {
        setError(error)
        setLoading(false)
        return
      }

      setAlgorithm(data as Algorithm)
      setLoading(false)
    }

    fetchAlgorithm()
  }, [id])

  return { algorithm, loading, error }
}