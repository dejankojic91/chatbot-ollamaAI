import { memo, useCallback, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuAction } from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { MoreHorizontal, Edit, Trash } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SidebarConversationItemProps } from '@/types/conversation'
import { deleteConversation } from '@/api/conversation'

const SidebarConversationItem: React.FC<SidebarConversationItemProps> = memo(({ conv }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const isActive = location.pathname === `/conversation/${conv._id}`

  const deleteMutation = useMutation({
    mutationFn: deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      setDeleteDialogOpen(false)
    },
  })

  const handleMouseEnter = useCallback(
    (id: string) => {
      if (hoveredId !== id) setHoveredId(id)
    },
    [hoveredId],
  )

  const handleMouseLeave = useCallback(() => {
    !isMenuOpen && setHoveredId(null)
  }, [isMenuOpen])

  const handleDelete = useCallback(() => {
    deleteMutation.mutate(conv._id)
  }, [conv._id, deleteMutation])

  return (
    <>
      <SidebarMenuItem
        key={conv._id}
        className="flex justify-between items-center"
        onMouseEnter={() => handleMouseEnter(conv._id)}
        onMouseLeave={handleMouseLeave}
      >
        <SidebarMenuButton
          asChild
          onClick={() => navigate(`/conversation/${conv._id}`)}
          className={`flex justify-between items-center cursor-pointer px-2 py-2 rounded-md transition `}
          isActive={isActive}
        >
          <span>{conv.title}</span>
        </SidebarMenuButton>

        {hoveredId === conv._id && (
          <DropdownMenu open={isMenuOpen} onOpenChange={(open) => setIsMenuOpen(open)}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction>
                <MoreHorizontal className="w-4 h-4" />
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              align="start"
              onCloseAutoFocus={() => setHoveredId(null)}
            >
              {/* TODO: Implement Rename */}
              <DropdownMenuItem disabled>
                <Edit className="mr-2 h-4 w-4" />
                <span>Rename</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setDeleteDialogOpen(true)
                  setIsMenuOpen(false)
                }}
              >
                <Trash className="mr-2 h-4 w-4 text-red-600" />
                <span className="text-red-600">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <h2 className="text-lg font-bold">Delete Conversation</h2>
            <p>Are you sure you want to delete this conversation? This action cannot be undone.</p>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
})

export default SidebarConversationItem
