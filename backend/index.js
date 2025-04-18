const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const documentsRouter = require("./routes/documents.route");
const cors = require("cors");

const port = 3000;

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.use("/api/v1", documentsRouter);

io.on("connection", (socket) => {
  console.log("a user connected");
  io.sockets.emit("hi", "everyone");
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
