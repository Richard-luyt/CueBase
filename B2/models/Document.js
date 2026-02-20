import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user required"],
  },
  FileName: {
    type: String,
  },
  TotalChunkNumber: {
    type: Number,
  },
  UploadTime: {
    type: Date,
  },
});

documentSchema.index({ User: 1, FileName: 1 }, { unique: true });

const Document = mongoose.model("Document", documentSchema);
export default Document;
