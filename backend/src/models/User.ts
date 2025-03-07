import mongoose from "mongoose";

interface IUser extends mongoose.Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  refreshToken?: string;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
