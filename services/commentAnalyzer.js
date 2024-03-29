import { google } from "googleapis";

const API_KEY = "AIzaSyCWJZj1kgCLhK9JLBCHD_dYlHmx1RsOu5M";
const DISCOVERY_URL =
  "https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1";

export async function analyzeComment(transcript) {
  try {
    const client = await google.discoverAPI(DISCOVERY_URL);
    const analyzeRequest = {
      comment: {
        text: transcript,
      },
      requestedAttributes: {
        TOXICITY: {},
        SEVERE_TOXICITY: {},
        IDENTITY_ATTACK: {},
        INSULT: {},
        PROFANITY: {},
        THREAT: {},
      },
    };

    const response = await client.comments
      .analyze({
        key: API_KEY,
        resource: analyzeRequest,
      })
      .then((res) => res)
      .catch((err) => {
        throw err;
      });

    return response.data;
  } catch (err) {
    console.error("Error in analyzeComment:", err);
    throw err;
  }
}
