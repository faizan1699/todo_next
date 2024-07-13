
import mongoose from "mongoose";

export default async function connect() {
  try {

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const connection = mongoose.connection;
    console.log("monogo db connected");

    connection.on("connected", () => {
      console.log("mongo db connected");
    });

    connection.on("error", (err) => {
      console.log("mongo db connection err", err);
      process.exit(1);
    });
  } catch (err) {
    console.log("database connection err");
    console.log("db connection err", err);
  }
  
}
