import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import * as Linking from 'expo-linking'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

//create one reusable client object for frontend to interact with supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true, 
        persistSession: true, 
        detectSessioonInUrl: false, 
    }
})

//when url algoright:// is received, Linking listener fires
//getSessionFromUrl extracts access_token & refresh_token
Linking.addEventListener('url', async ({ url }) => {
    if (url) {
        await supabase.auth.getSessionFromUrl({ url }) 
    }
})
