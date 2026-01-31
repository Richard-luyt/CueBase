import Document from "./../models/Document.js";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());

exports.createDocument = async (req, res) => {
    try {
        const ai = new GoogleGenAI({apiKey : process.env.GEMINI_API_KEY});
        const response = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: req.body.Content,
            taskType: 'RETRIEVAL_DOCUMENT',
            outputDimensionality: 768,
        });
        const newReq = {
            User : req.body.User,
            Content : req.body.Content,
            FileName : req.body.FileName,
            PageNumber :  req.body.PageNumber,
            Embedding : response.embeddings[0].values,
        };
        // const newReq = await Object.assign({Embedding: response}, req.body);
        const Create = await Document.create(newReq);
        res.status(201).json({
            status: "success",
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "fail",
        })
    }
    
}

exports.deleteDocument = (req, res) => {

}

exports.getDocument = async (req, res) => {
    try {
        const results = await Document.aggregate([
            {
                "$vectorSearch": {
                "index": "Embedding",
                "path": "Embedding",
                "queryVector": req.body.embedding,
                "filter": {
                    "User": { "$eq": new mongoose.Types.ObjectId(req.body.userID)}
                },
                "numCandidates": 100,
                "limit": 5
                }
            },
        ]);
        res.status(200).json({
            status : "success",
            data : {
                results
            },
        })
    } catch (err) {
        console.log(err);
    }
}
