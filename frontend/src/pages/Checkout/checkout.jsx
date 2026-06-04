import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import C from "../../styles/colors";
import Icon from "../../components/Icon/Icon";

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
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

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
      onClick={loading ? undefined : onClose}
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
          position: "relative",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 🔥 FULL SCREEN LOADING OVERLAY */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute",
                inset: 0,

                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999,
                background: "rgba(2, 6, 23, 0.12)",
              }}
            >
              {/* Heartbeat Logo */}
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 18,
                  background: "linear-gradient(135deg, #22D3EE, #10B981)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 40px rgba(34,211,238,0.5)",
                }}
              >
                <Icon name="zap" size={34} color="#0F0C29" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM CONTENT (dims under loader) */}
        <div
          style={{
            opacity: loading ? 0.2 : 1,
            pointerEvents: loading ? "none" : "auto",
          }}
        >
          <h2 style={{ color: C.cyan, fontFamily: "Syne", marginBottom: 6 }}>
            Checkout
          </h2>

          <p style={{ color: C.slate, fontSize: 13, marginBottom: 20 }}>
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
            placeholder="Phone Number"
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
              onClick={handleSubmit}
              className="btn-primary glow-cyan"
              style={{ flex: 1 }}
            >
              Pay Now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
