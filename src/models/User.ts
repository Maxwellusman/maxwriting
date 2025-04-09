import { Schema, model, models } from 'mongoose';

export interface UserDocument extends Document {
  username: string;
  password: string;
}

const UserSchema = new Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Explicitly set the collection name to 'users'
const User = models.User || model<UserDocument>('myblog', UserSchema, 'users');

export default User;