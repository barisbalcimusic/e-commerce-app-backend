import dotenv from "dotenv";
import fs from "fs";
import OpenAI from "openai";
import sanitizeHtml from "sanitize-html";

dotenv.config();

export const sendMessageToAI = async (req, res, next) => {
  const userMessage = req.body.content;

  console.log("test");

  if (!userMessage) {
    return res.status(400).json({ message: "User message is required." });
  }

  //SANITIZE MESSAGE
  let sanitizedMessage = sanitizeHtml(userMessage, {
    allowedTags: [],
    allowedAttributes: {},
  });

  if (!sanitizedMessage) {
    return res.status(400).json({ message: "Invalid message." });
  }

  const GTC = fs.readFileSync("src/data/GTC.txt", "utf-8");

  const systemPrompt = `Beantworte die Frage des Nutzers basierend auf folgendem Text:\n\n${GTC}\n\nFalls die Frage nicht dazu gehört, antworte mit: "Ich kann bei diesem Thema nicht weiterhelfen. Kann ich bei etwas anderem helfen?". Andernfalls halte deine Antwort kurz.`;

  //OPENAI AUTHORIZATION
  const openai = new OpenAI({ OPENAI_API_KEY: process.env.OPENAI_API_KEY });

  try {
    // SEND MESSAGE TO AI
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      model: "gpt-3.5-turbo",
    });
    const answerFromAI = completion.choices[0].message.content;
    res.status(200).json({ content: answerFromAI, role: "AI" });

    // //! ONLY FOR TESTING PURPOSES
    // console.log({ content: "Test: I got your message", role: "AI" });
    // res.status(200).json({ content: "Test: I got your message", role: "AI" });
  } catch (error) {
    next(error);
  }
};
