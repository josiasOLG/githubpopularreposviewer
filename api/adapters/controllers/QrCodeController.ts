import { Request, Response } from 'express';
import {
  deleteQRCode,
  findQRCodeById,
  findQRCodesByUserId,
  generateQRCode,
  updateQRCode,
  updateQRCodeByBarberIdAndCode,
} from '../repositories/QrCodeRepository';

export const createQRCodeController = async (req: Request, res: Response) => {
  try {
    const { userId, barberId } = req.body;
    const qrCode = await generateQRCode(userId, barberId);
    res.status(201).json(qrCode);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR Code' });
  }
};

export const findQRCodeByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const qrCode = await findQRCodeById(id);
    if (!qrCode) {
      return res.status(404).json({ error: 'QR Code not found' });
    }
    res.status(200).json(qrCode);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve QR Code' });
  }
};

export const findQRCodesByUserIdController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const qrCodes = await findQRCodesByUserId(userId);
    res.status(200).json(qrCodes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve QR Codes' });
  }
};

export const updateQRCodeController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const qrCodeData = req.body;
    const updatedQRCode = await updateQRCode(id, qrCodeData);
    if (!updatedQRCode) {
      return res.status(404).json({ error: 'QR Code not found' });
    }
    res.status(200).json(updatedQRCode);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update QR Code' });
  }
};

export const deleteQRCodeController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteQRCode(id);
    if (!deleted) {
      return res.status(404).json({ error: 'QR Code not found' });
    }
    res.status(200).json({ message: 'QR Code deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete QR Code' });
  }
};

export const updateQRCodeByBarberIdAndCodeController = async (req: Request, res: Response) => {
  try {
    const { barberId } = req.params;
    const { code } = req.body;
    const updatedQRCode = await updateQRCodeByBarberIdAndCode(barberId, code);

    if (!updatedQRCode) {
      return res.status(404).json({ error: 'QR Code not found' });
    }
    res.status(200).json({
      message: 'QR Code updated and user points reset successfully',
      qrCode: updatedQRCode,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update QR Code and reset user points' });
  }
};
