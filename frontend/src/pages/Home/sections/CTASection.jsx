import FadeIn from "../../../utils/FadeIn";
import { Icon } from "../../../components";
import C from "../../../styles/colors";
import { useNavigate } from "react-router-dom";

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        padding: "100px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(34,211,238,0.07), transparent)",
          pointerEvents: "none",
        }}
      />

      <FadeIn>
        <div style={{ maxWidth: 600, margin: "0 auto", position: "relative" }}>
          <div className="section-label" style={{ margin: "0 auto 24px" }}>
            <Icon name="zap" size={12} color={C.cyan} /> Get Started Today
          </div>

          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: 20,
            }}
          >
            Stop losing customers
            <br />
            <span className="glow-text">after inquiries</span>
          </h2>

          <p
            style={{
              color: C.slate,
              fontSize: 17,
              marginBottom: 36,
              lineHeight: 1.7,
            }}
          >
            Every day without a conversion system is a day you're leaving
            revenue on the table. Let's fix that.
          </p>

          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn-primary glow-cyan"
              onClick={() => navigate("/contact")}
              style={{ fontSize: 16, padding: "16px 32px" }}
            >
              Get a Conversion System{" "}
              <Icon name="arrow" size={17} color={C.indigoDark} />
            </button>

            <button
              className="btn-secondary"
              onClick={() => navigate("/services")}
            >
              Explore Services
            </button>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
