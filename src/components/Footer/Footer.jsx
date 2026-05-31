import Icon from "../Icon/Icon";
import C from "../../styles/colors";
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;

export default function Footer({ setPage }) {
  const handleFooterLink = (link) => {
    switch (link) {
      case "Conversion Websites":
      case "AI Bots":
      case "Booking Systems":
      case "Lead Tracking":
      case "Social Automation":
        setPage("Services");
        break;

      case "About":
        setPage("About");
        break;

      case "Services":
        setPage("Services");
        break;

      case "Contact":
        setPage("Contact");
        break;

      case "Book a Demo":
        setPage("Contact");
        break;

      case "WhatsApp Us":
        window.open(
          `https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}`,
          "_blank",
        );
        break;

      case "Email Us":
        window.location.href = `mailto:${contactEmail}`;
        break;

      case "Free Consultation":
        setPage("Contact");
        break;

      default:
        break;
    }
  };

  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "60px 24px 40px",
        background: "rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 40,
            marginBottom: 48,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
                cursor: "pointer",
              }}
              onClick={() => setPage("Home")}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #22D3EE, #10B981)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="zap" size={18} color="#0F0C29" />
              </div>
              <span
                style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 18 }}
              >
                Convertly<span style={{ color: C.cyan }}>.</span>
              </span>
            </div>
            <p
              style={{
                color: C.slate,
                fontSize: 14,
                lineHeight: 1.7,
                maxWidth: 260,
              }}
            >
              We don't just build websites — we build systems that turn traffic
              into revenue.
            </p>
          </div>
          {[
            {
              title: "Services",
              links: [
                "Conversion Websites",
                "AI Bots",
                "Booking Systems",
                "Lead Tracking",
                "Social Automation",
              ],
            },
            {
              title: "Company",
              links: ["About", "Services", "Contact", "Book a Demo"],
            },
            {
              title: "Contact",
              links: ["WhatsApp Us", "Email Us", "Free Consultation"],
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <div
                style={{
                  fontFamily: "Syne",
                  fontWeight: 700,
                  fontSize: 14,
                  marginBottom: 16,
                }}
              >
                {title}
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {links.map((l) => (
                  <span
                    key={l}
                    onClick={() => handleFooterLink(l)}
                    style={{
                      color: C.slate,
                      fontSize: 14,
                      cursor: "pointer",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = C.white)}
                    onMouseLeave={(e) => (e.target.style.color = C.slate)}
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: 28,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <span style={{ color: C.slate, fontSize: 13 }}>
            © {new Date().getFullYear()} Convertly Systems. All rights reserved.
          </span>
          <span style={{ color: C.slate, fontSize: 13 }}>
            Built to convert. Designed to scale.
          </span>
        </div>
      </div>
    </footer>
  );
}
