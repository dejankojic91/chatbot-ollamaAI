import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
)

export const User = mongoose.model<IUser>('User', UserSchema)
