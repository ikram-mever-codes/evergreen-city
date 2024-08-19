import mongoose from "mongoose";

if (process.env.NODE_ENV !== "production") {
  mongoose.models = {};
}
const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    currency: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
