import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import Navbar from "./components/Navbar";
import ChatbotWidget from "./components/ChatbotWidget";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Auth from "./pages/Auth";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import ChatbotPage from "./pages/ChatbotPage";
<<<<<<< HEAD
import Profile from "./pages/Profile";
=======
>>>>>>> e01b2cb1632a75816f851e0758db7c93b772170c

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
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/shipping" element={<Navigate to="/checkout" replace />} />
            <Route path="/payment" element={<Navigate to="/checkout" replace />} />
            <Route path="/success" element={<Success />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
<<<<<<< HEAD
            <Route path="/profile" element={<Profile />} />
=======
>>>>>>> e01b2cb1632a75816f851e0758db7c93b772170c
          </Routes>
          <ChatbotWidget />
        </BrowserRouter>
      </SearchProvider>
    </CartProvider>
  );
}
