import recorder from "node-record-lpcm16";
import speech from "@google-cloud/speech";
import { analyzeComment } from "./commentAnalyzer.js";

const encoding = "LINEAR16";
const sampleRateHertz = 16000;
const languageCode = "en-US";

let recordingProcess = null;
let recordStream = null;

export function startTranscription(io) {
  const client = new speech.SpeechClient();

  const request = {
    config: {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
    },
    interimResults: false,
  };

  if (!recordingProcess) {
    recordingProcess = client
      .streamingRecognize(request)
      .on("error", console.error)
      .on("data", async (data) => {
        const transcript =
          data.results[0] && data.results[0].alternatives[0]
            ? `${data.results[0].alternatives[0].transcript}\n`
            : "\n\nReached transcription time limit, press Ctrl+C\n";

        const timestamp = new Date();

        try {
          const analysisResult = await analyzeComment(transcript);
          io.emit("transcriptionAnalysis", {
            transcript,
            analysisResult,
            timestamp,
          });
        } catch (error) {
          console.error("Error analyzing the transcription: ", error);
        }
      })
      .on("end", () => {});
  }

  if (!recordStream) {
    recordStream = recorder.record({
      sampleRateHertz: sampleRateHertz,
      threshold: 0,
      // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
      verbose: false,
      recordProgram: "rec", // Try also "arecord" or "sox"
      silence: "10.0",
    });
    recordStream.stream().on("error", console.error).pipe(recordingProcess);
  }
  io.emit("recordingStatus", { recording: true });
  console.log("Listening, press Ctrl+C to stop.");
}

export function stopTranscription(io) {
  if (recordStream) {
    // WAIT till recordStream has finished processing
    recordStream.stream().on("end", () => {
      console.log("Recording stream finished.");

      if (recordingProcess) {
        recordingProcess.end();
        recordingProcess = null;
        io.emit("recordingStatus", { recording: false });
        console.log("Transcription process closed.");
      }
    });

    recordStream.stop();
    recordStream = null;
  } else {
    if (recordingProcess) {
      recordingProcess.end();
      recordingProcess = null;
      io.emit("recordingStatus", { recording: false });
      console.log("Transcription process closed.");
    }
  }

  console.log("Transcription stopping...");
}
