import express from 'express'
import { register, login, logout, getUser, refreshAccessToken } from '../controllers/authController'
import { authenticateUser } from '../middleware/auth'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/user', authenticateUser, getUser)
router.get('/refresh', refreshAccessToken)

export default router
