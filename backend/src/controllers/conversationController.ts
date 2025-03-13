import { Response } from 'express'
import Conversation from '../models/Conversation'
import { AuthRequest } from '../types/CustomRequest'
import mongoose from 'mongoose'
import { format, isToday, isYesterday, subDays, isWithinInterval } from 'date-fns'
import ollama from 'ollama'
import { catchAsyncErrors } from '../utils/errorHandler'

export const getConversations = catchAsyncErrors(
  async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user?.id) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const userId = req.user.id
    const searchQuery = req.query.search as string | undefined

    const query: Record<string, any> = { userId }
    if (searchQuery) {
      query.title = { $regex: searchQuery, $options: 'i' }
    }

    const conversations = await Conversation.find(query)
      .sort({ updatedAt: -1 })
      .select('_id title updatedAt')

    const grouped: Record<string, any[]> = {
      Today: [],
      Yesterday: [],
      'Last 7 Days': [],
      'Last 30 Days': [],
    }

    const today = new Date()
    const sevenDaysAgo = subDays(today, 7)
    const thirtyDaysAgo = subDays(today, 30)

    conversations.forEach((conv) => {
      const updatedAt = new Date(conv.updatedAt)

      let groupName = ''
      if (isToday(updatedAt)) {
        groupName = 'Today'
      } else if (isYesterday(updatedAt)) {
        groupName = 'Yesterday'
      } else if (isWithinInterval(updatedAt, { start: sevenDaysAgo, end: today })) {
        groupName = 'Last 7 Days'
      } else if (isWithinInterval(updatedAt, { start: thirtyDaysAgo, end: today })) {
        groupName = 'Last 30 Days'
      } else {
        groupName = format(updatedAt, 'MMMM yyyy')
      }

      if (!grouped[groupName]) {
        grouped[groupName] = []
      }
      grouped[groupName].push(conv)
    })

    const filteredGrouped = Object.fromEntries(
      Object.entries(grouped).filter(([_, conversations]) => conversations.length > 0),
    )

    res.json(filteredGrouped)
  },
)

export const getConversationById = catchAsyncErrors(
  async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user?.id) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user.id })

    if (!conversation) {
      res.status(404).json({ message: 'Conversation not found' })
      return
    }

    res.json(conversation)
  },
)

export const sendMessage = catchAsyncErrors(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { conversationId, content } = req.body
    if (!req.user?.id) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    let conversation
    if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
      conversation = await Conversation.findOne({ _id: conversationId, userId: req.user.id })
      if (!conversation) {
        res.status(404).json({ message: 'Conversation not found' })
        return
      }

      conversation.messages.push({ role: 'user', content })
    } else {
      conversation = await Conversation.create({
        userId: req.user.id,
        title: content.slice(0, 30),
        messages: [{ role: 'user', content }],
      })
    }

    // AI Response using Ollama
    const response = await ollama.chat({
      model: 'llama3.2', // TODO: List all supported models in the documentation
      messages: conversation.messages,
    })

    const aiMessage = {
      role: 'assistant',
      content: response.message.content,
    }

    conversation.messages.push(aiMessage)
    conversation.updatedAt = new Date()
    await conversation.save()

    res.json({ conversationId: conversation._id, message: aiMessage })
  },
)

export const renameConversation = catchAsyncErrors(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { title } = req.body
    if (!req.user?.id) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title },
      { new: true },
    )

    if (!conversation) {
      res.status(404).json({ message: 'Conversation not found' })
      return
    }

    res.json(conversation)
  },
)

export const deleteConversation = catchAsyncErrors(
  async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user?.id) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!conversation) {
      res.status(404).json({ message: 'Conversation not found' })
      return
    }

    res.json({ message: 'Conversation deleted successfully' })
  },
)
