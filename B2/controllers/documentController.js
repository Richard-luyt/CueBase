import Document from "./../models/Document.js";
import Chunk from "../models/Chunk.js";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";

export const deleteDocument = async (req, res) => {
  try {
    const targetDoc = await Document.findOne({
      User: req.User._id,
      FileName: req.body.FileName,
    });
    if (!targetDoc) {
      return res.status(404).json({
        status: "failed",
        message: "can't find document",
      });
    }
    const Result = await Chunk.deleteMany({ BelongDocument: targetDoc._id });
    await targetDoc.deleteOne();
    console.log("Chunk of files deleted");
    return res.status(200).json({
      status: "success",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: "fail",
    });
  }
};

export const getDocument = async (req, res) => {
  try {
    const results = await Document.aggregate([
      {
        $vectorSearch: {
          index: "Embedding",
          path: "Embedding",
          queryVector: req.body.embedding,
          filter: {
            User: { $eq: new mongoose.Types.ObjectId(req.User._id) },
          },
          numCandidates: 100,
          limit: 5,
        },
      },
    ]);
    return res.status(200).json({
      status: "success",
      data: {
        results,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
