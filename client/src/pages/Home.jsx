import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode by adding/removing class on body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-500 px-4">
      
      {/* Main Content */}
      <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
        Welcome to RealEstateML 🏡
      </h1>

      <p className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl text-center mb-10 leading-relaxed">
        Discover a smart platform where sellers list their properties, and buyers
        find the best deals — enhanced with machine learning predictions for optimal
        pricing.
      </p>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-6">
        <Link
          to="/sell"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 hover:scale-105 transition transform"
        >
          I'm a Seller
        </Link>

        <Link
          to="/buy"
          className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-lg hover:bg-green-700 hover:scale-105 transition transform"
        >
          I'm a Buyer
        </Link>
      </div>
    </div>
  );
}
