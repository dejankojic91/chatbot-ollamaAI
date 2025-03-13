import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User, IUser } from '../models/User'
import { AuthRequest } from '../types/CustomRequest'
import { catchAsyncErrors } from '../utils/errorHandler'

const generateAccessToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '15m' })
}

const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.REFRESH_SECRET as string, { expiresIn: '7d' })
}

const generateAuthResponse = async (user: IUser, res: Response) => {
  const accessToken = generateAccessToken(user.id)
  const refreshToken = generateRefreshToken(user.id)

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })

  res.json({ accessToken })
}

export const register = catchAsyncErrors(async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, username, email, password } = req.body

  if (!firstName || !lastName || !username || !email || !password) {
    res.status(400).json({ message: 'All fields are required' })
    return
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    res.status(400).json({ message: 'Email already registered' })
    return
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = new User({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
    history: [],
  })

  await user.save()
  await generateAuthResponse(user, res)
})

export const login = catchAsyncErrors(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    res.status(400).json({ message: 'Invalid credentials' })
    return
  }

  await generateAuthResponse(user, res)
})

export const refreshAccessToken = catchAsyncErrors(
  async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      res.status(401).json({ message: 'No refresh token' })
      return
    }

    const user = await User.findOne({ refreshToken })
    if (!user) {
      res.status(403).json({ message: 'Invalid refresh token' })
      return
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET as string) as JwtPayload
    if (!decoded || !decoded.id) {
      res.status(403).json({ message: 'Invalid token payload' })
      return
    }

    const newAccessToken = generateAccessToken(decoded.id)
    res.json({ accessToken: newAccessToken })
  },
)

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('refreshToken')
  res.json({ message: 'Logged out successfully' })
}

export const getUserData = catchAsyncErrors(
  async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const user = await User.findById(req.user.id).select('firstName lastName username email')
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.json(user)
  },
)
