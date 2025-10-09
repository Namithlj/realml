import React, { useState } from "react";
import axios from "axios";

export default function SellerForm() {
  const [formData, setFormData] = useState({
    sellerName:"", email:"", phone:"", location:"",
    CRIM:0, ZN:0, INDUS:0, CHAS:0, NOX:0,
    RM:0, AGE:0, DIS:0, RAD:0, TAX:0,
    PTRATIO:0, B:0, LSTAT:0, expectedPrice:0
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const numericFields = ["CRIM","ZN","INDUS","CHAS","NOX","RM","AGE","DIS","RAD",
                             "TAX","PTRATIO","B","LSTAT","expectedPrice"];
      const payload = {...formData};
      numericFields.forEach(f => payload[f] = Number(payload[f]));

      const res = await axios.post("https://realml-3.onrender.com/add", payload);
      alert(`✅ Property added! Predicted Price: ${res.data.property.predictedPrice}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "❌ Error adding property");
    } finally {
      setLoading(false);
    }
  };

  const mlFeatures = [
    { name: "CRIM", desc: "Per Capita Crime Rate" }, { name: "ZN", desc: "Residential land zoned" },
    { name: "INDUS", desc: "Non-retail business acres" }, { name: "CHAS", desc: "1 if tract bounds river" },
    { name: "NOX", desc: "Nitric oxide concentration" }, { name: "RM", desc: "Avg rooms per dwelling" },
    { name: "AGE", desc: "Proportion units built before 1940" }, { name: "DIS", desc: "Distance to employment" },
    { name: "RAD", desc: "Index of accessibility to highways" }, { name: "TAX", desc: "Property tax rate" },
    { name: "PTRATIO", desc: "Pupil-teacher ratio" }, { name: "B", desc: "Proportion of blacks by town" },
    { name: "LSTAT", desc: "Lower status population (%)" }
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-2xl font-bold">Add Your Property</h2>

      <input name="sellerName" placeholder="Seller Name" onChange={handleChange} className="input-field"/>
      <input name="email" placeholder="Email" onChange={handleChange} className="input-field"/>
      <input name="phone" placeholder="Phone" onChange={handleChange} className="input-field"/>
      <input name="location" placeholder="Location" onChange={handleChange} className="input-field"/>

      {mlFeatures.map(f => (
        <input key={f.name} name={f.name} type="number" placeholder={`${f.name} (${f.desc})`} onChange={handleChange} className="input-field"/>
      ))}

      <input name="expectedPrice" type="number" placeholder="Expected Price" onChange={handleChange} className="input-field"/>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? "Adding..." : "Add Property"}
      </button>
    </form>
  );
}
