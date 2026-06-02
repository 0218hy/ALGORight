import { Session, User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { fetchUserProfile } from '../lib/queries/auth'

export interface UserProfile {
    username: string
    total_xp: number
    current_level: number
}


interface AuthState {
    user: User | null 
    session: Session | null
    loading: boolean 
    profile: UserProfile | null
}

export const useAuth = (): AuthState => {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true) 

    const loadProfileData = async (userId: string) => {
        const { data, error } = await fetchUserProfile(userId)
        if (!error && data) {
            setProfile(data as UserProfile)
        } else {
            setProfile(null)
        }
    }
    
    useEffect(() => {
        //check if there is an existing session on mount
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) {
                await loadProfileData(session.user.id)
            }
            setLoading(false)
        })

        //listen for any auth change, fires automatically whenever auth state changes
        const { data: {subscription} } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session)
                setUser(session?.user ?? null)
                if(session?.user){
                    await loadProfileData(session.user.id)
                } 
                setLoading(false)
            }
        )
        
        //cleanup listener when component unmounts 
        return () => subscription.unsubscribe()
    }, [])

    return { user, session, loading, profile }
}