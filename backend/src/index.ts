import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes'
import conversationRoutes from './routes/conversationRoutes'

dotenv.config()

const app = express()

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }))
app.use(express.json())
app.use(cookieParser())

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string)
    console.log('MongoDB Connected')
  } catch (error) {
    console.error('MongoDB Connection Error:', error)
    process.exit(1)
  }
}
connectDB()

app.use('/api/auth', authRoutes)
app.use('/api/conversations', conversationRoutes)

app.get('/', (req, res) => {
  res.send('🚀 API is running...')
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`🚀 Server running on port ${port}`))
