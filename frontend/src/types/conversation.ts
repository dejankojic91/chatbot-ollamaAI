export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface ConversationProps {
  _id: string
  title: string
  messages: Message[]
}

export interface MessageListProps {
  messages: Message[]
  isLoading: boolean
}

export interface SendMessage {
  message: string
}

export interface MessageFormProps {
  conversationId: string | null
  onMessageSent: (message: Message) => void
  onNewConversation: (conversationId: string) => void
}

export interface ConversationHistory {
  _id: string
  title: string
}

export interface SidebarConversationItemProps {
  conv: ConversationHistory
}
