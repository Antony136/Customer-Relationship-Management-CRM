import mongoose from "mongoose";

let isConnected = false;

export const getDBStatus = () => {
  return mongoose.connection.readyState === 1 ? "connected" : "disconnected";
};

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.error(`MongoDB connection error: ${error.message}`);
    return null;
  }
};

mongoose.connection.on("connected", () => {
  isConnected = true;
});

mongoose.connection.on("disconnected", () => {
  isConnected = false;
});

mongoose.connection.on("error", () => {
  isConnected = false;
});

export default connectDB;