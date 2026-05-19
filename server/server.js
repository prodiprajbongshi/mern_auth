import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { connectDB } from "./config/mongoDB.js";
import { authRouters } from "./routers/authRoutes.js";
import { userRouter } from "./routers/usersRoutes.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 4000;

// Connect Database
connectDB();


// Middleware
app.use(express.json());

app.use(cookieParser());


const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-auth-azvl.vercel.app",
  "https://www.mern-auth-azvl.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


// Routes
app.get("/", (req, res) => {
  res.send("API Is Working!!");
});

app.use("/api/auth", authRouters);

app.use("/api/user", userRouter);


// Server
app.listen(port, () => {
  console.log(
    `Server is running on PORT http://localhost:${port}`
  );
});
