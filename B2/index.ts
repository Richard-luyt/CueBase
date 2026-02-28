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
import authRoutes from "./routes/authRoutes.js"
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

dotenv.config();
const requiredEnv = ["MONGODB_URI", "JWT_STRING", "JWT_EXPIRES", "JWT_COOKIE_EXPIRES", "GEMINI_API_KEY", "GEMINI_3_KEY"];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(
    `Missing required environment variable(s): ${missing.join(", ")}. Check your .env file.`
  );
  process.exit(1);
}
connectDB();

const app: Application = express();
const Port : number = 8000;

app.use(helmet());

const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

//app.use(mongoSanitize());
app.use(hpp());

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

const registerLimiter = rateLimit({
  max: 3,
  windowMs: 60 * 60 * 1000,
  message: "Too Many register requests, please try after 1 hour",
});
app.use("/api/users/register", registerLimiter);

const forgetPasswordLimiter = rateLimit({
  max: 2,
  windowMs: 60 * 60 * 1000,
  message: "Too Many requests, please try after 1 hour",
});
app.use("/api/users/forgetPassword", forgetPasswordLimiter);

const resetPasswordLimiter = rateLimit({
  max: 2,
  windowMs: 60 * 60 * 1000,
  message: "Too Many requests, please try after 1 hour",
});
app.use("/api/users/resetPassword", resetPasswordLimiter);
// --------------------------------------

app.get("/", (req: Request, res: Response) => {
  res.send("CueBase running");
});

app.use("/api/users", userRoutes);
app.use("/api/doc", documentRoutes);
app.use("/api/team", teamRoutes);
app.use("/auth", authRoutes);

app.listen(Port, () => {
  console.log(`Server Running ${Port}`);
});
