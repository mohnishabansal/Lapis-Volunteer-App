// models/User.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  }
});

export default mongoose.models.User || mongoose.model('User', userSchema);