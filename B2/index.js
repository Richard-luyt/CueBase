import http from "http";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import xssClean from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

dotenv.config();
connectDB();

const app = express();
const Port = 8000;

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

app.use(cors());
app.use(express.json({ limit: "10kb" }));

// Data sanitization
//app.use(mongoSanitize());
//app.use(xssClean());
//app.use(hpp());

app.get("/", (req, res) => {
  res.send("CueBase running");
});

app.use("/api/users", userRoutes);
app.use("/api/doc", documentRoutes);

app.listen(Port, () => {
  console.log(`Server Running ${Port}`);
});
