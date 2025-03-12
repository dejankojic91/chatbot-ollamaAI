import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import ConversationMessages from '@/components/conversation/MessageList'
import ConversationForm from '@/components/conversation/MessageForm'
import { fetchConversationById } from "@/api/conversation"
import { ConversationProps, Message } from "@/types/conversation"

const Conversation = () => {
  const { id: conversationId } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])

  const {
    data: conversation,
    isLoading,
  } = useQuery<ConversationProps, Error>({
    queryKey: ['conversation', conversationId],
    queryFn: async () => await fetchConversationById(conversationId!),
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
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        <ConversationMessages messages={messages} isLoading={isLoading} />
      </div>
      <ConversationForm
        conversationId={conversationId || null}
        onMessageSent={handleNewMessage}
        onNewConversation={handleNewConversation}
      />
    </div>
  )
}

export default Conversation
