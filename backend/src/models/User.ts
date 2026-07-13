import { Document, model, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  phone: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>('User', UserSchema);
