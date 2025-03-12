import { Outlet } from 'react-router-dom'

const AuthLayout = () => (
  <div className="flex justify-center items-center h-screen">
    <Outlet />
  </div>
)

export default AuthLayout
