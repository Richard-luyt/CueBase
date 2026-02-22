import mongoose, {Schema, model, type InferSchemaType} from "mongoose";

const documentSchema = new Schema({
  User: {
    type: Schema.Types.ObjectId,
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

export type IDocument = InferSchemaType<typeof documentSchema>

const Document = model<IDocument>("Document", documentSchema);
//const Document = mongoose.model("Document", documentSchema);
export default Document;
