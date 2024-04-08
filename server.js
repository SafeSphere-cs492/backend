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

httpServer.listen(port, () => {
  console.log("App is running with Socket.IO!");
});
