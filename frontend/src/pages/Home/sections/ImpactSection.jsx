import FadeIn from "../../../utils/FadeIn";
import { Icon } from "../../../components";
import C from "../../../styles/colors";

export default function ImpactSection() {
  const stats = [
    { num: "+40%", label: "More Conversions", sub: "Average across clients", color: C.cyan },
    { num: "-70%", label: "Missed Inquiries", sub: "Reduction with automation", color: C.emerald },
    { num: "< 2min", label: "Response Time", sub: "vs. hours manually", color: "#A78BFA" },
    { num: "3×", label: "Structured Leads", sub: "vs. unorganized DMs", color: "#FB923C" },
  ];

  return (
    <section style={{ padding: "80px 24px", background: "linear-gradient(135deg, rgba(34,211,238,0.06) 0%, rgba(16,185,129,0.04) 100%)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-label" style={{ margin: "0 auto 20px" }}>
              <Icon name="chart" size={12} color={C.cyan} /> Real Impact
            </div>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Systems that actually move the needle
            </h2>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
          {stats.map(({ num, label, sub, color }, i) => (
            <FadeIn key={label} delay={i * 0.08}>
              <div className="card-glass" style={{ padding: 32, textAlign: "center" }}>
                <div style={{ fontSize: 44, fontFamily: "Syne", fontWeight: 800, color, letterSpacing: "-0.04em", lineHeight: 1 }}>{num}</div>
                <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, marginTop: 12, marginBottom: 4 }}>{label}</div>
                <div style={{ color: C.slate, fontSize: 13 }}>{sub}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
