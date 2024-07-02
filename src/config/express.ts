import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import methodOverride from "method-override";
import router from "../route";

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
app.use("/api", router);

export default app;
