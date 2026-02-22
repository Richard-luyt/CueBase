import http from "http";
import dotenv from "dotenv";
import express, { type Application, type Request, type Response } from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();

const app: Application = express();
const Port : number = 8000;

app.use(helmet());

// ------ could upgrade to Redis --------
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too Many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

const loginLimiter = rateLimit({
  max: 7,
  windowMs: 10 * 60 * 1000,
  message: "Too Many login requests, please try after 10 minutes",
});
app.use("/api/users/login", loginLimiter);
// --------------------------------------

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("CueBase running");
});

app.use("/api/users", userRoutes);
app.use("/api/doc", documentRoutes);
app.use("/api/team", teamRoutes);

app.listen(Port, () => {
  console.log(`Server Running ${Port}`);
});
