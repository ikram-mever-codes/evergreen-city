import mongoose from "mongoose";

const database = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the environment variables.");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Evergreen",
      connectTimeoutMS: 60000,
    });

    console.log("Database Connected Successfully!");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

export default database;
