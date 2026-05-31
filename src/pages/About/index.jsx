import FadeIn from "../../utils/FadeIn";
import { Icon } from "../../components";
import C from "../../styles/colors";

const timeline = [
  {
    year: "2023",
    title: "The Problem Observed",
    desc: "Watching business owners lose customers who sent inquiries that went cold. The gap was painfully clear — attention without a system.",
  },
  {
    year: "2024",
    title: "First Systems Built",
    desc: "Started building WhatsApp bots and Google Sheets CRMs for local businesses. Early results were immediate and striking.",
  },
  {
    year: "2025",
    title: "Framework Refined",
    desc: "Developed the Convertly methodology — a repeatable system for turning any listing-based business into an automated revenue machine.",
  },
  {
    year: "2026",
    title: "Scaling Clients",
    desc: "Now serving businesses across real estate, coaching, health, and service industries across Nigeria and beyond.",
  },
];

export default function AboutPage({ setPage }) {
  return (
    <div style={{ paddingTop: 120, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        {/* Mission */}
        <FadeIn>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 72,
              alignItems: "center",
              marginBottom: 100,
            }}
          >
            <div>
              <div className="section-label" style={{ marginBottom: 20 }}>
                <Icon name="target" size={12} color={C.cyan} /> Our Mission
              </div>
              <h1
                style={{
                  fontSize: "clamp(30px, 4.5vw, 52px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  marginBottom: 24,
                  lineHeight: 1.15,
                }}
              >
                We fix broken{" "}
                <span className="glow-text">conversion systems</span>
              </h1>
              <p
                style={{
                  color: C.slate,
                  fontSize: 16,
                  lineHeight: 1.8,
                  marginBottom: 20,
                }}
              >
                Across the world, millions of business owners are listed on
                directories, active on social media, and generating genuine
                interest — yet only a small fraction of that attention converts
                into paying customers. The problem isn't visibility. It's
                conversion.
              </p>
              <p
                style={{
                  color: C.slate,
                  fontSize: 16,
                  lineHeight: 1.8,
                  marginBottom: 32,
                }}
              >
                The problem isn't the product. It's the absence of a system
                between attention and money. We exist to build that system.
              </p>
              <button
                className="btn-primary"
                onClick={() => setPage("Contact")}
              >
                Work With Us{" "}
                <Icon name="arrow" size={16} color={C.indigoDark} />
              </button>
            </div>
            <div className="hide-mobile">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                {[
                  {
                    label: "Our Vision",
                    text: "Replace manual lead handling with elegant automation systems that work while you sleep.",
                    color: C.cyan,
                  },
                  {
                    label: "Our Approach",
                    text: "We don't build generic sites. Every system is engineered to your specific customer journey.",
                    color: C.emerald,
                  },
                  {
                    label: "Our Promise",
                    text: "More conversations converted. Fewer leads lost. A business that runs more like software.",
                    color: "#A78BFA",
                  },
                  {
                    label: "Our Focus",
                    text: "Listing-based businesses — the most underserved and highest-potential segment in any economy.",
                    color: "#FB923C",
                  },
                ].map(({ label, text, color }) => (
                  <div
                    key={label}
                    className="card-glass"
                    style={{ padding: 24, borderColor: `${color}25` }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: 10,
                      }}
                    >
                      {label}
                    </div>
                    <p
                      style={{
                        color: C.slateLight,
                        fontSize: 13,
                        lineHeight: 1.65,
                      }}
                    >
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Why businesses lose customers */}
        <FadeIn>
          <div
            className="card-glass"
            style={{
              padding: "48px 40px",
              marginBottom: 80,
              background: "rgba(34,211,238,0.03)",
              borderColor: "rgba(34,211,238,0.15)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 48,
                alignItems: "center",
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "Syne",
                    fontWeight: 800,
                    fontSize: 28,
                    letterSpacing: "-0.02em",
                    marginBottom: 20,
                    lineHeight: 1.25,
                  }}
                >
                  Why most businesses lose customers they've already earned
                </h2>
                <p
                  style={{
                    color: C.slate,
                    fontSize: 15,
                    lineHeight: 1.8,
                    marginBottom: 16,
                  }}
                >
                  A customer sees your listing. They're interested. They send a
                  message — and then life happens. They wait. You don't reply
                  fast enough. They find someone else.
                </p>
                <p style={{ color: C.slate, fontSize: 15, lineHeight: 1.8 }}>
                  This isn't a sales problem. It's a systems problem. The moment
                  of interest is peak conversion potential. Without automation,
                  most of that potential evaporates in minutes.
                </p>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {[
                  "60% of customers who inquire don't hear back within 1 hour",
                  "Businesses that respond in 5 minutes are 9× more likely to close",
                  "Manual follow-up reduces lead conversion by up to 50%",
                  "Structured CRM systems increase revenue retention by 30%+",
                ].map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: `${C.cyan}20`,
                        border: `1px solid ${C.cyan}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      <Icon name="check" size={12} color={C.cyan} />
                    </div>
                    <span
                      style={{
                        color: C.slateLight,
                        fontSize: 14,
                        lineHeight: 1.6,
                      }}
                    >
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Timeline */}
        <FadeIn>
          <div style={{ marginBottom: 80 }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div className="section-label" style={{ margin: "0 auto 20px" }}>
                <Icon name="layers" size={12} color={C.cyan} /> Our Story
              </div>
              <h2
                style={{
                  fontFamily: "Syne",
                  fontWeight: 800,
                  fontSize: "clamp(26px, 3.5vw, 42px)",
                  letterSpacing: "-0.03em",
                }}
              >
                From idea to impact
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {timeline.map(({ year, title, desc }, i) => (
                <FadeIn key={year} delay={i * 0.1}>
                  <div
                    style={{
                      display: "flex",
                      gap: 32,
                      paddingBottom: 40,
                      position: "relative",
                    }}
                  >
                    {i < timeline.length - 1 && (
                      <div
                        style={{
                          position: "absolute",
                          left: 28,
                          top: 56,
                          bottom: 0,
                          width: 2,
                          background:
                            "linear-gradient(180deg, rgba(34,211,238,0.4), rgba(34,211,238,0.05))",
                        }}
                      />
                    )}
                    <div style={{ flexShrink: 0 }}>
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(16,185,129,0.1))",
                          border: "2px solid rgba(34,211,238,0.4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "Syne",
                            fontWeight: 800,
                            fontSize: 12,
                            color: C.cyan,
                          }}
                        >
                          {year}
                        </span>
                      </div>
                    </div>
                    <div style={{ paddingTop: 12 }}>
                      <h3
                        style={{
                          fontFamily: "Syne",
                          fontWeight: 700,
                          fontSize: 18,
                          marginBottom: 8,
                        }}
                      >
                        {title}
                      </h3>
                      <p
                        style={{
                          color: C.slate,
                          fontSize: 15,
                          lineHeight: 1.7,
                          maxWidth: 500,
                        }}
                      >
                        {desc}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn>
          <div
            style={{
              textAlign: "center",
              padding: "60px 40px",
              background:
                "linear-gradient(135deg, rgba(34,211,238,0.07), rgba(16,185,129,0.04))",
              borderRadius: 24,
              border: "1px solid rgba(34,211,238,0.15)",
            }}
          >
            <h2
              style={{
                fontFamily: "Syne",
                fontWeight: 800,
                fontSize: 32,
                marginBottom: 16,
                letterSpacing: "-0.02em",
              }}
            >
              Ready to build your system?
            </h2>
            <p
              style={{
                color: C.slate,
                fontSize: 16,
                marginBottom: 28,
                maxWidth: 440,
                margin: "0 auto 28px",
              }}
            >
              Let's talk about your business and design a conversion system that
              works for your specific situation.
            </p>
            <button
              className="btn-primary glow-cyan"
              onClick={() => setPage("Contact")}
              style={{ fontSize: 16, padding: "16px 32px" }}
            >
              Start the Conversation{" "}
              <Icon name="arrow" size={17} color={C.indigoDark} />
            </button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
