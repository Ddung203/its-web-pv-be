import mongoose from "mongoose";
import { MONGO_URI } from "./config";
import logger from "./logger";

// const config: any = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };

mongoose.Promise = require("bluebird");
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    logger.error("Error connecting to MongoDB: ", error);
    console.error("Error connecting to MongoDB:", error);
  }
}

export { mongoose, connectDB };
