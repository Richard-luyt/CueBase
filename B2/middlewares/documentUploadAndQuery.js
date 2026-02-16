import multer from "multer";
import "dotenv/config";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import PDFParser from "pdf2json";
import Chunk from "../models/Chunk.js";
import Document from "../models/Document.js";

export const Embedding = async (textFile) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: textFile,
    outputDimensionality: 768,
    taskType: "RETRIEVAL_DOCUMENT",
  });
  const finalEmbedding = response.embeddings[0].values.slice(0, 768);
  return finalEmbedding;
};

const Divide = async (TextFile, ID) => {
  let countChunk = 0;
  for (var i = 0; i < TextFile.length; i += 1200) {
    let text = TextFile.substring(i, Math.min(i + 1500, TextFile.length));
    countChunk++;
    const embeddingResult = await Embedding(text);
    const newChunk = {
      BelongDocument: ID,
      ChunkIndex: countChunk,
      Content: text,
      Embedding: embeddingResult,
    };
    const createChunk = await Chunk.create(newChunk);
  }
};
export const documentParsing = async (req, res, next) => {
  const pdfParser = new PDFParser(this, 1);
  const file_path = req.file.path;
  pdfParser.on("pdfParser_dataError", (errData) => {
    console.error(errData.parserError);
    return res.status(500).json({
      status: "failed",
      message: "File Failed to Parse",
    });
  });
  pdfParser.on("pdfParser_dataReady", async (pdfData) => {
    const fileText = pdfParser.getRawTextContent();
    const newDocument = {
      User: req.User._id,
      FileName: req.file.originalname,
      TotalChunkNumber: Math.ceil(fileText.length / 1500),
      UploadTime: Date.now(),
    };
    const createDoc = await Document.create(newDocument);
    const resultChunk = await Divide(fileText, createDoc._id);
    return res.status(200).json({
      status: "success",
    });
  });
  pdfParser.loadPDF(req.file.path);
};
