import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import methodOverride from "method-override";
import router from "../route";
import { API_VERSION } from "./config";
import { InternalServerError, NotFoundError } from "~/responses/error";

const app = express();

// app.use(express.static("public"));
// app.set("view engine", "ejs");
// app.set("views", "./src/views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan(":method :url :status :response-time ms"));
app.use(helmet());
app.use(methodOverride());
app.use(compression());
app.use(API_VERSION, router);

// Error handle
app.use((req: Request, res: Response, next: NextFunction) => {
  const error: NotFoundError = new NotFoundError();
  next(error);
});

app.use((error: InternalServerError, req: Request, res: Response, next: NextFunction) => {
  return res.status(error.status || 500).json({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    },
  });
});

export default app;
