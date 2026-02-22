import mongoose, { Schema, model, type InferSchemaType } from "mongoose";

const fileChunk = new mongoose.Schema({
  BelongDocument: {
    type: Schema.Types.ObjectId,
    ref: "Document",
    required: [true, "document required"],
  },
  User: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user required"],
  },
  ChunkIndex: {
    type: Number,
    required: true,
  },
  Content: {
    type: String,
    maxlength: 1500,
  },
  Embedding: {
    type: [Number],
  },
});

export type IFileChunk = InferSchemaType<typeof fileChunk>;

const Chunk = model<IFileChunk>("Chunk", fileChunk);

export default Chunk;
