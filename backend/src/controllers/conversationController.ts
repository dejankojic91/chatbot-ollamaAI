import dotenv from 'dotenv'
dotenv.config()

import { Response } from 'express'
import Conversation from '../models/Conversation'
// import OpenAI from 'openai'
import { AuthRequest } from '../types/CustomRequest'
import mongoose from 'mongoose'
import { format, isToday, isYesterday, subDays, isWithinInterval } from 'date-fns'
import ollama from 'ollama'

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const conversations = await Conversation.find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
      .select('_id title updatedAt')
    const grouped: Record<string, any[]> = {
      Today: [],
      Yesterday: [],
      'Last 7 Days': [],
      'Last 30 Days': [],
    }

    const today = new Date()
    const yesterday = subDays(today, 1)
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
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const getConversationById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { conversationId, content } = req.body
    if (!req.user?.id) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    let conversation

    if (
      !conversationId ||
      typeof conversationId !== 'string' ||
      !mongoose.Types.ObjectId.isValid(conversationId)
    ) {
      conversation = await Conversation.create({
        userId: req.user.id,
        title: content.slice(0, 30),
        messages: [{ role: 'user', content }],
      })
    } else {
      conversation = await Conversation.findOne({ _id: conversationId, userId: req.user.id })
      if (!conversation) {
        res.status(404).json({ message: 'Conversation not found' })
        return
      }

      conversation.messages.push({ role: 'user', content })
    }

    const response = await ollama.chat({
      model: 'llama3.2', //TODO: write all possible ollama models  in comment
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
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const renameConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const deleteConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}
