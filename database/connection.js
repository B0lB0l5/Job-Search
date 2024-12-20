import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Database connected successfully!");
    })
    .catch((err) => {
      console.error("Database connection error:", err);
    });
};
