import { Link } from "react-router-dom";
import { products, formatRupiah } from "../data/products";
import { useSearch } from "../context/SearchContext";
import "./Home.css";

export default function Home() {
  const { query } = useSearch();

  const filtered = products.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.product_name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page-container home-page">
      <div className="home-hero">
        <h1>
          Temukan <span>Signature Scent</span> Kamu
        </h1>
        <p>
          Koleksi parfum premium dalam ukuran decant. Coba sebelum commit ke botol penuh.
        </p>
      </div>

      <h2 className="section-title">
        {query.trim() ? `Hasil pencarian "${query}"` : "Produk Unggulan"}
      </h2>

      <div className="product-grid">
        {filtered.length === 0 && (
          <p className="home-empty-state">
            Tidak ada produk yang cocok dengan pencarian kamu.
          </p>
        )}
        {filtered.map((product) => (
          <Link
            to={`/product/${product.product_id}`}
            key={product.product_id}
            className="product-card"
          >
            <div className="product-card-image">
              <span className="badge-bestseller">BEST SELLER</span>
              <div className="product-card-placeholder">
                {product.image_filename.replace(".png", "")}
              </div>
            </div>
            <div className="product-card-body">
              <div className="product-card-brand">{product.brand}</div>
              <div className="product-card-name">{product.product_name}</div>
              <div className="product-card-price">
                Mulai <strong>{formatRupiah(product.price_1ml)}</strong>/1ml
                <span className="product-card-concentration">
                  {product.concentration}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
