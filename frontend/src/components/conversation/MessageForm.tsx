import React, { useCallback } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { MessageFormProps, SendMessage } from '@/types/conversation'
import { Loader2 } from 'lucide-react'
import { sendMessage } from '@/api/conversation'

const MessageForm: React.FC<MessageFormProps> = ({
  conversationId,
  onMessageSent,
  onNewConversation,
}) => {
  const { register, handleSubmit, reset } = useForm<SendMessage>()
  const queryClient = useQueryClient()

  const sendMessageMutation = useMutation({
    mutationFn: async (data: SendMessage) => {
      onMessageSent({ role: 'user', content: data.message })
      reset()
      return await sendMessage(conversationId || null, data.message)
    },
    onSuccess: (data) => {
      if (!conversationId) {
        onNewConversation(data.conversationId)
      }

      onMessageSent(data.message)
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] })
    },
    onError: () => {
      console.error('Failed to send message')
    },
  })

  const onSubmit = (data: SendMessage) => {
    if (!data.message.trim()) return
    sendMessageMutation.mutate(data)
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit(onSubmit)()
      }
    },
    [handleSubmit, onSubmit],
  )

  return (
    <form className="flex flex-row items-center gap-2 mt-4" onSubmit={handleSubmit(onSubmit)}>
      <Textarea
        {...register('message')}
        placeholder="Type your message..."
        className="resize-none"
        onKeyDown={handleKeyDown}
        disabled={sendMessageMutation.isPending}
      />

      <Button type="submit" className="px-6" disabled={sendMessageMutation.isPending}>
        {sendMessageMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Answering...
          </>
        ) : (
          'Send'
        )}
      </Button>
    </form>
  )
}

export default MessageForm
