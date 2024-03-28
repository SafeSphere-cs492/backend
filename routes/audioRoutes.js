import express from "express";
import {
  startTranscription,
  stopTranscription,
} from "../services/speechToTextService.js";

const router = express.Router();

router.post("/transcribe-audio", (req, res) => {
  startTranscription();
  res.send("Transcription started");
});

router.post("/stop-transcription", (req, res) => {
  stopTranscription();
  res.send("Transcription stopped");
});

export default router;
