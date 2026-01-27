import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: [true, 'Please enter username'],
    },
    email: {
        type : String,
        required: [true, 'All users must have an unique email'],
        unique: true
    },
    UserAPI: {
        type : String,
        required: false,
    }
});

const User = mongoose.model('User', UserSchema);
export default User;
