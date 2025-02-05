import dotenv from "dotenv";
import fs from "fs";
import OpenAI from "openai";

dotenv.config();

export const sendMessageToAI = async (req, res, next) => {
  const { message } = req.body;

  const GTC = fs.readFileSync("src/data/GTC.txt", "utf-8");

  const systemPrompt = `Answer the user's question based only on the following text content:\n\n${GTC}\n\nIf the question is not related to this content, respond with "I have no information on this topic."`;

  //OPENAI AUTHORIZATION
  const openai = new OpenAI({ OPENAI_API_KEY: process.env.OPENAI_API_KEY });

  try {
    // SEND MESSAGE TO AI
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 20,
    });

    const answerFromAI = completion.choices[0].message.content;
    console.log(answerFromAI);

    res.status(200).json({ answer: answerFromAI });
  } catch (error) {
    next(error);
  }
};
