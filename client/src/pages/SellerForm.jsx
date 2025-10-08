import React, { useState } from "react";
import axios from "axios";

export default function SellerForm() {
  const [formData, setFormData] = useState({
    sellerName: "",
    email: "",
    phone: "",
    location: "",
    CRIM: 0, ZN: 0, INDUS: 0, CHAS: 0, NOX: 0,
    RM: 0, AGE: 0, DIS: 0, RAD: 0, TAX: 0,
    PTRATIO: 0, B: 0, LSTAT: 0,
    expectedPrice: 0
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       const numericFields = ["CRIM","ZN","INDUS","CHAS","NOX","RM","AGE","DIS","RAD","TAX","PTRATIO","B","LSTAT","expectedPrice"];
    const payload = {...formData};
    numericFields.forEach(f => payload[f] = Number(payload[f]));
      const res = await axios.post("https://realml-3.onrender.com/add", formData);
      alert(`Property added! Predicted Price: ${res.data.property.predictedPrice}`);
    } catch (err) {
      console.error(err);
      alert("Error adding property");
    }
  };

  const mlFeatures = [
    { name: "CRIM", desc: "Per Capita Crime Rate by Town" },
    { name: "ZN", desc: "Proportion of residential land zoned for lots > 25,000 sq.ft." },
    { name: "INDUS", desc: "Non-retail business acres per town" },
    { name: "CHAS", desc: "1 if tract bounds Charles River, else 0" },
    { name: "NOX", desc: "Nitric oxide concentration (pollution)" },
    { name: "RM", desc: "Average number of rooms per dwelling" },
    { name: "AGE", desc: "Proportion of units built before 1940" },
    { name: "DIS", desc: "Weighted distances to employment centers" },
    { name: "RAD", desc: "Index of accessibility to radial highways" },
    { name: "TAX", desc: "Property tax rate per $10,000" },
    { name: "PTRATIO", desc: "Pupil-teacher ratio by town" },
    { name: "B", desc: "1000(Bk - 0.63)^2; Bk = proportion of blacks by town" },
    { name: "LSTAT", desc: "% lower status population" }
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Add Your Property</h2>
      <p className="text-gray-600 dark:text-gray-300">
        Fill in your property details. Accurate input helps the ML model predict fair price.
      </p>

      <input name="sellerName" placeholder="Seller Name" onChange={handleChange} className="input-field"/>
      <input name="email" placeholder="Email" onChange={handleChange} className="input-field"/>
      <input name="phone" placeholder="Phone" onChange={handleChange} className="input-field"/>
      <input name="location" placeholder="Location" onChange={handleChange} className="input-field"/>

      {mlFeatures.map(f => (
        <div key={f.name} className="flex flex-col">
          <input
            name={f.name}
            placeholder={`${f.name} (${f.desc})`}
            type="number"
            onChange={handleChange}
            className="input-field"
          />
        </div>
      ))}

      <input name="expectedPrice" placeholder="Expected Selling Price" type="number" onChange={handleChange} className="input-field"/>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Property</button>
    </form>
  );
}
