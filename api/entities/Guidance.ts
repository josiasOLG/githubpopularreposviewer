import { Document, Types } from 'mongoose';

export interface IAttachment {
  _id?: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface IGuidance extends Document {
  appServiceId: string | Types.ObjectId;
  categoryId: string;
  userId: string | Types.ObjectId;
  professionalId: string | Types.ObjectId;
  appointmentId: string | Types.ObjectId;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  attachments: IAttachment[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
