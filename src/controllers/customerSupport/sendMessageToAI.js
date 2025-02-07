import dotenv from "dotenv";
import fs from "fs";
import OpenAI from "openai";
import sanitizeHtml from "sanitize-html";

dotenv.config();

export const sendMessageToAI = async (req, res, next) => {
  const userMessage = req.body.content;

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

  const systemPrompt = `Answer the user's question based only on the following text content:\n\n${GTC}\n\nIf the question is not related to this content, respond with "I have no information on this topic."`;

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
      max_tokens: 20,
    });
    const answerFromAI = completion.choices[0].message.content;
    res.status(200).json({ content: answerFromAI, role: "AI" });

    console.log({ content: answerFromAI, role: "AI" });
    // //! ONLY FOR TESTING PURPOSES
    // console.log({ content: "Test: I got your message", role: "AI" });
    // res.status(200).json({ content: "Test: I got your message", role: "AI" });
  } catch (error) {
    next(error);
  }
};
