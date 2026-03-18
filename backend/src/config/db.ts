import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
    try {
        // Listening for connection events can help with debugging
        mongoose.connection.on("connected", () => {
            console.log("Connected to database successfully");
        });

        mongoose.connection.on("error", (err) => {
            console.log("Error in database connection:", err);
        });

        await mongoose.connect(config.databaseUrl as string);
        
    } catch (error) {
        console.error("Failed to connect to database", error);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;