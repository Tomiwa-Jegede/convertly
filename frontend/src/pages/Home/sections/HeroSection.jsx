import { motion } from "framer-motion";
import { Icon, HeroDashboard } from "../../../components";
import C from "../../../styles/colors";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      className="mesh-bg grid-dots"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: 100,
        paddingBottom: 80,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "15%",
          right: "8%",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        style={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center",
          }}
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="section-label">
                <Icon name="zap" size={12} color={C.cyan} /> Revenue Automation
                Systems
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                fontSize: "clamp(38px, 5vw, 64px)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                marginBottom: 24,
              }}
            >
              Turn Listings Into{" "}
              <span className="glow-text">Automated Revenue</span> Systems
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontSize: "clamp(16px, 2vw, 19px)",
                color: C.slate,
                lineHeight: 1.7,
                marginBottom: 36,
                maxWidth: 480,
              }}
            >
              We help businesses convert inquiries into bookings using websites,
              bots, and automation systems — so you close more sales without
              lifting a finger.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
            >
              <button
                className="btn-primary glow-cyan"
                onClick={() => navigate("/contact")}
              >
                Book a Demo <Icon name="arrow" size={16} color={C.indigoDark} />
              </button>

              <button
                className="btn-secondary"
                onClick={() => navigate("/services")}
              >
                See Solutions
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                display: "flex",
                gap: 32,
                marginTop: 48,
                flexWrap: "wrap",
              }}
            >
              {[
                ["40%", "More Conversions"],
                ["70%", "Fewer Missed Leads"],
                ["3×", "Faster Response"],
              ].map(([stat, label]) => (
                <div key={stat}>
                  <div
                    style={{
                      fontSize: 26,
                      fontFamily: "Syne",
                      fontWeight: 800,
                      color: C.cyan,
                    }}
                  >
                    {stat}
                  </div>
                  <div style={{ fontSize: 13, color: C.slate }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hide-mobile"
            style={{ position: "relative" }}
          >
            <HeroDashboard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
