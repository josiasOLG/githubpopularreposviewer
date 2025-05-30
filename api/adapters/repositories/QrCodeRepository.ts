import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IQRCode } from '../../entities/QrCode';
import { QRCode as QRCodeModel } from '../../frameworks/orm/models/QrCode';
import { User } from '../../frameworks/orm/models/User';

export const createQRCode = async (qrCodeData: Partial<IQRCode>): Promise<IQRCode> => {
  try {
    const newQRCode = new QRCodeModel(qrCodeData);
    await newQRCode.save();
    return newQRCode.toObject();
  } catch (error: any) {
    throw new Error(`Error creating QR Code: ${error.message}`);
  }
};

export const findQRCodeById = async (id: string): Promise<IQRCode | null> => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    const qrCode = await QRCodeModel.findById(id);
    return qrCode ? qrCode.toObject() : null;
  } catch (error: any) {
    throw new Error(`Error finding QR Code by ID: ${error.message}`);
  }
};

export const findQRCodesByUserId = async (userId: string): Promise<IQRCode[]> => {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid ID format');
    }
    const qrCodes = await QRCodeModel.find({ userId });
    return qrCodes.map(qrCode => qrCode.toObject());
  } catch (error: any) {
    throw new Error(`Error finding QR Codes by user ID: ${error.message}`);
  }
};

export const updateQRCode = async (
  id: string,
  qrCodeData: Partial<IQRCode>,
): Promise<IQRCode | null> => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    const updatedQRCode = await QRCodeModel.findByIdAndUpdate(id, qrCodeData, {
      new: true,
    });
    return updatedQRCode ? updatedQRCode.toObject() : null;
  } catch (error: any) {
    throw new Error(`Error updating QR Code: ${error.message}`);
  }
};

export const deleteQRCode = async (id: string): Promise<boolean> => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    const result = await QRCodeModel.findByIdAndDelete(id);
    return result ? true : false;
  } catch (error: any) {
    throw new Error(`Error deleting QR Code: ${error.message}`);
  }
};

export const generateQRCode = async (userId: string, barberId: string): Promise<IQRCode> => {
  try {
    const existingQRCode = await QRCodeModel.findOne({
      userId,
      barberId,
      used: false,
    });
    if (existingQRCode) {
      return existingQRCode.toObject();
    }

    let numericUUID = '';
    while (numericUUID.length < 6) {
      const uuid = uuidv4().replace(/[^0-9]/g, '');
      numericUUID += uuid;
    }
    const code = numericUUID.substring(0, 6);

    const newQRCodeData: Partial<IQRCode> = {
      userId,
      barberId,
      code: code,
      used: false,
    };

    return await createQRCode(newQRCodeData);
  } catch (error: any) {
    throw new Error(`Error generating QR Code: ${error.message}`);
  }
};

export const updateQRCodeByBarberIdAndCode = async (
  barberId: string,
  code: string,
): Promise<IQRCode | null> => {
  const session = await QRCodeModel.startSession();
  session.startTransaction();

  try {
    const qrCode = await QRCodeModel.findOneAndUpdate(
      { barberId, code, used: false },
      { used: true },
      { new: true },
    ).session(session);

    if (!qrCode) {
      await session.abortTransaction();
      session.endSession();
      return null;
    }

    const user = await User.findOne({
      _id: qrCode.userId,
      'points.barberId': barberId,
    }).session(session);
    console.log('user >>', user);
    if (!user || !user.points) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(`User with barberId ${barberId} not found or user has no points`);
    }

    user.points = user.points.map(point => {
      if (point.barberId.toString() === barberId) {
        point.qtd = 0;
      }
      return point;
    });
    await user.save({ session });
    await session.commitTransaction();
    session.endSession();
    return qrCode.toObject();
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(`Error updating QR Code by BarberId and Code: ${error.message}`);
  }
};
