import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import AppSidebar from './AppSidebar'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus } from 'lucide-react'

const MainLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  console.log(user)

  if (user === null) {
    return <Navigate to="/login" replace />
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />

        <div className="flex flex-col flex-grow ">
          <nav className="flex items-center justify-between px-4 py-3 border-b">
            <SidebarTrigger />

            <div className="ml-auto flex items-center gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigate('/conversation')}
              >
                <Plus className="w-4 h-4" />
                New Conversation
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src="https://ui-avatars.com/api/?name=User" alt="User Avatar" />
                    {/* <AvatarFallback>{user?.user}</AvatarFallback> */}
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>

          <div className="flex-grow flex justify-center items-center p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default MainLayout
