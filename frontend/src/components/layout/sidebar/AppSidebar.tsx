import { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import SidebarConversationItem from './SidebarConversationItem'
import { fetchConversations } from '@/api/conversation'
import { ConversationHistory } from '@/types/conversation'
import { useDebounce } from '@/hooks/useDebounce'

const AppSidebar = () => {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const { data: conversations, isLoading } = useQuery<{ [key: string]: ConversationHistory[] }>({
    queryKey: ['conversations', debouncedSearch],
    queryFn: () => fetchConversations(debouncedSearch),
  })

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }, [])

  return (
    <Sidebar className=" border-r bg-gray-900">
      <SidebarContent className="h-screen flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">AI Chat</h2>
        </div>

        <div className="px-4">
          {/* TODO: Implement Search */}
          <Input
            placeholder="Search conversations..."
            className="mt-2"
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <p className="text-gray-400 text-center mt-4">Loading...</p>
          ) : (
            Object.entries(conversations || {}).map(([group, items]) => (
              <SidebarGroup key={group}>
                <SidebarGroupLabel className="text-gray-400 uppercase text-sm mt-2">
                  {group}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((conv) => (
                      <SidebarConversationItem key={conv._id} conv={conv} />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))
          )}
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
