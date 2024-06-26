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
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  allowEIO3: true,
});

io.on("connection", (socket) => {
  socket.on("startTranscription", () => {
    startTranscription(io);
  });

  socket.on("stopTranscription", () => {
    stopTranscription(io);
  });
});

httpServer.prependListener("request", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
});

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).send("App running but not websockt :((");
});

httpServer.listen(port, () => {
  console.log("App is running with Socket.IO!");
});
