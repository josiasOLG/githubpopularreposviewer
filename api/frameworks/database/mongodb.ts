import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connectToMongoDB = async () => {
  const dbConnectionString =
    "mongodb+srv://josiasoliveiralll:4XYMT2E91owxMY03@cluster0.xxvy8yw.mongodb.net/test";
  if (!dbConnectionString) {
    throw new Error("DB_CONNECTION_STRING is not defined");
  }

  try {
    await mongoose.connect(dbConnectionString, {
      serverSelectionTimeoutMS: 60000, // Aumentar o tempo de espera para seleção do servidor
      socketTimeoutMS: 60000, // Aumentar o tempo de espera do socket
      connectTimeoutMS: 60000, // Aumentar o tempo de espera para conectar
      maxPoolSize: 10, // Ajuste conforme necessário
      minPoolSize: 5,
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
