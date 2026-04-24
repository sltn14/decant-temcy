import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import Navbar from "./components/Navbar";
import ChatbotWidget from "./components/ChatbotWidget";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Auth from "./pages/Auth";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Shipping from "./pages/Shipping";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import Chatbot from "./pages/Chatbot";

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
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/success" element={<Success />} />
            <Route path="/chatbot" element={<Chatbot />} />
          </Routes>
          <ChatbotWidget />
        </BrowserRouter>
      </SearchProvider>
    </CartProvider>
  );
}
