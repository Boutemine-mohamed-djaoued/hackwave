import Groq from "groq-sdk";
import { ElevenLabsClient, ElevenLabs } from "elevenlabs";
import dotenv from "dotenv";
import { PassThrough } from "stream";
import fs from "fs";
import corrector from "../lib/filter.js";
import cleanNumber from "../lib/cleanNumber.js";
import path from "path";
import { fileURLToPath } from "url";
import { Client } from "../models/user.js";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLAB_API_KEY,
});

const tts = async (message) =>
  await elevenlabs.textToSpeech.convert("pMsXgVXv3BLzUgSXRplE", {
    optimize_streaming_latency: ElevenLabs.OptimizeStreamingLatency.Zero,
    output_format: ElevenLabs.OutputFormat.Mp32205032,
    text: message,
    voice_settings: {
      stability: 0.1,
      similarity_boost: 0.3,
      style: 0.2,
    },
  });

export default {
  incomingCall: async (req, res) => {
    try {
      let text;
      if (req.file) {
        const transcription = await groq.audio.transcriptions.create({
          file: fs.createReadStream(
            req.file.destination + "/" + req.file.filename
          ),
          model: "distil-whisper-large-v3-en",
          prompt: "Specify context or spelling",
          response_format: "json",
          language: "en",
          temperature: 0.0,
        });
        text = transcription.text;
      } else {
        text = req.body.text;
        if (!text) {
          res
            .status(400)
            .json("pleas provide the credit card number or audio file");
        }
      }

      console.log(text);
      const prompt = fs.readFileSync("src/data/categoryRecongintion", "utf-8");
      const response = await groq.chat.completions.create({
        messages: [
          { role: "system", content: prompt },
          {
            role: "user",
            content: text,
          },
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.3,
      });
      console.log(corrector(response.choices[0].message.content));
      const category = JSON.parse(
        corrector(response.choices[0].message.content)
      );
      res.status(200).json(category);
      return;
    } catch (err) {
      console.log(err);
      res.status(500).json("Error :" + err.message);
    }
  },
  ATM: async (req, res) => {
    try {
      let text;
      if (req.file) {
        const transcription = await groq.audio.transcriptions.create({
          file: fs.createReadStream(
            req.file.destination + "/" + req.file.filename
          ),
          model: "distil-whisper-large-v3-en",
          prompt: "read credit card number in numerical digits",
          response_format: "json",
          language: "en",
          temperature: 0.0,
        });
        text = transcription.text;
      } else {
        text = req.body.text;
        if (!text) {
          res
            .status(400)
            .json("please provide the credit card number or audio file");
        }
      }

      const cardNumber = cleanNumber(text);
      console.log(cardNumber);
      const transction = {
        cardNumber,
        errorCode: 992,
        error: "The ATM is out of money , please try again later",
      };
      const client = { username: "adem" };
      const audio = await tts(
        client.username +
          " the issue with your transaction was that " +
          transction.error
      );

      const fileName =
        client.username +
        "-" +
        transction.errorCode +
        " " +
        new Date().getTime() +
        ".mp3";
      const writeStream = fs.createWriteStream(
        path
          .join(
            path.dirname(fileURLToPath(import.meta.url)),
            "../data/" + fileName
          )
          .toString()
      );
      audio.pipe(writeStream);

      writeStream.on("finish", async () => {
        console.log("alo");
        res.sendFile(
          path.join(
            path.dirname(fileURLToPath(import.meta.url)),
            "../data/" + fileName
          )
        );
        return
      });
      writeStream.on("error", (err) => {
        console.log(err);
        console.error("Error saving audio file:", err);
        throw err;
      });
      
      // res.status(200).json(cardNumber)
    } catch (err) {
      res.status(500).json("Err :" + err.message);
    }
  },
  STOLEN: async (req, res) => {
    try {
      let text;
      if (req.file) {
        const transcription = await groq.audio.transcriptions.create({
          file: fs.createReadStream(
            req.file.destination + "/" + req.file.filename
          ),
          model: "distil-whisper-large-v3-en",
          prompt: "read phone number in numerical digits",
          response_format: "json",
          language: "en",
          temperature: 0.0,
        });
        text = transcription.text;
      } else {
        text = req.body.text;
        if (!text) {
          res
            .status(400)
            .json("please provide the credit card number or audio file");
        }
      }
      console.log(text);
      const phoneNumber = cleanNumber(text);

      const client = await Client.findOne({ phoneNumber });
      if (!client) {
        res.sendFile(
          path.join(
            path.dirname(fileURLToPath(import.meta.url)),
            "../data/stolenError.mp3"
          )
        );
      }

      console.log(client);

      const audio = await tts(
        "Thank you " +
          client.username +
          " We will forward you to a human agent as soon as possible"
      );

      const fileName =
        client.username + "-cardStolen" + new Date().getTime() + ".mp3";
      const writeStream = fs.createWriteStream(
        path
          .join(
            path.dirname(fileURLToPath(import.meta.url)),
            "../data/" + fileName
          )
          .toString()
      );
      audio.pipe(writeStream);

      writeStream.on("finish", async () => {
        console.log("alo");
        res.sendFile(
          path.join(
            path.dirname(fileURLToPath(import.meta.url)),
            "../data/" + fileName
          )
        );
        const response = await fetch("http://localhost:3000/ticket/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId: client._id,
            info: "Card Stolen",
            priority: 1,
          }),
        });
        console.log("res ", response);
      });
      writeStream.on("error", (err) => {
        console.log(err);
        console.error("Error saving audio file:", err);
        throw err;
      });
    } catch (err) {
      res.status(500).json(err.message);
    }
  },
  EPAYMENT: async (req, res) => {
    try {
      let text;
      if (req.file) {
        const transcription = await groq.audio.transcriptions.create({
          file: fs.createReadStream(
            req.file.destination + "/" + req.file.filename
          ),
          model: "distil-whisper-large-v3-en",
          prompt: "read credit card number in numerical digits",
          response_format: "json",
          language: "en",
          temperature: 0.0,
        });
        text = transcription.text;
      } else {
        text = req.body.text;
        if (!text) {
          res
            .status(400)
            .json("please provide the credit card number or audio file");
        }
      }

      const cardNumber = cleanNumber(text);
      console.log(cardNumber);
      const transction = {
        cardNumber,
        errorCode: 992,
        error: "e-payment feature not in card",
      };
      res.sendFile(
        path.join(
          path.dirname(fileURLToPath(import.meta.url)),
          "../data/111.mp3"
        )
      );
      // res.status(200).json(cardNumber)
    } catch (err) {
      res.status(500).json("Err :" + err.message);
    }
  },
  SATISFIED: async (req, res) => {
    try {
    let text;
    if (req.file) {
      const transcription = await groq.audio.transcriptions.create({
        file: fs.createReadStream(
          req.file.destination + "/" + req.file.filename
        ),
        model: "distil-whisper-large-v3-en",
        prompt: "Specify context or spelling",
        response_format: "json",
        language: "en",
        temperature: 0.0,
      });
      text = transcription.text;
    } else {
      text = req.body.text;
      if (!text) {
        res
          .status(400)
          .json("please provide the credit card number or audio file");
      } 
    }
      console.log(text)
      const prompt = fs.readFileSync("src/data/clientSatisfaction", "utf-8");
      const response = await groq.chat.completions.create({
        messages: [
          { role: "system", content: prompt },
          {
            role: "user",
            content: text,
          },
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.3,
      });
      console.log(response.choices[0].message.content);
      const satisfied = JSON.parse(
        corrector(response.choices[0].message.content)
      );
      if (satisfied.satisfied) {
        console.log("cool")
        res.sendFile(
          path.join(
            path.dirname(fileURLToPath(import.meta.url)),
            "../data/outro.mp3"
          )
        );
      } else {
        res.sendFile(
          path.join(
            path.dirname(fileURLToPath(import.meta.url)),
            "../data/sorry.mp3"
          )
        );

        const r = await fetch("http://localhost:3000/ticket/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId: "66ed5b4d850df39292b573da",
            info: JSON.stringify("ai convo"),
            priority: 3,
          }),
        });
       
       
      
    } } catch (err) {
      res.status(500).json("Err :" + err.message);
    }
  },
  COLLECT: async (req,res) => {
    try {
      let text;
      if (req.file) {
        const transcription = await groq.audio.transcriptions.create({
          file: fs.createReadStream(
            req.file.destination + "/" + req.file.filename
          ),
          model: "distil-whisper-large-v3-en",
          prompt: "Specify context or spelling",
          response_format: "json",
          language: "en",
          temperature: 0.0,
        });
        text = transcription.text;
      } else {
        text = req.body.text;
        if (!text) {
          res
            .status(400)
            .json("please provide the credit card number or audio file");
        } 
      }
        console.log(text)
        const prompt = fs.readFileSync("src/data/dataCollection", "utf-8");
      const response = await groq.chat.completions.create({
        messages: [
          { role: "system", content: prompt },
          {
            role: "user",
            content: text,
          },
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.3,
      });
      console.log(response.choices[0].message.content);
      const info = JSON.parse(
        corrector(response.choices[0].message.content)
      );
      const r = await fetch("http://localhost:3000/ticket/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: "66ed5b4d850df39292b573da",
          info: JSON.stringify(info),
          priority: 1,
        }),
      });
      res.status(200).json("Ticket created")
    } catch(err) {
      res.status(500).json("err :" + err.message)
    }
  }
};
