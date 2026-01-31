import mongoose from "mongoose";
import validator from "validator"

const UserSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: [true, 'Please enter username'],
        unique: true,
    },
    email: {
        type : String,
        required: [true, 'All users must have an unique email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please input a vaild email!']
    },
    password: {
        type : String,
        required: true,
        unique: true,
        minlength: 8,
    },
    photo: {
        type: String,
    },
    passwordConfirm: {
        type: String,
        required : [true, "please retype your password"],
    },
    UserAPI: {
        type : String,
        required: false,
    }
});

const User = mongoose.model('User', UserSchema);
export default User;
