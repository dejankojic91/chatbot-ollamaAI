import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageListProps } from '@/types/conversation'
import { useAuth } from '@/context/AuthContext'
import { getUserInitials } from '@/utils/user'

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const { user } = useAuth()

  return (
    <div className="flex-1 overflow-y-auto p-4 rounded-lg dark:bg-gray-800 flex flex-col gap-4">
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500 text-2xl font-semibold">How can we help you?</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="https://ui-avatars.com/api/?name=AI" alt="AI Avatar" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}
            <p
              className={`p-3 mb-2 rounded-lg max-w-[75%] ${
                message.role === 'user' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'
              }`}
            >
              {message.content}
            </p>

            {message.role === 'user' && (
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${getUserInitials(user?.firstName, user?.lastName)}`}
                  alt="User Avatar"
                />
                <AvatarFallback className="rounded-lg">
                  {getUserInitials(user?.firstName, user?.lastName)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default MessageList
