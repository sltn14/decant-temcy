import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Pencil } from "lucide-react";
import { products, sizeOptions, formatRupiah } from "../data/products";
import { useCart, SizeKey } from "../context/CartContext";
import "./ProductDetail.css";

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
  isUser?: boolean;
}

const DUMMY_REVIEWS: Review[] = [
  {
    name: "Rina S.",
    rating: 5,
    comment: "Aromanya sangat tahan lama, cocok banget untuk pemakaian sehari-hari. Packaging decant-nya juga rapi dan aman.",
    date: "20 Apr 2026",
  },
  {
    name: "Andi P.",
    rating: 4,
    comment: "Sillage-nya oke, tapi untuk harga segini udah worth it. Bakal repurchase varian lain.",
    date: "24 Apr 2026",
  },
  {
    name: "Maya D.",
    rating: 5,
    comment: "Decant-nya pas, bisa buat test dulu sebelum beli botol full size. Recommended seller!",
    date: "26 Apr 2026",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="review-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= rating ? "star-filled" : "star-empty"}
        />
      ))}
    </span>
  );
}

function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);

  return (
    <span className="review-stars-input">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          className={`star-input-btn ${i <= (hover || value) ? "active" : ""}`}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${i} bintang`}
        >
          <Star size={20} />
        </button>
      ))}
    </span>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = products.find((p) => p.product_id === Number(id));

  const [selectedSize, setSelectedSize] = useState<SizeKey>("price_1ml");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>(DUMMY_REVIEWS);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(0);

  if (!product) {
    return (
      <div className="page-container">
        <p className="detail-empty-state">
          Produk tidak ditemukan.
        </p>
      </div>
    );
  }

  const currentPrice = product[selectedSize] as number;
  const selectedLabel = sizeOptions.find((s) => s.key === selectedSize)?.label ?? "1ml";

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedLabel);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedLabel);
    navigate("/cart");
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim() || reviewRating === 0) return;

    const newReview: Review = {
      name: "Kamu",
      rating: reviewRating,
      comment: reviewText.trim(),
      date: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      isUser: true,
    };
    setReviews((prev) => [...prev, newReview]);
    setReviewText("");
    setReviewRating(0);
  };

  const handleStartEdit = (idx: number) => {
    const review = reviews[idx];
    setEditingIndex(idx);
    setEditText(review.comment);
    setEditRating(review.rating);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null || !editText.trim() || editRating === 0) return;
    setReviews((prev) =>
      prev.map((r, i) =>
        i === editingIndex
          ? { ...r, comment: editText.trim(), rating: editRating }
          : r
      )
    );
    setEditingIndex(null);
    setEditText("");
    setEditRating(0);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditText("");
    setEditRating(0);
  };

  return (
    <div className="page-container detail-page">
      <div className="detail-layout">
        <div className="detail-image-section">
          <div className="detail-image-wrapper">
            <div className="detail-image-placeholder">
              {product.image_filename.replace(".png", "")}
            </div>
          </div>
        </div>

        <div className="detail-info-section">
          <div>
            <div className="detail-brand">{product.brand}</div>
            <h1 className="detail-name">{product.product_name}</h1>
            <span className="detail-concentration">{product.concentration}</span>
          </div>

          <div className="detail-price">
            {formatRupiah(currentPrice)}
            <span className="detail-price-label">/ {selectedLabel}</span>
          </div>

          <div className="detail-divider" />

          <div>
            <div className="detail-section-title">Profil Aroma</div>
            <div className="detail-notes">
              <div className="detail-note-row">
                <span className="detail-note-label">Top Notes</span>
                <span className="detail-note-value">{product.top_notes}</span>
              </div>
              <div className="detail-note-row">
                <span className="detail-note-label">Middle Notes</span>
                <span className="detail-note-value">{product.middle_notes}</span>
              </div>
              <div className="detail-note-row">
                <span className="detail-note-label">Base Notes</span>
                <span className="detail-note-value">{product.base_notes}</span>
              </div>
            </div>
          </div>

          <div className="detail-divider" />

          <div>
            <div className="detail-section-title">Pilih Ukuran</div>
            <div className="detail-sizes">
              {sizeOptions.map((opt) => (
                <div className="detail-size-option" key={opt.key}>
                  <input
                    type="radio"
                    id={opt.key}
                    name="size"
                    checked={selectedSize === opt.key}
                    onChange={() => setSelectedSize(opt.key)}
                  />
                  <label htmlFor={opt.key}>{opt.label}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-actions">
            <button className="btn-outline" onClick={handleAddToCart}>
              + Tambah ke Keranjang
            </button>
            <button className="btn-primary" onClick={handleBuyNow}>
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* ── Customer reviews ── */}
      <section className="detail-reviews">
        <h2 className="detail-reviews-title">Ulasan Pelanggan</h2>

        <div className="detail-reviews-list">
          {reviews.map((review, idx) => (
            <div key={idx} className="detail-review-card">
              <div className="detail-review-head">
                <div className="detail-review-head-left">
                  <span className="detail-review-name">{review.name}</span>
                  <StarRating rating={review.rating} />
                </div>
                {review.isUser && editingIndex !== idx && (
                  <button
                    type="button"
                    className="detail-review-edit-btn"
                    onClick={() => handleStartEdit(idx)}
                  >
                    <Pencil size={13} /> Edit
                  </button>
                )}
              </div>

              {editingIndex === idx ? (
                <div className="detail-review-edit-area">
                  <StarRatingInput value={editRating} onChange={setEditRating} />
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={3}
                  />
                  <div className="detail-review-edit-actions">
                    <button type="button" className="btn-primary" onClick={handleSaveEdit}>
                      Simpan
                    </button>
                    <button type="button" className="btn-outline" onClick={handleCancelEdit}>
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="detail-review-comment">{review.comment}</p>
                  <span className="detail-review-date">{review.date}</span>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="detail-divider" />

        <form className="detail-review-form" onSubmit={handleSubmitReview}>
          <h3 className="detail-review-form-title">Tulis Ulasan Anda</h3>
          <div className="detail-review-form-rating">
            <span className="detail-review-form-rating-label">Rating:</span>
            <StarRatingInput value={reviewRating} onChange={setReviewRating} />
          </div>
          <textarea
            placeholder="Bagikan pengalaman kamu tentang parfum ini..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={3}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={!reviewText.trim() || reviewRating === 0}
          >
            Kirim Ulasan
          </button>
        </form>
      </section>
    </div>
  );
}
