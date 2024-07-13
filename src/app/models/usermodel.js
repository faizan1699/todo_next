import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "user name required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "email required"],
  },
  password: {
    type: String,
    required: [true, "password required"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isemailverified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: Number,
  },

  forgetpasswordtoken: String,
  forgetpasswordexpiry: { type: Date },

  verifyemailtoken: String,
  verifyemailtokenexpiry: { type: Date },
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
