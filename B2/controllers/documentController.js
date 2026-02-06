import Document from "./../models/Document.js";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

export const createDocument = async (req, res) => {
    try {
        const ai = new GoogleGenAI({apiKey : process.env.GEMINI_API_KEY});
        const response = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: req.body.Content,
            outputDimensionality: 768,
            taskType: 'RETRIEVAL_DOCUMENT',
        });
        console.log(response);
        const finalEmbedding = response.embeddings[0].values.slice(0, 768);
        const newReq = {
            User : req.User._id,
            Content : req.body.Content,
            FileName : req.body.FileName,
            PageNumber :  req.body.PageNumber,
            Embedding : finalEmbedding,
        };
        //console.log("newReq");
        // const newReq = await Object.assign({Embedding: response}, req.body);
        try {
            const Create = await Document.create(newReq);
            res.status(201).json({
                status: "success",
            })
        } catch (err) {
            res.status(400).json({
                status: "failed",
                message : err,
            })
        }
        
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: "fail",
        })
    }
    
}

export const deleteDocument = async (req, res) => {
    try {
        const find = await Document.deleteMany({
            "User" : req.User._id, 
            "FileName" : req.body.FileName,
        });
        if (find.deletedCount == 0) {
            console.log("Can't find the document to delete");
            return res.status(404).json({
                status: "fail",
            })
        }
        console.log("Chunk of files deleted");
        return res.status(200).json({
            status: "success",
        })
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status : "fail",
        })
    }
}

export const getDocument = async (req, res) => {
    try {
        const results = await Document.aggregate([
            {
                "$vectorSearch": {
                    "index": "Embedding",
                    "path": "Embedding",
                    "queryVector": req.body.embedding,
                    "filter": {
                        "User": { "$eq": new mongoose.Types.ObjectId(req.User._id,)}
                    },
                    "numCandidates": 100,
                    "limit": 5
                }
            },
        ]);
        return res.status(200).json({
            status : "success",
            data : {
                results
            },
        })
    } catch (err) {
        console.log(err);
    }
}
