import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    User:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "user required"],
    },
    Content:{
        type: String,
        maxlength : 2000,
    },
    FileName:{
        type: String,
    },
    PageNumber:{
        type: Number,
    },
    Embedding:{
        type: [Number],
    },
});

const Document = mongoose.model('Document', documentSchema);
export default Document;
