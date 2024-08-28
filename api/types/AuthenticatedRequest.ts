import { Request } from "express";
import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}
