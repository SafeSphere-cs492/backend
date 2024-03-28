import recorder from "node-record-lpcm16";
import speech from "@google-cloud/speech";

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
      .on("data", (data) => {
        const transcript =
          data.results[0] && data.results[0].alternatives[0]
            ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
            : "\n\nReached transcription time limit, press Ctrl+C\n";

        // Emitting the transcription data to all connected clients
        io.emit("transcription", transcript);
      });
  }

  if (!recordStream) {
    recordStream = recorder
      .record({
        sampleRateHertz: sampleRateHertz,
        threshold: 0,
        // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
        verbose: false,
        recordProgram: "rec", // Try also "arecord" or "sox"
        silence: "10.0",
      })
      .stream()
      .on("error", console.error)
      .pipe(recordingProcess);
  }
  console.log("Listening, press Ctrl+C to stop.");
}

export function stopTranscription() {
  // does not work yet!!
  if (recordingProcess) {
    recordingProcess = null;
  }

  if (recordingProcess) {
    recordingProcess.end();
    recordingProcess = null;
  }

  console.log("Transcription stopped.");
}
