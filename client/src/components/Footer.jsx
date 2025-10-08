import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 text-white py-4 overflow-hidden relative">
      {/* Sliding container */}
      <div className="whitespace-nowrap animate-slide px-4">
        <span className="mx-8 font-semibold">
          🏠 RealEstateML - Making smart property decisions easy with ML predictions.
        </span>
        <span className="mx-8 font-semibold">
          Contact: support@realestateml.com | +91 9876543210
        </span>
        <span className="mx-8 font-semibold">
          Follow Us: Facebook | Instagram | Twitter
        </span>
      </div>

      {/* Tailwind custom animation */}
      <style>{`
        @keyframes slide {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-slide {
          display: inline-block;
          animation: slide 20s linear infinite;
        }
      `}</style>
    </footer>
  );
}
