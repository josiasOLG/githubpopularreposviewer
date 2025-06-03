import { Document, model, Schema, Types } from 'mongoose';

interface IAttachment {
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

const attachmentSchema = new Schema({
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileSize: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const guidanceSchema = new Schema(
  {
    appServiceId: {
      type: Schema.Types.ObjectId,
      ref: 'AppService',
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    professionalId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
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

// Índices para performance
guidanceSchema.index({ appServiceId: 1, categoryId: 1 });
guidanceSchema.index({ userId: 1 });
guidanceSchema.index({ professionalId: 1 });
guidanceSchema.index({ appointmentId: 1 });
guidanceSchema.index({ startDate: 1, endDate: 1 });
guidanceSchema.index({ active: 1 });

// Validação para garantir que endDate seja maior que startDate
guidanceSchema.pre('save', function (next) {
  if (this.endDate <= this.startDate) {
    next(new Error('Data de fim deve ser posterior à data de início'));
  }
  next();
});

export const Guidance = model<IGuidance>('Guidance', guidanceSchema);
