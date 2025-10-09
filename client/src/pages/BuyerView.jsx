import React, { useState, useEffect } from "react";
import axios from "axios";
import PropertyCard from "./PropertyCard";

export default function BuyerView() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("https://realml-3.onrender.com/all");
        setProperties(res.data);
      } catch (err) {
        console.error("Error fetching properties:", err.response ? err.response.data : err);
      }
    }
    fetchData();
  }, []);

  const filtered = properties.filter(p => 
    p.location.toLowerCase().includes(search.toLowerCase()) ||
    p.sellerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Available Properties</h2>
      <input
        type="text"
        placeholder="Search by location or seller"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="input-field mb-4"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((p, index) => (
          <PropertyCard key={p.email + index} property={p} />
        ))}
      </div>
    </div>
  );
}
