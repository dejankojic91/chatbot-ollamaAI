import React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import api from '@/utils/axiosInstance'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { MessageFormProps } from "@/types/conversation"

interface ChatForm {
  message: string
}

const MessageForm: React.FC<MessageFormProps> = ({
  conversationId,
  onMessageSent,
  onNewConversation,
}) => {
  const { register, handleSubmit, reset } = useForm<ChatForm>()
  const queryClient = useQueryClient()

  const sendMessageMutation = useMutation({
    mutationFn: async (data: ChatForm) => {
      onMessageSent({ role: 'user', content: data.message })

      const res = await api.post('/conversations/messages', {
        conversationId: conversationId || null,
        content: data.message,
      })

      return res.data
    },
    onSuccess: (data) => {
      if (!conversationId) {
        onNewConversation(data.conversationId)
      }

      onMessageSent(data.message)

      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] })

      reset()
    },
    onError: () => {
      console.error('Failed to send message')
    },
  })

  const onSubmit = (data: ChatForm) => {
    if (!data.message.trim()) return
    sendMessageMutation.mutate(data)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(onSubmit)()
    }
  }

  return (
    <form className="flex flex-row items-center gap-2 mt-4" onSubmit={handleSubmit(onSubmit)}>
      <Textarea
        {...register('message')}
        placeholder="Type your message..."
        className="resize-none"
        onKeyDown={handleKeyDown}
      />

      <Button type="submit" className="px-6" disabled={sendMessageMutation.isPending}>
        {sendMessageMutation.isPending ? 'Sending...' : 'Send'}
      </Button>
    </form>
  )
}

export default MessageForm
