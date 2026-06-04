import { motion } from "framer-motion";
import FadeIn from "../../../utils/FadeIn";
import { Icon } from "../../../components";
import C from "../../../styles/colors";

export default function HowItWorksSection() {
  const steps = [
    { step: "01", icon: "globe", title: "Customer Sees Your Listing", desc: "They discover you on a directory, social media page, or marketplace." },
    { step: "02", icon: "bot", title: "System Captures Intent", desc: "An automated bot or booking form grabs their interest immediately." },
    { step: "03", icon: "zap", title: "Instant Automated Response", desc: "They receive a reply in seconds — qualified, informed, and guided toward action." },
    { step: "04", icon: "chart", title: "You Close the Sale", desc: "With a booked appointment or captured lead, you only talk to ready buyers." },
  ];

  return (
    <section style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <FadeIn>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div className="section-label" style={{ margin: "0 auto 20px" }}>
            <Icon name="layers" size={12} color={C.cyan} /> How It Works
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
            From listing view to{" "}
            <span className="glow-text">paying customer</span>
          </h2>
        </div>
      </FadeIn>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 0, position: "relative" }}>
        {steps.map(({ step, icon, title, desc }, i) => (
          <FadeIn key={step} delay={i * 0.12}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 24px", position: "relative" }}>
              {i < 3 && (
                <div className="hide-mobile" style={{
                  position: "absolute", top: 32, left: "calc(50% + 40px)", right: "calc(-50% + 40px)",
                  height: 1, background: "linear-gradient(90deg, rgba(34,211,238,0.5), rgba(34,211,238,0.1))",
                  zIndex: 0,
                }} />
              )}
              <motion.div whileHover={{ scale: 1.05 }}
                style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(16,185,129,0.1))", border: "1px solid rgba(34,211,238,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, position: "relative", zIndex: 1 }}>
                <Icon name={icon} size={26} color={C.cyan} />
              </motion.div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.cyan, letterSpacing: "0.15em", marginBottom: 8 }}>STEP {step}</div>
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 10, letterSpacing: "-0.01em" }}>{title}</h3>
              <p style={{ color: C.slate, fontSize: 14, lineHeight: 1.65 }}>{desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
