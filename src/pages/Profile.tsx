import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package, Clock, CheckCircle, CreditCard, User, Mail, MapPin,
  LogOut, ChevronDown, Truck, Camera, Save, X, Flower, TreePine,
  Sun, Flame, Droplets, Wind,
} from "lucide-react";
import "./Profile.css";

/* ── Types ── */

interface UserData {
  name: string;
  email: string;
  gender: string;
  aroma: string;
  avatar: string;
  savedAt: string;
}

interface Order {
  id: string;
  date: string;
  items: string;
  total: string;
  status: "Menunggu Pembayaran" | "Diproses" | "Selesai" | "Menunggu Konfirmasi";
  address: string;
  payment: string;
  products: { name: string; size: string; price: string }[];
}

const USER_DATA_KEY = "decant_user_data";
const ORDERS_KEY = "decant_orders";

const AVATAR_OPTIONS = [
  { id: "avatar-1", label: "Avatar 1", color: "#b91c1c" },
  { id: "avatar-2", label: "Avatar 2", color: "#2563eb" },
  { id: "avatar-3", label: "Avatar 3", color: "#16a34a" },
  { id: "avatar-4", label: "Avatar 4", color: "#d97706" },
];

const AROMA_OPTIONS = ["Floral", "Woody", "Citrus", "Spicy", "Aquatic", "Fresh"];
const GENDER_OPTIONS = ["Unisex", "Female", "Masculine"];

const DUMMY_ORDERS: Order[] = [
  {
    id: "DTC-1001",
    date: "25 Apr 2026",
    items: "Above The Cloud 3ml, Turathi Electric 1ml",
    total: "Rp38.000",
    status: "Selesai",
    address: "Jl. Sudirman No. 45, RT 03/RW 05, Senayan, Jakarta Selatan 12190",
    payment: "Transfer Bank BCA",
    products: [
      { name: "Above The Cloud (HMNS)", size: "3ml", price: "Rp28.000" },
      { name: "Turathi Electric (Afnan)", size: "1ml", price: "Rp10.000" },
    ],
  },
  {
    id: "DTC-1042",
    date: "27 Apr 2026",
    items: "Turathi Electric 5ml",
    total: "Rp29.000",
    status: "Diproses",
    address: "Jl. Kemang Raya No. 12, Bangka, Jakarta Selatan 12730",
    payment: "E-Wallet GoPay",
    products: [
      { name: "Turathi Electric (Afnan)", size: "5ml", price: "Rp29.000" },
    ],
  },
  {
    id: "DTC-1078",
    date: "28 Apr 2026",
    items: "Above The Cloud 2ml",
    total: "Rp16.000",
    status: "Menunggu Pembayaran",
    address: "Jl. Melawai No. 8, Kebayoran Baru, Jakarta Selatan 12160",
    payment: "COD (Bayar di Tempat)",
    products: [
      { name: "Above The Cloud (HMNS)", size: "2ml", price: "Rp16.000" },
    ],
  },
];

function AromaIcon({ aroma }: { aroma: string }) {
  const size = 16;
  switch (aroma) {
    case "Floral": return <Flower size={size} />;
    case "Woody": return <TreePine size={size} />;
    case "Citrus": return <Sun size={size} />;
    case "Spicy": return <Flame size={size} />;
    case "Aquatic": return <Droplets size={size} />;
    case "Fresh": return <Wind size={size} />;
    default: return null;
  }
}

function StatusBadge({ status }: { status: Order["status"] }) {
  const config = {
    "Menunggu Pembayaran": { icon: CreditCard, cls: "pending" },
    "Diproses": { icon: Clock, cls: "processing" },
    "Selesai": { icon: CheckCircle, cls: "completed" },
    "Menunggu Konfirmasi": { icon: Clock, cls: "confirming" },
  }[status];

  const Icon = config.icon;
  return (
    <span className={`profile-status-badge ${config.cls}`}>
      <Icon size={13} />
      {status}
    </span>
  );
}

function loadUserData(): UserData {
  try {
    const raw = localStorage.getItem(USER_DATA_KEY);
    if (!raw) return { name: "Pengguna Decant", email: "user@decanttemcy.com", gender: "Unisex", aroma: "Floral", avatar: "", savedAt: "" };
    return JSON.parse(raw) as UserData;
  } catch {
    return { name: "Pengguna Decant", email: "user@decanttemcy.com", gender: "Unisex", aroma: "Floral", avatar: "", savedAt: "" };
  }
}

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return DUMMY_ORDERS;
    const parsed = JSON.parse(raw) as Order[];
    return parsed.length > 0 ? parsed : DUMMY_ORDERS;
  } catch {
    return DUMMY_ORDERS;
  }
}

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>(loadUserData);
  const [orders, setOrders] = useState<Order[]>(loadOrders);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(userData.name);
  const [editEmail, setEditEmail] = useState(userData.email);
  const [editGender, setEditGender] = useState(userData.gender);
  const [editAroma, setEditAroma] = useState(userData.aroma);

  // Load orders from checkout on mount
  useEffect(() => {
    const checkoutOrders = loadOrders();
    setOrders(checkoutOrders);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem("decant_user_pref");
    localStorage.removeItem("user_preference");
    localStorage.removeItem("decant_auth");
    localStorage.removeItem("decant_chat_history");
    localStorage.removeItem(ORDERS_KEY);
    navigate("/auth");
  };

  const toggleOrder = (orderId: string) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  const startEdit = () => {
    setEditName(userData.name);
    setEditEmail(userData.email);
    setEditGender(userData.gender);
    setEditAroma(userData.aroma);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setShowAvatarPicker(false);
  };

  const saveEdit = () => {
    const updated: UserData = {
      ...userData,
      name: editName.trim() || userData.name,
      email: editEmail.trim() || userData.email,
      gender: editGender,
      aroma: editAroma,
    };
    setUserData(updated);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(updated));

    // Also sync decant_user_pref for Home recommendations
    const prefs = { aroma: updated.aroma, gender: updated.gender, savedAt: updated.savedAt };
    localStorage.setItem("decant_user_pref", JSON.stringify(prefs));

    setEditing(false);
    setShowAvatarPicker(false);
  };

  const selectAvatar = (avatarId: string) => {
    const updated = { ...userData, avatar: avatarId };
    setUserData(updated);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(updated));
    setShowAvatarPicker(false);
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (avatarId: string) => {
    const found = AVATAR_OPTIONS.find((a) => a.id === avatarId);
    return found?.color ?? "#b91c1c";
  };

  return (
    <div className="page-container profile-page">
      <h1 className="profile-heading">Profil Saya</h1>

      {/* ── User info card ── */}
      <div className="profile-user-card">
        <div className="profile-avatar-section">
          <div
            className="profile-avatar"
            style={{ background: getAvatarColor(userData.avatar) }}
          >
            {userData.avatar ? (
              <span className="profile-avatar-initials">{getInitials(userData.name)}</span>
            ) : (
              <User size={28} />
            )}
          </div>
          <button
            type="button"
            className="profile-avatar-change-btn"
            onClick={() => setShowAvatarPicker((prev) => !prev)}
          >
            <Camera size={14} /> Ganti Foto
          </button>

          {showAvatarPicker && (
            <div className="profile-avatar-picker">
              {AVATAR_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`profile-avatar-option ${userData.avatar === opt.id ? "active" : ""}`}
                  style={{ background: opt.color }}
                  onClick={() => selectAvatar(opt.id)}
                >
                  {getInitials(userData.name)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="profile-user-details">
          {editing ? (
            <div className="profile-edit-form">
              <div className="profile-edit-field">
                <label>Nama</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="profile-edit-field">
                <label>Email</label>
                <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
              </div>
              <div className="profile-edit-field">
                <label>Gender</label>
                <select value={editGender} onChange={(e) => setEditGender(e.target.value)}>
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="profile-edit-field">
                <label>Aroma Favorit</label>
                <select value={editAroma} onChange={(e) => setEditAroma(e.target.value)}>
                  {AROMA_OPTIONS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div className="profile-edit-actions">
                <button type="button" className="profile-save-btn" onClick={saveEdit}>
                  <Save size={14} /> Simpan
                </button>
                <button type="button" className="profile-cancel-btn" onClick={cancelEdit}>
                  <X size={14} /> Batal
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="profile-user-name">{userData.name}</h2>
              <div className="profile-user-meta">
                <span><Mail size={14} /> {userData.email}</span>
                <span><User size={14} /> {userData.gender}</span>
                <span className="profile-aroma-tag">
                  <AromaIcon aroma={userData.aroma} /> {userData.aroma}
                </span>
              </div>
              <div className="profile-user-actions">
                <button type="button" className="profile-edit-btn" onClick={startEdit}>
                  Edit Profil
                </button>
                <button type="button" className="profile-logout-btn" onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Order history ── */}
      <div className="profile-orders-section">
        <div className="profile-orders-header">
          <Package size={18} />
          <h2>Riwayat Pesanan</h2>
        </div>

        <div className="profile-orders-list">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`profile-order-card ${expandedOrder === order.id ? "expanded" : ""}`}
            >
              <button
                type="button"
                className="profile-order-toggle"
                onClick={() => toggleOrder(order.id)}
              >
                <div className="profile-order-top">
                  <span className="profile-order-id">{order.id}</span>
                  <StatusBadge status={order.status} />
                </div>
                <p className="profile-order-items">{order.items}</p>
                <div className="profile-order-bottom">
                  <span className="profile-order-date">{order.date}</span>
                  <span className="profile-order-total">{order.total}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`profile-order-chevron ${expandedOrder === order.id ? "rotated" : ""}`}
                />
              </button>

              {expandedOrder === order.id && (
                <div className="profile-order-details">
                  <div className="profile-order-detail-section">
                    <h4 className="profile-order-detail-title">Produk Dibeli</h4>
                    {order.products.map((p, idx) => (
                      <div key={idx} className="profile-order-product-row">
                        <span className="profile-order-product-name">{p.name}</span>
                        <span className="profile-order-product-size">{p.size}</span>
                        <span className="profile-order-product-price">{p.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="profile-order-detail-section">
                    <h4 className="profile-order-detail-title">
                      <Truck size={14} /> Alamat Pengiriman
                    </h4>
                    <p className="profile-order-detail-text">{order.address}</p>
                  </div>

                  <div className="profile-order-detail-section">
                    <h4 className="profile-order-detail-title">
                      <CreditCard size={14} /> Metode Pembayaran
                    </h4>
                    <p className="profile-order-detail-text">{order.payment}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}