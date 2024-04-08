import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import {
  startTranscription,
  stopTranscription,
} from "./services/speechToText.js";

const app = express();
app.use(cors());
const httpServer = createServer(app);

// attach socket.io to the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: "*", // CHANGE FOR PROD
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("startTranscription", () => {
    startTranscription(io);
  });

  socket.on("stopTranscription", () => {
    stopTranscription(io);
  });
});

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).send("App running");
});

httpServer.listen(port, () => {
  console.log("App is running with Socket.IO!");
});
