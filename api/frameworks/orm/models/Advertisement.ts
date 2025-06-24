import { Document, model, Schema, Types } from 'mongoose';

interface IAttachment {
  _id?: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface IAdvertisement extends Document {
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

const attachmentSchema = new Schema({
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileSize: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const advertisementSchema = new Schema(
  {
    professionalId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: false,
    },
    appServiceId: {
      type: Schema.Types.ObjectId,
      ref: 'AppService',
      required: false,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      required: true,
      enum: ['MY_CLIENTS', 'NON_APPOINTMENT_USERS', 'ALL'],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    attachments: [attachmentSchema],
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

advertisementSchema.index({ professionalId: 1 });
advertisementSchema.index({ userId: 1 });
advertisementSchema.index({ appointmentId: 1 });
advertisementSchema.index({ appServiceId: 1 });
advertisementSchema.index({ targetType: 1 });
advertisementSchema.index({ startDate: 1, endDate: 1 });
advertisementSchema.index({ active: 1 });

advertisementSchema.pre('save', function (next) {
  if (this.endDate <= this.startDate) {
    return next(new Error('End date must be greater than start date'));
  }
  next();
});

export const Advertisement = model<IAdvertisement>('Advertisement', advertisementSchema);
