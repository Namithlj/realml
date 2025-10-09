import React, { useState, useEffect } from "react";
import axios from "axios";

export default function BuyerView() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("https://realml-3.onrender.com/all");
        setProperties(res.data);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || "❌ Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = properties.filter(p => 
    p.location.toLowerCase().includes(search.toLowerCase()) ||
    p.sellerName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center mt-10">Loading properties...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Available Properties</h2>
      <input type="text" placeholder="Search by location or seller" value={search} onChange={e => setSearch(e.target.value)} className="input-field mb-4"/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((p,i) => (
          <div key={i} className="p-4 border rounded shadow bg-white">
            <h3 className="font-bold">{p.location}</h3>
            <p>Seller: {p.sellerName}</p>
            <p>Expected: ${p.expectedPrice}</p>
            <p>Predicted: ${p.predictedPrice}</p>
            <p>{p.profitable ? "✅ Likely Profitable" : "❌ May Not Be Profitable"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
