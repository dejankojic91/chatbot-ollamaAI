import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageListProps } from "@/types/conversation"

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
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
        messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <Avatar>
                <AvatarImage src="https://ui-avatars.com/api/?name=AI" alt="AI Avatar" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}
            <p
              className={`p-3 mb-2 rounded-lg max-w-[75%] ${
                msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
              }`}
            >
              {msg.content}
            </p>

            {msg.role === 'user' && (
              <Avatar>
                <AvatarImage src="https://ui-avatars.com/api/?name=User" alt="User Avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default MessageList
