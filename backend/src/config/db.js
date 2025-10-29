import mongoose from "mongoose";

/**
 * Connects to the MongoDB database using Mongoose
 * Uses the environment variable DATABASE_URL
 * @returns {Promise<void>}
 */
export const connectDb = async () => {
    const mongoUri = process.env.DATABASE_URL;

    if (!mongoUri) {
        console.error("DATABASE_URL environment variable is not defined");
        process.exit(1);
    }

    try {
        console.log("Establishing connection to the database...");

        // Remove deprecated options (no longer needed in Mongoose 6+)
        const conn = await mongoose.connect(mongoUri);

        console.log(`MongoDB connected: ${conn.connection.host}`);
        console.log(`Database name: ${conn.connection.name}`);
        
        // Connection event listeners
        mongoose.connection.on("connected", () => {
            console.log("Mongoose connected to DB");
        });

        mongoose.connection.on("error", (err) => {
            console.error("Mongoose connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("Mongoose disconnected from DB");
        });

    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

// Graceful shutdown handler
const gracefulShutdown = async () => {
    await mongoose.connection.close();
    console.log("Mongoose connection closed through app termination");
    process.exit(0);
};

// Handle app termination
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);