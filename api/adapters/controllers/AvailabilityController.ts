import { Request, Response } from "express";
import { Availability } from "../../frameworks/orm/models/Availability";

export const createAvailability = async (req: Request, res: Response) => {
  try {
    const availability = new Availability(req.body);
    await availability.save();
    res.status(201).json(availability);
  } catch (error) {
    res.status(500).json({ error: "Failed to create availability" });
  }
};

export const getAvailabilityByBarber = async (req: Request, res: Response) => {
  try {
    const { barberId, date } = req.query;
    const availability = await Availability.findOne({ barberId, date });
    if (availability) {
      res.json(availability);
    } else {
      res.status(404).json({ error: "Availability not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get availability" });
  }
};

export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const { barberId, date } = req.query;
    const availability = await Availability.findOneAndUpdate(
      { barberId, date },
      req.body,
      { new: true }
    );
    if (availability) {
      res.json(availability);
    } else {
      res.status(404).json({ error: "Availability not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update availability" });
  }
};
