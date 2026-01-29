import Document from "./../models/Document.js";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());

exports.createDocument = async (req, res) => {
    const ai = new GoogleGenAI({apiKey : process.env.GEMINI_API_KEY});
    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: req.body.Content,
        taskType: 'RETRIEVAL_DOCUMENT',
        outputDimensionality: 768,
    });
    const newReq = {
        User : req.body.User,
        Cotent : req.body.Cotent,
        FileName : req.body.FileName,
        PageNumber :  req.body.PageNumber,
        Embedding : response.embeddings[0].values,
    };
    // const newReq = await Object.assign({Embedding: response}, req.body);
    const Create = await Document.create(newReq);
    res.status(201).json({
        status: "success",
    })
}

exports.deleteDocument = (req, res) => {

}


