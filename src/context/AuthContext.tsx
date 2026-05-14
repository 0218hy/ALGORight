import { Session, User } from '@supabase/supabase-js'
import { createContext, ReactNode, useContext } from 'react'
import { useAuth } from '../hooks/useAuth'

//define what the context holds
interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
}

//create context with default values 
//used if screen tries to access auth outside of provider
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
})

//create AuthProvider component 
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const auth = useAuth() //returns { user, session, loading }

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
} 

//create useAuthContext hook for easy access 
export const useAuthContext = () => useContext(AuthContext)

