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
    const files = await Document.find({User: req.User._id});
    let fileDetailes = [];
    for (const entry of files){
      const singleFile = {
        UploadTime : entry.UploadTime,
        FileName : entry.FileName,
      }
      fileDetailes.push(singleFile);
    }
    return res.status(200).json({
      status : "success",
      data : fileDetailes,
    })
  } catch (err) {
    return res.status(404).json({
      status : "failed",
      message: "error when retriving files",
    })
  }
};
