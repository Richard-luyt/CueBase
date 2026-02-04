import mongoose from "mongoose";
import validator from "validator"
import bcrypt from "bcryptjs"

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
        select: false,
    },
    photo: {
        type: String,
    },
    passwordConfirm: {
        // Only works with save and save
        type: String,
        required : [true, "please retype your password"],
        validate : {
            validator: function(el) {
                return el === this.password;
            }
        },
        message: "password doesn't match!"
    },
    UserAPI: {
        type : String,
        required: false,
    }
});

UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 15);
    this.passwordConfirm = undefined;
    next();
});

UserSchema.methods.correctPassword = async function(candidatePassword, targetPassword) {
    return await bcrypt.compare(candidatePassword,targetPassword);
}


const User = mongoose.model('User', UserSchema);
export default User;
