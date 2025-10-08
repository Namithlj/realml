import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import propertyRoutes from "./routes/propertyRoutes.js";
import path from "path";
dotenv.config();


app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
});


const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is undefined. Check your .env file.");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err.message));

app.use("/api/properties", propertyRoutes);

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
