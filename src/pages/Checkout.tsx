import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatRupiah } from "../data/products";
import "./Checkout.css";

type CheckoutStep = 1 | 2 | 3;
type CourierOption = "JNE" | "J&T" | "SiCepat";
type PaymentOption = "Transfer Bank" | "E-Wallet / QRIS"; // Diubah untuk menambahkan opsi QRIS

const SHIPPING_COST = 10000;

export default function Checkout() {
  const { items, totalItems } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState<CheckoutStep>(1);
  const [address, setAddress] = useState("");
  const [courier, setCourier] = useState<CourierOption>("JNE");
  const [paymentMethod, setPaymentMethod] = useState<PaymentOption>("Transfer Bank");
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); // State baru untuk efek loading

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items]
  );
  const totalPayment = subtotal + SHIPPING_COST;

  const nextStep = () => {
    setStep((prev) => (prev < 3 ? ((prev + 1) as CheckoutStep) : prev));
  };

  const previousStep = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as CheckoutStep) : prev));
  };

  const handleShippingSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setErrorMessage("Alamat lengkap wajib diisi.");
      return;
    }
    setErrorMessage("");
    nextStep();
  };

  const handlePaymentSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    nextStep();
  };

  const handlePayNow = () => {
    setIsProcessing(true); // Mulai loading
    
    // Simulasi proses ke payment gateway selama 3 detik
    setTimeout(() => {
      setIsProcessing(false);
      navigate("/success");
    }, 3000);
  };

  return (
    <div className="page-container checkout-page">
      <h1>Checkout</h1>
      <p className="checkout-subtitle">Selesaikan pembayaran dalam 3 langkah singkat</p>

      <div className="checkout-stepper" role="list" aria-label="Tahapan checkout">
        {[1, 2, 3].map((stepNumber) => (
          <div
            key={stepNumber}
            className={`checkout-stepper-item ${step === stepNumber ? "active" : ""} ${
              step > stepNumber ? "done" : ""
            }`}
            role="listitem"
          >
            <span className="checkout-stepper-index">{stepNumber}</span>
            <span className="checkout-stepper-label">
              {stepNumber === 1 && "Pengiriman"}
              {stepNumber === 2 && "Pembayaran"}
              {stepNumber === 3 && "Konfirmasi"}
            </span>
          </div>
        ))}
      </div>

      {isProcessing ? (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <h2>Memproses Pembayaran...</h2>
          <p>Mohon jangan tutup atau refresh halaman ini.</p>
        </div>
      ) : (
        <div className="checkout-layout">
          <div className="checkout-main-card">
            {step === 1 && (
              <form onSubmit={handleShippingSubmit} className="checkout-form">
                <h2>Informasi Pengiriman</h2>

                <div className="checkout-field">
                  <label>Alamat Lengkap</label>
                  <textarea
                    placeholder="Jl. Contoh No. 123, Kota, Kode Pos"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="checkout-field">
                  <label>Pilihan Kurir</label>
                  <div className="checkout-option-group">
                    {(["JNE", "J&T", "SiCepat"] as CourierOption[]).map((option) => (
                      <label
                        key={option}
                        className={`checkout-option-card ${courier === option ? "active" : ""}`}
                      >
                        <input
                          type="radio"
                          name="courier"
                          value={option}
                          checked={courier === option}
                          onChange={() => setCourier(option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {errorMessage && <p className="checkout-error">{errorMessage}</p>}

                <div className="checkout-nav">
                  <button type="button" className="btn-outline" onClick={() => navigate("/cart")}>
                    <ArrowLeft size={16} /> Kembali ke Keranjang
                  </button>
                  <button type="submit" className="btn-primary">
                    Lanjut ke Tahap 2
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handlePaymentSubmit} className="checkout-form">
                <h2>Metode Pembayaran & Ringkasan Pesanan</h2>

                <div className="checkout-field">
                  <label>Metode Pembayaran</label>
                  <div className="checkout-option-group checkout-option-group-two">
                    {(["Transfer Bank", "E-Wallet / QRIS"] as PaymentOption[]).map((option) => (
                      <label
                        key={option}
                        className={`checkout-option-card ${paymentMethod === option ? "active" : ""}`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={option}
                          checked={paymentMethod === option}
                          onChange={() => setPaymentMethod(option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Logika memunculkan QRIS */}
                {paymentMethod === "E-Wallet / QRIS" && (
                  <div className="qris-container">
                    <p>Scan QR Code di bawah ini menggunakan M-Banking atau aplikasi E-Wallet Anda:</p>
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DECANT_TEMCY_PAYMENT_SIMULATION&color=b91c1c" 
                      alt="QRIS Decant Temcy" 
                      className="qris-image" 
                    />
                  </div>
                )}

                <div className="checkout-inline-summary">
                  {items.map((item) => (
                    <div
                      className="checkout-inline-summary-item"
                      key={`${item.product.product_id}-${item.sizeKey}`}
                    >
                      <span>
                        {item.product.product_name} ({item.sizeLabel}) x{item.quantity}
                      </span>
                      <span>{formatRupiah(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="checkout-nav">
                  <button type="button" className="btn-outline" onClick={previousStep}>
                    <ArrowLeft size={16} /> Kembali
                  </button>
                  <button type="submit" className="btn-primary">
                    Lanjut ke Tahap 3
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="checkout-form">
                <h2>Konfirmasi Akhir</h2>
                <div className="checkout-confirmation">
                  <p>Pastikan seluruh data checkout sudah sesuai sebelum melakukan pembayaran.</p>
                  <div className="checkout-confirmation-row">
                    <span>Alamat</span>
                    <span>{address}</span>
                  </div>
                  <div className="checkout-confirmation-row">
                    <span>Kurir</span>
                    <span>{courier}</span>
                  </div>
                  <div className="checkout-confirmation-row">
                    <span>Pembayaran</span>
                    <span>{paymentMethod}</span>
                  </div>
                  <div className="checkout-confirmation-row total">
                    <span>Total Pembayaran</span>
                    <span>{formatRupiah(totalPayment)}</span>
                  </div>
                </div>

                <div className="checkout-nav">
                  <button type="button" className="btn-outline" onClick={previousStep}>
                    <ArrowLeft size={16} /> Kembali
                  </button>
                  <button type="button" className="btn-primary" onClick={handlePayNow}>
                    Bayar Sekarang
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="checkout-summary-card">
            <h3>Ringkasan Checkout</h3>
            <div className="checkout-summary-row">
              <span>Total Item</span>
              <span>{totalItems} produk</span>
            </div>
            <div className="checkout-summary-row">
              <span>Subtotal</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="checkout-summary-row">
              <span>Ongkos Kirim</span>
              <span>{formatRupiah(SHIPPING_COST)}</span>
            </div>
            <div className="checkout-summary-divider" />
            <div className="checkout-summary-row total">
              <span>Total</span>
              <span>{formatRupiah(totalPayment)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}