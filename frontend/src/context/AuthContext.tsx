import { createContext, useContext, ReactNode } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { LoginCredentials, RegisterCredentials } from '@/types/auth'
import { getAuthUser, login, logoutUser, registerUser } from '@/api/auth'

interface AuthContextType {
  user: { _id: string; username: string; firstName: string; lastName: string; email: string } | null
  login: (data: LoginCredentials) => Promise<void>
  register: (data: RegisterCredentials) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken')
      if (!token) throw new Error('No token found')

      return await getAuthUser()
    },
    enabled: !!localStorage.getItem('accessToken'),
    retry: false,
    staleTime: 1000 * 60 * 5,
  })

  const loginMutation = useMutation({
    mutationFn: async (data: LoginCredentials) => {
      await login(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterCredentials) => {
      await registerUser(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logoutUser()
    },
    onSuccess: () => {
      queryClient.setQueryData(['authUser'], null)
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    },
  })

  return (
    <AuthContext.Provider
      value={{
        user,
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout: logoutMutation.mutate,
      }}
    >
      {isLoading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
