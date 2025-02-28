import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import OpenAI from 'openai'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 3005

const openai = new OpenAI({
  apiKey: process.env.API_KEY || '',
})

app.listen(port, () => console.log(`🚀 Server running on port ${port}`))
