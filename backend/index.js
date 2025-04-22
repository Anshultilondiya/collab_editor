import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import documentsRouter from "./routes/documents.route.js";
import userRouter from "./routes/user.route.js";
import cors from "cors";
import "dotenv/config";

import { verifySupabaseToken } from "./middleware/authenticator.middleware.js";

import events from "events";
import { socketHandler } from "./sockets.js";

const port = 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
events.EventEmitter.defaultMaxListeners = 20; // Set a higher limit

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.use(verifySupabaseToken);
app.use("/auth", userRouter);
app.use("/docs", documentsRouter);

// io.on("connection", (socket) => {
//   console.log("a user connected");
//   io.sockets.emit("hi", "everyone");
// });
socketHandler(io);

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
