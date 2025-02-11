import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import { gtc } from "../data/gtc.js";

dotenv.config();
const indexName = process.env.PINECONE_INDEX_NAME;

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const model = "multilingual-e5-large";

// CREATE EMBEDDINGS FOR USER INPUT
export const createEmbeddingsForUserInput = async (userInput) => {
  const embeddings = pinecone.inference.embed(model, [userInput], {
    inputType: "query",
  });

  return embeddings;
};

// CREATE EMBEDDINGS FOR THE GTC
export const createEmbeddingsForGTC = async () => {
  const embeddings = pinecone.inference.embed(
    model,
    gtc.map((term) => term.text),
    { inputType: "passage", truncate: "END" }
  );
  return embeddings;
};

// CREATE A PINECONE INDEX IF IT DOESN'T EXIST
export const createPineconeIndex = async () => {
  const existingIndexes = await pinecone.listIndexes();

  if (!existingIndexes.indexes.some((i) => i.name === indexName)) {
    pinecone.createIndex({
      name: indexName,
      dimension: 1024,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });
  }
};

// UPSERT THE EMBEDDINGS TO PINECONE
export const upsertEmbeddings = async (embeddings) => {
  const index = pinecone.index(indexName);
  const vectors = gtc.map((term, i) => ({
    id: term.id,
    values: embeddings[i].values,
    metadata: { text: term.text },
  }));
  return index.namespace("ns1").upsert(vectors);
};

// FUNCTION TO QUERY PINECONE FOR SIMILAR EMBEDDINGS
export const queryPinecone = async (embedding) => {
  const index = pinecone.index(indexName);

  const queryResponse = await index.namespace("ns1").query({
    topK: 3,
    vector: embedding[0].values,
    includeValues: false,
    includeMetadata: true,
  });
  return queryResponse.matches;
};
