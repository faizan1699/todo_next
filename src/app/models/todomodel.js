import mongoose from "mongoose";

const TodoSchema = mongoose.Schema({
  isblocked: {
    type: Boolean,
    default: false,
  },
  user: {
    type: String,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "title required"],
  },
  description: {
    type: String,
    required: [true, "required required"],
  },
  iscompleted: {
    type: Boolean,
  },
  createdat: {
    type: Date,
    required: true,
  },
  updatedat: {
    type: Date,
    required: true,
  },
});

// const TodoModel = mongoose.models.todo || mongoose.model("todos", TodoSchema);
const TodoModel = mongoose.models.todos || mongoose.model("todos", TodoSchema);

export default TodoModel;
