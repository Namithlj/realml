import React from "react";

export default function PropertyCard({ property }) {
  return (
    <div className="bg-white border rounded-lg shadow hover:shadow-lg p-4">
      <h3 className="text-lg font-semibold">{property.location}</h3>
      <p>Seller: {property.sellerName}</p>
      <p>Expected Price: ${property.expectedPrice}</p>
      <p>Predicted Price: ${property.predictedPrice}</p>
      <p className={property.profitable ? "text-green-600" : "text-red-600"}>
        {property.profitable ? "✅ Profitable Deal" : "❌ Overpriced"}
      </p>
    </div>
  );
}
