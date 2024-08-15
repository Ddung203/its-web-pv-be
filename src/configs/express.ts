import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import methodOverride from "method-override";
import { rateLimit } from "express-rate-limit";
import router from "../route";
import { API_VERSION } from "./config";
import { rateLimitOptions } from "./limit";
import corsConfiguration from "./cors";
import requestLogger from "./requestLogger";
import notFoundHandle from "../middlewares/notFoundHandle";
import errorHandle from "../middlewares/errorHandle";

const app = express();

// app.use(express.static("public"));
// app.set("view engine", "ejs");
// app.set("views", "./src/views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsConfiguration));
// app.use(morgan(":method :url :status :response-time ms"));
app.use(morgan("dev"));
app.use(helmet());
app.use(methodOverride());
app.use(compression());
app.use(rateLimit(rateLimitOptions));
app.use(requestLogger);
app.use(API_VERSION, router);

// Error handle
app.use(notFoundHandle);
app.use(errorHandle);

export default app;
