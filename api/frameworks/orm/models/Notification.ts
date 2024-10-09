import { Schema, model, Document, Types } from "mongoose";

export interface INotification extends Document {
  userId: Types.ObjectId;
  BarberId: string;
  message: string;
  read: boolean;
}

const notificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  BarberId: { type: String, required: false },
  message: { type: String, required: false },
  read: { type: Boolean, default: false },
});

export const Notification = model<INotification>(
  "Notification",
  notificationSchema
);
