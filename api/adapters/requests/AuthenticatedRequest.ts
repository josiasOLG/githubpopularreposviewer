import { Request } from "express";

export interface User {
  id: string;
  // Add other user properties if needed
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}
