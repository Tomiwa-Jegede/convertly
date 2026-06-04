import { motion } from "framer-motion";
import C from "../../styles/colors";

export default function Checkout({
  isOpen,
  onClose,
  selectedService,
  customerName,
  setCustomerName,
  customerEmail,
  setCustomerEmail,
  customerPhone,
  setCustomerPhone,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(15, 23, 42, 0.95)",
          border: "1px solid rgba(34,211,238,0.2)",
          borderRadius: 16,
          padding: 28,
          backdropFilter: "blur(10px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            color: C.cyan,
            fontFamily: "Syne",
            marginBottom: 6,
          }}
        >
          Checkout
        </h2>

        <p
          style={{
            color: C.slate,
            fontSize: 13,
            marginBottom: 20,
          }}
        >
          {selectedService}
        </p>

        <input
          type="text"
          placeholder="Full Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
          }}
        />

        <input
          type="tel"
          placeholder="Phone Number (+1234567890)"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 18,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
          }}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 18,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
          }}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ flex: 1 }}
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            className="btn-primary glow-cyan"
            style={{ flex: 1 }}
          >
            Pay Now
          </button>
        </div>
      </motion.div>
    </div>
  );
}
