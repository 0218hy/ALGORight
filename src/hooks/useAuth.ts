import { Session, User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface AuthState {
    user: User | null 
    session: Session | null
    loading: boolean 
}

export const useAuth = (): AuthState => {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true) 

    useEffect(() => {
        //check if there is an existing session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        //listen for any auth change, fires automatically whenever auth state changes
        const { data: {subscription} } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session)
                setUser(session?.user ?? null)
                setLoading(false)
            }
        )
        
        //cleanup listener when component unmounts 
        return () => subscription.unsubscribe()
    }, [])

    return { user, session, loading }
}