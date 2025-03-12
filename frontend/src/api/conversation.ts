import { ConversationProps } from "@/types/conversation"
import api from "@/utils/axiosInstance"

export const fetchConversations = async () => {
  const response = await api.get("/conversations")
  return response.data
}

export const fetchConversationById = async (conversationId: string): Promise<ConversationProps> => {
  const response = await api.get(`/conversations/${conversationId}`)
  return response.data
}

export const sendMessage = async (conversationId: string | null, content: string) => {
  const response = await api.post("/conversations/messages", { conversationId, content })
  return response.data
}

export const deleteConversation = async (conversationId: string) => {
  await api.delete(`/conversations/${conversationId}`)
}
