import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/utils/axiosInstance'
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
import SidebarConversationItem from "./SidebarHistoryItem"

interface Conversation {
  _id: string
  title: string
}

const SidebarHistoryItem = () => {
  const [search, setSearch] = useState('')

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await api.get('/conversations')
      return res.data
    },
  })

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
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <p className="text-gray-400 text-center mt-4">Loading...</p>
          ) : (
            Object.entries(conversations || {}).map(([group, items]) =>
              (items as Conversation[]).filter((conv) =>
                conv.title.toLowerCase().includes(search.toLowerCase()),
              ).length > 0 ? (
                <SidebarGroup key={group}>
                  <SidebarGroupLabel className="text-gray-400 uppercase text-sm mt-2">
                    {group}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {(items as Conversation[])
                        .filter((conv) => conv.title.toLowerCase().includes(search.toLowerCase()))
                        .map((conv) => (
                          <SidebarConversationItem key={conv._id} conv={conv} />
                        ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ) : null,
            )
          )}
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}

export default SidebarHistoryItem
