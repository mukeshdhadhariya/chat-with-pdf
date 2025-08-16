import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { Queue } from 'bullmq'
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({apiKey:process.env.GOOGLE_API_KEY});

const queue=new Queue("file-queue", {
  connection: {
    host: 'localhost',
    port: '6379',
  },
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null,`${uniqueSuffix}-${file.originalname}`)
  }
})

const upload = multer({ storage: storage })

const app=express()
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/upload/pdf', upload.single('pdf'), async (req, res) => {
  await queue.add(
    'file-ready',
    JSON.stringify({
      filename: req.file.originalname,
      destination: req.file.destination,
      path: req.file.path,
    })
  );

  return res.json({ message: "uploaded" });
});

app.get('/chat',async(req,res)=>{
  console.log( req.query.msg )
  const UserQuery="who is mukesh dhadhariya"

      const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "models/embedding-001",
        apiKey:process.env.GOOGLE_API_KEY,
      });

      const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: "http://localhost:6333",
        collectionName: "langchainjs-testing",
      });
      
    const ret = vectorStore.asRetriever({k: 2,});

    const result = await ret.invoke(UserQuery);

    const SYSTEM_PROMPT = `You are a helpful AI assistant. 
    Always answer the user query based ONLY on the provided PDF context. 
    Context: ${JSON.stringify(result)} 

    Guidelines:
    - Give short but detailed answers (concise sentences, no unnecessary words).  
    - If the answer is not present in the context, say clearly: "The answer is not available in the provided PDF." 
    - Never make up information outside the context.`;


    const chatResult = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT + "\n\nUser: " + UserQuery }] }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024
      }
    });

   return res.json({
    message:chatResult.candidates[0].content.parts[0].text,
    docs:result
   })

})

app.get('/',(req,res)=>{
    return res.json({
        status:"all good"
    })
})

app.listen(8000,()=>console.log(`server is running at 8000`))