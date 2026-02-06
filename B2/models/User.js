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
    passwordChangeAt: {
        type : Date
    },
    UserAPI: {
        type : String,
        required: false,
    }
});

UserSchema.pre('save', async function() {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 15);
    this.passwordConfirm = undefined;
});

UserSchema.methods.correctPassword = async function(candidatePassword, targetPassword) {
    return await bcrypt.compare(candidatePassword,targetPassword);
}

UserSchema.methods.changedPassword = async function(JWTtimestamp) {
    if (this.passwordChangeAt) {
        const changedTimeStamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
        //console.log(changedTimeStamp);
        //console.log(JWTtimestamp);
        if (changedTimeStamp > JWTtimestamp) {
            //console.log("true");
            return true;
        } else {
            //console.log("false");
            return false;
        }
        //return changedTimeStamp > JWTtimestamp;
    } else{
        return false;
    }
    
}
const User = mongoose.model('User', UserSchema);
export default User;
