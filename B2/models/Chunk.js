import mongoose from "mongoose";

const fileChunk = new mongoose.Schema({
  BelongDocument: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    required: [true, "document required"],
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

const Chunk = mongoose.model("Chunk", fileChunk);
export default Chunk;
