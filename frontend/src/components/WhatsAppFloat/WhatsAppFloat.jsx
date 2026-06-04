import { motion } from "framer-motion";
import Icon from "../Icon/Icon";

export default function WhatsAppFloat() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;

  return (
    <motion.a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.5, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "#25D366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 24px rgba(37,211,102,0.4)",
        zIndex: 200,
        cursor: "pointer",
        textDecoration: "none",
      }}
    >
      <Icon name="whatsapp" size={28} color="#fff" />
    </motion.a>
  );
}
