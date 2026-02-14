import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: [true, "Please enter username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "All users must have an unique email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please input a vaild email!"],
  },
  password: {
    type: String,
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
    required: [true, "please retype your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
    message: "password doesn't match!",
  },
  passwordChangeAt: {
    type: Date,
  },
  UserAPI: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: "normal",
    enum: ["normal", "admins"],
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 15);
  this.passwordConfirm = undefined;
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password") || this.isNew) return;
  this.passwordChangeAt = Date.now() - 1000;
});

UserSchema.pre(/^find/, async function () {
  // points to current query
  this.find({ active: { $ne: false } });
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  targetPassword,
) {
  const a = await bcrypt.compare(candidatePassword, targetPassword);
  return a;
};

UserSchema.methods.changedPassword = async function (JWTtimestamp) {
  if (this.passwordChangeAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10,
    );
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
  } else {
    return false;
  }
};

UserSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 600 * 1000;
  return resetToken;
};

const User = mongoose.model("User", UserSchema);
export default User;
