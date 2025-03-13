import { z } from 'zod'

export const registerSchema = z.object({
  firstName: z.string().min(3, 'First Name must be at least 3 characters'),
  lastName: z.string().min(3, 'Last Name must be at least 3 characters'),
  username: z.string().min(3, 'username must be at least 3 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
