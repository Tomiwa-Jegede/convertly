import { motion } from "framer-motion";
import FadeIn from "../../../utils/FadeIn";
import { Icon } from "../../../components";
import C from "../../../styles/colors";

export default function SolutionSection() {
  const solutions = [
    {
      icon: "globe",
      color: C.cyan,
      title: "Conversion Websites",
      desc: "Landing pages engineered specifically for listing-based businesses. Every element pushes visitors toward booking or inquiry.",
    },
    {
      icon: "bot",
      color: C.emerald,
      title: "AI Response Bots",
      desc: "WhatsApp and web chat automation that answers questions, qualifies leads, and books appointments — 24/7, without you.",
    },
    {
      icon: "calendar",
      color: "#A78BFA",
      title: "Booking Systems",
      desc: "Google Calendar and custom booking integrations that eliminate scheduling back-and-forth.",
    },
    {
      icon: "chart",
      color: "#FB923C",
      title: "Lead Dashboards",
      desc: "Google Sheets and lightweight CRM setups so you always know where every lead stands.",
    },
    {
      icon: "zap",
      color: C.cyan,
      title: "Social Media Automation",
      desc: "Turn your Instagram, Facebook, and marketplace DMs into automated funnels that capture and follow up on leads.",
    },
    {
      icon: "database",
      color: C.emerald,
      title: "Data & Inquiry Systems",
      desc: "Structured pipelines that organize every inquiry, response, and outcome into actionable business intelligence.",
    },
  ];

  return (
    <section
      style={{
        padding: "100px 24px",
        background: "rgba(34,211,238,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="section-label" style={{ margin: "0 auto 20px" }}>
              <Icon name="zap" size={12} color={C.cyan} /> Our Solutions
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginBottom: 16,
              }}
            >
              Everything you need to{" "}
              <span className="glow-text">convert at scale</span>
            </h2>
          </div>
        </FadeIn>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {solutions.map(({ icon, color, title, desc }, i) => (
            <FadeIn key={title} delay={i * 0.07}>
              <motion.div
                className="card-glass"
                whileHover={{ y: -6, borderColor: `${color}30` }}
                style={{
                  padding: 32,
                  height: "100%",
                  transition: "border-color 0.2s",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <Icon name={icon} size={22} color={color} />
                </div>
                <h3
                  style={{
                    fontFamily: "Syne",
                    fontWeight: 700,
                    fontSize: 17,
                    marginBottom: 12,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {title}
                </h3>
                <p style={{ color: C.slate, fontSize: 14, lineHeight: 1.7 }}>
                  {desc}
                </p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
