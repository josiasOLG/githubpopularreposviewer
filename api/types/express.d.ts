import express from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string; // ou o tipo adequado para o seu caso
    }
  }
}
