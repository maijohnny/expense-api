import express, { NextFunction, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import { ErrorMiddleware } from "./middlewares/error";
import connectDB from "./config/db";
import rateLimit from "express-rate-limit";
import http from "http";

import userRouter from "./routes/user.route";
import categoryRouter from "./routes/category.route";
import expenseRouter from "./routes/expense.route";
import messageRouter from "./routes/message.route";
import { initializeSocket } from "./socket/socket";

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
});

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);
app.set("socketio", io);

app.use(express.json({ limit: "50mb" }));
app.use(cors({ origin: "*" }));
app.use(limiter);

const port = process.env.PORT || 3000;
const dbUrl = process.env.DB_URL || "";

app.get("/", (req: Request, res: Response) => {
    res.status(200).send("<h1>Expense Api is working...</h1>");
});

app.use('/users', userRouter);
app.use('/categories', categoryRouter);
app.use('/expenses', expenseRouter);
app.use('/messages', messageRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} is not found!`,
    })
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectDB(dbUrl);
});

app.use(ErrorMiddleware);