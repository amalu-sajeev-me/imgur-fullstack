import mongoose from "mongoose";
const { Schema } = mongoose;
const postSchema = new Schema({
  image: String,
  caption: String,
});
const profileSchema = new Schema({
  firstName: String,
  lastName: String,
  pic: String,
  about: String,
  posts: [postSchema],
});
const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "please provide the username"],
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
  },
  profile: profileSchema,
});
const User = mongoose.model("User", userSchema);

export { mongoose, User };
