import express from 'express'
import {
  getConversations,
  getConversationById,
  sendMessage,
  renameConversation,
  deleteConversation,
} from '../controllers/conversationController'
import { authenticateUser } from '../middleware/auth'

const router = express.Router()

router.get('/', authenticateUser, getConversations)
router.get('/:id', authenticateUser, getConversationById)
router.post('/messages', authenticateUser, sendMessage)
router.patch('/:id', authenticateUser, renameConversation)
router.delete('/:id', authenticateUser, deleteConversation)

export default router
