import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user required"],
  },
  FileName: {
    type: String,
    unique: true,
  },
  TotalChunkNumber: {
    type: Number,
  },
  UploadTime: {
    type: Date,
  },
});

const Document = mongoose.model("Document", documentSchema);
export default Document;
