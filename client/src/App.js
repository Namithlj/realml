import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SellerForm from "./pages/SellerForm";
import BuyerView from "./pages/BuyerView";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
        <Navbar />  {/* Top navigation bar */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />           {/* Home page */}
            <Route path="/sell" element={<SellerForm />} />  {/* Seller form */}
            <Route path="/buy" element={<BuyerView />} />    {/* Buyer page */}
          </Routes>
        </main>
        <Footer />  {/* Sticky footer */}
      </div>
    </Router>
  );
}


export default App;

