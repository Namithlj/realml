import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  sellerName: String,
  email: String,
  phone: String,
  location: String,
  crim: Number,
  zn: Number,
  indus: Number,
  chas: Number,
  nox: Number,
  rm: Number,
  age: Number,
  dis: Number,
  rad: Number,
  tax: Number,
  ptratio: Number,
  b: Number,
  lstat: Number,
  expectedPrice: Number, // seller’s asking price
  predictedPrice: Number, // from ML model
  profitable: Boolean, // true if predictedPrice > expectedPrice
});

export default mongoose.model("Property", propertySchema);
