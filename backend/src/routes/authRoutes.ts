import express from 'express'
import { register, login, logout, getUserData, refreshAccessToken } from '../controllers/authController'
import { authenticateUser } from '../middleware/auth'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/user', authenticateUser, getUserData)
router.get('/refresh', refreshAccessToken)

export default router
