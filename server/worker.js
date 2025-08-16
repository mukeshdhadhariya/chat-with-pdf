import { Worker } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from "dotenv";
dotenv.config();

const worker = new Worker(
  "file-queue",
  async (job) => {
    try {
      const data = JSON.parse(job.data);

      const loader = new PDFLoader(data.path);
      const docs = await loader.load();

      if (!docs.length) {
        console.log("No documents found in PDF:", data.path);
        return;
      }

      const splitter = new CharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
      const docsChunks = await splitter.splitDocuments(docs);

      const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "models/embedding-001",
        apiKey:process.env.GOOGLE_API_KEY,
      });

      const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: "http://localhost:6333",
        collectionName: "langchainjs-testing",
      });

      await vectorStore.addDocuments(docsChunks);
      console.log(`Added ${docsChunks.length} chunks to Qdrant collection.`);
    } catch (err) {
      console.error("Worker error:", err);
    }
  },
  {
    concurrency: 5,
    connection: { host: "localhost", port: 6379 },
  }
);
