import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '@/utils/axiosInstance'
import ConversationMessages from '@/components/conversation/ConversationMessages'
import ConversationForm from '@/components/conversation/ConversationForm'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ConversationProps {
  _id: string
  title: string
  messages: Message[]
}

const Conversation = () => {
  const { id: conversationId } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])

  const {
    data: conversation,
    isLoading,
    refetch,
  } = useQuery<ConversationProps, Error>({
    queryKey: ['conversation', conversationId],
    queryFn: async (): Promise<ConversationProps> => {
      const res = await api.get(`/conversations/${conversationId}`)
      return res.data
    },
    enabled: !!conversationId,
  })

  useEffect(() => {
    if (conversation?.messages) {
      setMessages(conversation.messages)
    }
  }, [conversation])

  const handleNewMessage = (newMessage: Message) => {
    setMessages((prev) => [...prev, newMessage])
  }

  const handleNewConversation = (newConversationId: string) => {
    navigate(`/conversation/${newConversationId}`)
  }

  return (
    <div className="flex flex-col flex-1 justify-between h-full w-full p-4">
      <ConversationMessages messages={messages} isLoading={isLoading} />
      <ConversationForm
        conversationId={conversationId || null}
        onMessageSent={handleNewMessage}
        onNewConversation={handleNewConversation}
      />
    </div>
  )
}

export default Conversation
