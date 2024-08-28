import { Schema, model, Document } from "mongoose";

interface IQRCode extends Document {
  userId: any;
  barberId: any;
  code: string;
  createdAt: Date;
  used: boolean;
}

const qrCodeSchema = new Schema<IQRCode>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  barberId: { type: Schema.Types.ObjectId, ref: "Barber", required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  used: { type: Boolean, default: false },
});

export const QRCode = model<IQRCode>("QRCode", qrCodeSchema);
