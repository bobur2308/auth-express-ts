// src/models/Post.ts
import mongoose, { Schema, Document } from 'mongoose';

// Define the Post interface for TypeScript
export interface IAuth extends Document {
  email: string;
  password: string;
  full_name:string; 
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Post schema
const AuthSchema: Schema<IAuth> = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    full_name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, 
  }
);

// Export the Post model
const AuthModel =  mongoose.model<IAuth>('Auth-Model', AuthSchema);

export default AuthModel