import express from "express";
import axios from "axios";
import Property from "../models/Property.js";

const router = express.Router();

// POST: Seller adds a property
router.post("/add", async (req, res) => {
  try {
    const {
      sellerName, email, phone, location,
      CRIM, ZN, INDUS, CHAS, NOX, RM, AGE,
      DIS, RAD, TAX, PTRATIO, B, LSTAT,
      expectedPrice
    } = req.body;

    // Send features to ML Flask API for prediction
    const mlResponse = await axios.post("http://127.0.0.1:5001/predict", {
      CRIM, ZN, INDUS, CHAS, NOX, RM, AGE,
      DIS, RAD, TAX, PTRATIO, B, LSTAT
    });

    const predictedPrice = mlResponse.data.predicted_MEDV;
    const profitable = predictedPrice > expectedPrice;

    const property = new Property({
      sellerName, email, phone, location,
      crim: CRIM, zn: ZN, indus: INDUS, chas: CHAS,
      nox: NOX, rm: RM, age: AGE, dis: DIS, rad: RAD,
      tax: TAX, ptratio: PTRATIO, b: B, lstat: LSTAT,
      expectedPrice, predictedPrice, profitable
    });

    await property.save();
    res.json({ message: "Property added successfully", property });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Buyer fetches all properties
router.get("/all", async (req, res) => {
  const properties = await Property.find();
  res.json(properties);
});

export default router;
