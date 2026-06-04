import C from "../../styles/colors";
import HeroSection from "./sections/HeroSection";
import ProblemSection from "./sections/ProblemSection";
import SolutionSection from "./sections/SolutionSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import ImpactSection from "./sections/ImpactSection";
import CTASection from "./sections/CTASection";

export default function HomePage() {
  return (
    <div>
      <HeroSection />

      {/* Trusted by */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "28px 24px",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 40,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              color: C.slate,
              fontSize: 13,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Systems built for
          </span>

          {[
            "Real Estate Agents",
            "Event Planners",
            "Coaches & Tutors",
            "Health Clinics",
            "Service Businesses",
            "Marketplaces",
          ].map((b) => (
            <span
              key={b}
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 14,
                fontFamily: "Syne",
                fontWeight: 600,
              }}
            >
              {b}
            </span>
          ))}
        </div>
      </section>

      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <ImpactSection />
      <CTASection />
    </div>
  );
}
