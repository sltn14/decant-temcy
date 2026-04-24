import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const { totalItems } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          Decant Temcy
        </Link>

        <div className="navbar-search">
          <Search size={16} className="navbar-search-icon" />
          <input type="text" placeholder="Cari parfum favoritmu..." />
        </div>

        <div className="navbar-nav">
          <Link to="/" className={isActive("/") ? "active" : ""}>
            Beranda
          </Link>
          <Link to="/catalog" className={isActive("/catalog") ? "active" : ""}>
            Catalog
          </Link>
          <Link to="/chatbot" className={isActive("/chatbot") ? "active" : ""}>
            Chatbot
          </Link>
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="navbar-icon-btn">
            <ShoppingCart size={20} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
          <Link to="/auth" className="navbar-icon-btn">
            <User size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
