import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import AppSidebar from './sidebar/AppSidebar'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus } from 'lucide-react'
import { getUserInitials } from '@/utils/user'

const MainLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (user === null) {
    return <Navigate to="/login" replace />
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />

        <div className="flex flex-col flex-1 ">
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
                  <div className="flex items-center gap-2 px-1  text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={`https://ui-avatars.com/api/?name=${getUserInitials(user?.firstName, user?.lastName)}`}
                        alt="User Avatar"
                      />
                      <AvatarFallback className="rounded-lg">
                        {getUserInitials(user?.firstName, user?.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user.username}</span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>

          <div className="flex-1 overflow-y-auto p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default MainLayout
