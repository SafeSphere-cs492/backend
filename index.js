import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { startTranscription, stopTranscription } from "./services/speechToTextService.js";

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
    stopTranscription();
  });
});

httpServer.listen(3000, () => {
  console.log("App is running with Socket.IO!");
});
