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
connectDB();

app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin || '*'); 
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));


app.use(express.json());
app.use(cookieParser());


 
app.get("/", (req, res) => res.send("API Is Working!!"));
app.use("/api/auth", authRouters)
app.use("/api/user", userRouter)

app.listen(port, () => {
  console.log(`Server is running on PORT http://localhost:${port}`);
});
