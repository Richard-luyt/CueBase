import mongoose, { Schema, model, type InferSchemaType, type HydratedDocument, type Query } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

interface IUserMethods {
  correctPassword(candidatePassword: string, targetPassword: string): Promise<boolean>;
  changedPassword(JWTtimestamp: number): boolean;
  createPasswordResetToken(): string;
}

const UserSchema = new Schema({
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
      validator: function (this: any, el: string) {
        return el === this.password;
      },
      message: "password doesn't match!",
    },
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
  isVerified: {
    type: Boolean,
    default: false,
  }
});

<<<<<<< HEAD
export type IUser = InferSchemaType<typeof UserSchema> & {_id : mongoose.Types.ObjectId};
=======
export type IUser = InferSchemaType<typeof UserSchema>;
>>>>>>> dd8f5a074a896056978a0336688c6eb3089cfe06

UserSchema.pre("save", async function (this: HydratedDocument<IUser>) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password as string, 15);
  this.passwordConfirm = "";
});

UserSchema.pre("save", async function (this: HydratedDocument<IUser>) {
  if (!this.isModified("password") || this.isNew) return;
  this.passwordChangeAt = new Date(Date.now() - 1000);
});

UserSchema.pre(/^find/, async function (this: Query<any, any>) {
  // points to current query
  this.where("active").ne(false);
});

UserSchema.methods.correctPassword = async function (
  candidatePassword: string,
  targetPassword : string,
):Promise<boolean> {
  return await bcrypt.compare(candidatePassword, targetPassword);
};

UserSchema.methods.changedPassword = function (this: HydratedDocument<IUser>,
  JWTtimestamp: number): boolean {
  if (this.passwordChangeAt) {
    const changedTimeStamp = Math.floor(
      this.passwordChangeAt.getTime() / 1000);
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

UserSchema.methods.createPasswordResetToken = function (this: HydratedDocument<IUser>): string {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = new Date(Date.now() + 600 * 1000);
  return resetToken;
};

const User = model<IUser, mongoose.Model<IUser, {}, IUserMethods>>("User", UserSchema);

export default User;
