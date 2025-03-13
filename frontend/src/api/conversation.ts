import { ConversationProps } from '@/types/conversation'
import api from '@/utils/axiosInstance'

export const fetchConversations = async (searchTerm?: string) => {
  const response = await api.get('/conversations', {
    params: searchTerm ? { search: searchTerm } : {},
  })
  return response.data
}

export const fetchConversationById = async (conversationId: string): Promise<ConversationProps> => {
  const response = await api.get(`/conversations/${conversationId}`)
  return response.data
}

export const sendMessage = async (conversationId: string | null, content: string) => {
  const response = await api.post('/conversations/messages', { conversationId, content })
  return response.data
}

export const deleteConversation = async (conversationId: string): Promise<void> => {
  await api.delete(`/conversations/${conversationId}`)
}
