import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100">404</h1>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Button className="mt-4" onClick={() => navigate(user ? '/conversation' : '/login')}>
        {user ? 'Go to Chat' : 'Back to Login'}
      </Button>
    </div>
  )
}

export default NotFoundPage
