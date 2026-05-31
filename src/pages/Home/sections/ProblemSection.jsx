import { motion } from "framer-motion";
import FadeIn from "../../../utils/FadeIn";
import { Icon } from "../../../components";
import C from "../../../styles/colors";

export default function ProblemSection() {
  const problems = [
    { icon: "phone", title: "Unanswered Inquiries", desc: "Potential customers message you and never hear back fast enough, so they go to a competitor." },
    { icon: "calendar", title: "No Booking System", desc: "You rely on back-and-forth DMs to schedule, and half your leads drop off during the process." },
    { icon: "bot", title: "Manual WhatsApp Replies", desc: "You spend hours replying to the same questions, instead of closing sales or delivering your service." },
    { icon: "database", title: "Zero Lead Tracking", desc: "You have no idea where your leads come from, which convert, or how to follow up systematically." },
    { icon: "layers", title: "No Customer Journey", desc: "After a listing view, there's nothing guiding the customer toward payment — just hope." },
  ];

  return (
    <section style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <FadeIn>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="section-label" style={{ margin: "0 auto 20px" }}>
            <Icon name="target" size={12} color={C.cyan} /> The Problem
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16 }}>
            You're losing customers{" "}
            <span className="glow-text">after they show interest</span>
          </h2>
          <p style={{ color: C.slate, fontSize: 17, maxWidth: 500, margin: "0 auto" }}>
            Most listing-based businesses have the same fatal gap — attention without a system to capture it.
          </p>
        </div>
      </FadeIn>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        {problems.map(({ icon, title, desc }, i) => (
          <FadeIn key={title} delay={i * 0.08}>
            <motion.div className="card-glass" whileHover={{ y: -4, borderColor: "rgba(34,211,238,0.2)" }}
              style={{ padding: 28, height: "100%", transition: "border-color 0.2s" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon name={icon} size={20} color="#EF4444" />
              </div>
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{title}</h3>
              <p style={{ color: C.slate, fontSize: 14, lineHeight: 1.65 }}>{desc}</p>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
