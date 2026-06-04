import { motion } from "framer-motion";
import Icon from "../Icon/Icon";
import C from "../../styles/colors";

export default function HeroDashboard() {
  return (
    <div style={{ position: "relative", height: 420 }}>
      {/* Main card */}
      <motion.div className="card-glass glow-cyan"
        animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: 20, left: 0, right: 0, padding: 24, borderRadius: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14 }}>Conversion Dashboard</span>
          <div style={{ display: "flex", gap: 6 }}>
            {[C.cyan, C.emerald, "#FB923C"].map(c => (
              <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[["47", "Leads Today", C.cyan], ["12", "Booked", C.emerald], ["₦840K", "Pipeline", "#FB923C"]].map(([v, l, c]) => (
            <div key={l} style={{ background: `${c}10`, border: `1px solid ${c}25`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
              <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 20, color: c }}>{v}</div>
              <div style={{ fontSize: 11, color: C.slate, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
        {/* Mini bar chart */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
          {[30, 45, 38, 60, 52, 70, 85].map((h, i) => (
            <motion.div key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.5 + i * 0.07, duration: 0.4 }}
              style={{ flex: 1, height: `${h}%`, borderRadius: "4px 4px 0 0", background: i === 6 ? `linear-gradient(180deg, ${C.cyan}, ${C.cyanDim})` : `rgba(34,211,238,${0.2 + i * 0.04})`, transformOrigin: "bottom" }} />
          ))}
        </div>
      </motion.div>

      {/* Floating notification */}
      <motion.div className="card-glass"
        animate={{ y: [0, 6, 0], x: [0, -4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ position: "absolute", bottom: 20, right: -20, padding: "12px 16px", borderRadius: 14, display: "flex", alignItems: "center", gap: 10, borderColor: `${C.emerald}30`, minWidth: 220 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C.emerald}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="check" size={16} color={C.emerald} />
        </div>
        <div>
          <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: C.emerald }}>New Booking!</div>
          <div style={{ fontSize: 12, color: C.slate }}>Aisha confirmed for Tue 3pm</div>
        </div>
      </motion.div>

      {/* Bot reply bubble */}
      <motion.div
        animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 3, repeat: Infinity, delay: 2 }}
        style={{ position: "absolute", bottom: 90, left: -10, padding: "10px 14px", background: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(16,185,129,0.1))", border: "1px solid rgba(34,211,238,0.25)", borderRadius: 14, maxWidth: 190 }}>
        <div style={{ fontSize: 11, color: C.slateLight, lineHeight: 1.5 }}>
          <span style={{ color: C.cyan, fontWeight: 700, fontFamily: "Syne" }}>AI Bot: </span>
          "Hi! I'd love to help you book a session. What time works for you?"
        </div>
      </motion.div>
    </div>
  );
}
