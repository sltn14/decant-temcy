import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, LogOut, ChevronDown, LogIn } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import "./Navbar.css";

const USER_DATA_KEY = "decant_user_data";

interface UserData {
  name: string;
  email: string;
  gender: string;
  aroma: string;
  avatar: string;
  savedAt: string;
}

function loadUserData(): UserData | null {
  try {
    const raw = localStorage.getItem(USER_DATA_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserData;
  } catch {
    return null;
  }
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function getAvatarColor(avatarId: string): string {
  const map: Record<string, string> = {
    "avatar-1": "#b91c1c",
    "avatar-2": "#2563eb",
    "avatar-3": "#16a34a",
    "avatar-4": "#d97706",
  };
  return map[avatarId] ?? "#b91c1c";
}

export default function Navbar() {
  const { totalItems } = useCart();
  const { query, setQuery } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(loadUserData);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // Listen for storage changes (profile edits in same or other tab)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === USER_DATA_KEY) {
        setUserData(loadUserData());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Poll for same-tab updates
  useEffect(() => {
    const interval = setInterval(() => {
      setUserData(loadUserData());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem("decant_user_pref");
    localStorage.removeItem("user_preference");
    localStorage.removeItem("decant_auth");
    localStorage.removeItem("decant_chat_history");
    localStorage.removeItem("decant_orders");
    setUserData(null);
    setDropdownOpen(false);
    navigate("/auth");
  };

  const isLoggedIn = !!userData;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          Decant Temcy
        </Link>

        <div className="navbar-search">
          <Search size={16} className="navbar-search-icon" />
          <input
            type="text"
            placeholder="Cari parfum favoritmu..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
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

          {isLoggedIn ? (
            <div className="navbar-profile-wrapper" ref={dropdownRef}>
              <button
                type="button"
                className={`navbar-profile-trigger ${dropdownOpen ? "active" : ""}`}
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <div
                  className="navbar-user-avatar"
                  style={{ background: getAvatarColor(userData.avatar) }}
                >
                  {getInitials(userData.name)}
                </div>
                <ChevronDown size={12} className="navbar-profile-chevron" />
              </button>

              {dropdownOpen && (
                <div className="navbar-dropdown">
                  <div className="navbar-dropdown-user-info">
                    <span className="navbar-dropdown-user-name">{userData.name}</span>
                    <span className="navbar-dropdown-user-email">{userData.email}</span>
                  </div>
                  <div className="navbar-dropdown-divider" />
                  <Link
                    to="/profile"
                    className="navbar-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={15} />
                    Profil
                  </Link>
                  <button
                    type="button"
                    className="navbar-dropdown-item navbar-dropdown-logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="navbar-login-btn">
              <LogIn size={16} />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
