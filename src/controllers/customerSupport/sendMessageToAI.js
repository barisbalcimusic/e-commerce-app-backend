import dotenv from "dotenv";
import OpenAI from "openai";
import sanitizeHtml from "sanitize-html";
import {
  createEmbeddingsForGTC,
  createEmbeddingsForUserInput,
  createPineconeIndex,
  queryPinecone,
  upsertEmbeddings,
} from "../../utils/pinecone.js";

dotenv.config();

const openai = new OpenAI({
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
});

export const sendMessageToAI = async (req, res, next) => {
  const userMessage = req.body.content;

  if (!userMessage) {
    return res.status(400).json({ message: "User message is required." });
  }

  // SANITIZE THE USER MESSAGE TO PREVENT XSS ATTACKS
  let sanitizedMessage = sanitizeHtml(userMessage, {
    allowedTags: [],
    allowedAttributes: {},
  });

  if (!sanitizedMessage) {
    return res.status(400).json({ message: "Invalid message." });
  }

  // GET THE EMBEDDING FOR THE USER MESSAGE
  const userEmbedding = await createEmbeddingsForUserInput(sanitizedMessage);

  // CREATE EMBEDDINGS FOR THE GTC
  const GTCEmbedding = await createEmbeddingsForGTC();

  // CREATE A PINECONE INDEX
  await createPineconeIndex();

  // UPSERT THE EMBEDDINGS TO PINECONE
  await upsertEmbeddings(GTCEmbedding);

  // QUERY PINECONE FOR SIMILAR EMBEDDINGS
  const pineconeMatches = await queryPinecone(userEmbedding);

  const bestMatch = pineconeMatches[0].metadata.text;

  let systemPrompt;
  if (pineconeMatches && pineconeMatches.length > 0) {
    systemPrompt = `Antworte basierend auf diesem Text:\n\n${bestMatch}\n\n. Falls kein Zusammenhang besteht: "Entschuldigung, dabei kann ich Ihnen nicht helfen. Kann ich Ihnen bei einem anderen Thema weiterhelfen?". Halte deine Antwort kurz.`;
  } else {
    systemPrompt = `Entschuldigung, dabei kann ich Ihnen nicht helfen. Kann ich Ihnen bei einem anderen Thema weiterhelfen?`;
  }

  // SEND THE SYSTEM PROMPT AND USER MESSAGE TO OPENAI FOR A RESPONSE
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      model: "gpt-3.5-turbo",
    });
    const answerFromAI = completion.choices[0].message.content;
    res.status(200).json({ content: answerFromAI, role: "AI" });
  } catch (error) {
    next(error);
  }
};
