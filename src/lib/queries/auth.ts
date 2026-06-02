import { supabase } from '../supabase'

//sign up a new user with email and password 
export const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })
    return { data, error } 
}

//sign in an existing user 
export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    return { data, error }
}

//sign out current user 
export const SignOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
}

// get user profile
export const fetchUserProfile = async (userId: string) => {
    const {data, error} = await supabase
    .from("profiles")
    .select('username, total_xp, current_level')
    .eq('id', userId)
    .single()
    return {data, error}
}

