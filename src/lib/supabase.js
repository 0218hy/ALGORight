import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
const isBrowser = typeof window !== 'undefined'

const webLocalStorage = {
    getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
    setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
    removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
}

const serverStorage = {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
}

const authStorage = !isBrowser
    ? serverStorage
    : Platform.OS === 'web'
        ? webLocalStorage
        : AsyncStorage

//create one reusable client object for frontend to interact with supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: authStorage,
        autoRefreshToken: isBrowser, 
        persistSession: true, 
        detectSessionInUrl: false, 
    }
})
