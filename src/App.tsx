<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
>>>>>>> f8414313536adeb3da10f77d241247082f2d3b1a
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import Navbar from "./components/Navbar";
import ChatbotWidget from "./components/ChatbotWidget";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Auth from "./pages/Auth";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
<<<<<<< HEAD
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import ChatbotPage from "./pages/ChatbotPage";
=======
import Shipping from "./pages/Shipping";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import Chatbot from "./pages/Chatbot";
>>>>>>> f8414313536adeb3da10f77d241247082f2d3b1a

export default function App() {
  return (
    <CartProvider>
      <SearchProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
<<<<<<< HEAD
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/shipping" element={<Navigate to="/checkout" replace />} />
            <Route path="/payment" element={<Navigate to="/checkout" replace />} />
            <Route path="/success" element={<Success />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
=======
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/success" element={<Success />} />
            <Route path="/chatbot" element={<Chatbot />} />
>>>>>>> f8414313536adeb3da10f77d241247082f2d3b1a
          </Routes>
          <ChatbotWidget />
        </BrowserRouter>
      </SearchProvider>
    </CartProvider>
  );
}
