import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema<UserDocument, mongoose.Model<UserDocument>>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      match: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true,
    useNestedStrict: true
  }
);

export interface User {
  email: string,
  password: string;
  name: string;
  lastName: string;
}

export interface UserDocument extends User, Document {}

export default mongoose.model("User", UserSchema);
