import { Document, Types } from 'mongoose';

export interface IAttachment {
  _id?: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface IAdvertisement extends Document {
  _id?: string;
  professionalId: string | Types.ObjectId;
  userId?: string | Types.ObjectId;
  appointmentId?: string | Types.ObjectId;
  appServiceId?: string | Types.ObjectId;
  title: string;
  description: string;
  targetType: 'MY_CLIENTS' | 'NON_APPOINTMENT_USERS' | 'ALL';
  startDate: Date;
  endDate: Date;
  attachments: IAttachment[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
