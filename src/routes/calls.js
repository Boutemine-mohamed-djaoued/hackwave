import express from "express";
import calls from "../controllers/calls.js";
import multer from "multer";
import path from "path"
import twilio from "twilio"
import { fileURLToPath } from "url";

const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(path.dirname(fileURLToPath(import.meta.url)), "uploads")); // Set destination folder
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = Date.now().toString(); // Extract filename without extension
        cb(null, `${filename}${ext || ".unknown"}`); // Add extension if missing
      },
    }),
  });



const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);


router.post("/incoming-call",upload.single("file"),calls.incomingCall)
router.post("/ATM",upload.single("file"),calls.ATM)
router.post("/STOLEN", upload.single("file"),calls.STOLEN)
router.post("/EPAYMENT",upload.single("file"),calls.EPAYMENT)
router.post("/SATISFIED",upload.single("file"),calls.SATISFIED)
router.post("/COLLECT",upload.single("file"),calls.COLLECT)


// not stable , but works sometimes
router.get("/make-call",async (req,res)=> {
  try {
  const call = await client.calls.create({

    from: "+16193047991",

    to: "+213774848344",

    url: "http://demo.twilio.com/docs/voice.xml",

  });


  console.log(call.sid);
  res.status(200).json("alo")

} catch(err) {
  res.status(500).json("err :" + err.message)
}
})

export default router;