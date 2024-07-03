import mongoose from "mongoose";
import { MONGO_URI } from "./config";

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
    console.error("Error connecting to MongoDB:", error);
  }
}

export { mongoose, connectDB };
