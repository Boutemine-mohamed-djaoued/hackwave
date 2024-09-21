import Groq from "groq-sdk";
import dotenv from "dotenv"
import fs from "fs/promises"
dotenv.config()

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default  {
  FAQAi: async (req, res) => {
    try {
    const { body } = req;
    console.log(body)
    const prompt = await fs.readFile("src/data/FAQprompt","utf-8")
    const groqMessage = await groq.chat.completions.create({
        messages : [
            {
                role: "system",
                content : prompt
            },
            ...body.messages
        ],
        model : "mixtral-8x7b-32768",
        temperature:0.1
    }) 
    res.status(200).json(groqMessage.choices[0].message)
    } catch(err) {
        res.status(500).json({message : err.message})
    }
  },
};
