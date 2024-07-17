import mongoose from "mongoose";

const ContactSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "name required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  message: {
    type: String,
    required: [true, "message required"],
  },
  contact: {
    type: Number,
    default: null,
  },
  contactdate: {
    type: Date,
    required: true,
  }
});

const ContactModel =
  mongoose.models.contact || mongoose.model("contact", ContactSchema);

export default ContactModel;
