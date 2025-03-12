import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Registration'
import NotFoundPage from './pages/NotFoundPage'
import { PublicRoute, PrivateRoute } from './components/auth/ProtectedRoute'
import AuthLayout from '@/components/layout/AuthLayout'
import MainLayout from '@/components/layout/MainLayout'
import Conversation from './pages/Conversation'
import { Toaster } from "sonner"

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/conversation" element={<Conversation key="conversation" />} />
              <Route path="/conversation/:id" element={<Conversation key="edit-conversation" />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  )
}

export default App
