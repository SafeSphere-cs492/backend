import express from "express";
import cors from "cors";
import audioRoutes from "./routes/audioRoutes.js";

const app = express();
app.use(cors());

app.use("/api/audio", audioRoutes);

app.get("/getData", (req, res) => {
  res.send("Hello, World!");
});

app.listen(3000, () => {
  console.log("App is running!");
});
