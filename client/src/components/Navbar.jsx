import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark mode class to <html> element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-blue-600 dark:bg-gray-800 text-white px-6 py-3 flex justify-between items-center shadow-md transition-colors duration-500">
        <h1 className="text-xl font-bold">
          🏠 RealEstate<span className="text-yellow-300">ML</span>
        </h1>

        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-yellow-200 transition">Home</Link>
          <Link to="/sell" className="hover:text-yellow-200 transition">Sell Property</Link>
          <Link to="/buy" className="hover:text-yellow-200 transition">Buy Property</Link>

          
        </div>
      </nav>

     
    </>
  );
}
