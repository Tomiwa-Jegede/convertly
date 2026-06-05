import { motion } from "framer-motion";
import FadeIn from "../../utils/FadeIn";
import { Icon } from "../../components";
import C from "../../styles/colors";
import { useState } from "react";
import Checkout from "../Checkout/checkout.jsx";

const services = [
  {
    icon: "globe",
    color: C.cyan,
    title: "Conversion Websites for Listings",
    price: "From $399.99",
    features: [
      "Mobile-first responsive design",
      "Built-in booking forms",
      "WhatsApp integration",
      "SEO-optimized structure",
      "Fast loading & hosting setup",
    ],
  },
  {
    icon: "bot",
    color: C.emerald,
    title: "AI Customer Response Bots",
    price: "From $399.99",
    features: [
      "WhatsApp automation",
      "Web chat widget",
      "FAQ handling",
      "Lead qualification flows",
      "Appointment scheduling bot",
    ],
  },
  {
    icon: "calendar",
    color: "#A78BFA",
    title: "Booking System Integration",
    price: "From $199.99",
    features: [
      "Google Calendar sync",
      "Availability management",
      "Automated reminders",
      "Payment link integration",
      "Custom confirmation flows",
    ],
  },
  {
    icon: "chart",
    color: "#FB923C",
    title: "Lead Tracking Dashboards",
    price: "From $299.99",
    features: [
      "Google Sheets CRM setup",
      "Lead source tracking",
      "Conversion rate analytics",
      "Follow-up automation",
      "Weekly report emails",
    ],
  },
  {
    icon: "zap",
    color: C.cyan,
    title: "Social Media Lead Automation",
    price: "From $299.99",
    features: [
      "Instagram DM auto-reply",
      "Facebook Messenger bot",
      "Comment-to-DM funnels",
      "Story response capture",
      "Lead handoff to sheets",
    ],
  },
  {
    icon: "database",
    color: C.emerald,
    title: "Data & Inquiry Management",
    price: "From $199.99",
    features: [
      "Inquiry pipeline setup",
      "Auto-categorization",
      "Response time tracking",
      "Customer history logs",
      "Team notification system",
    ],
  },
];

export default function ServicesPage() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [formError, setFormError] = useState("");
  async function handlePayment() {
    setFormError("");

    if (!customerName.trim()) {
      setFormError("Please enter your full name.");
      return false;
    }

    if (!customerPhone.trim()) {
      setFormError("Please enter your phone number.");
      return false;
    }

    if (!customerEmail.trim()) {
      setFormError("Please enter your email address.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      setFormError("Please enter a valid email address.");
      return false;
    }

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const response = await fetch(`${API_URL}/api/create-payment-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          productName: selectedService,
          customerName,
          customerEmail,
          customerPhone,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to create payment link");
      }

      const data = await response.json();

      if (!data.paymentLink) {
        throw new Error("Payment link not returned");
      }

      window.location.href = data.paymentLink;
    } catch (err) {
      clearTimeout(timeoutId);

      console.error("Payment Error:", err);
      throw err;
    }
  }

  return (
    <div style={{ paddingTop: 120, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div className="section-label" style={{ margin: "0 auto 20px" }}>
              <Icon name="layers" size={12} color={C.cyan} /> What We Build
            </div>

            <h1
              style={{
                fontSize: "clamp(32px, 5vw, 58px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginBottom: 20,
              }}
            >
              Systems, not just <span className="glow-text">websites</span>
            </h1>

            <p
              style={{
                color: C.slate,
                fontSize: 18,
                maxWidth: 520,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Every service we offer is a piece of a larger conversion engine
              designed to turn traffic into revenue.
            </p>
          </div>
        </FadeIn>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 28,
          }}
        >
          {services.map(({ icon, color, title, price, features }, i) => (
            <FadeIn key={title} delay={i * 0.07}>
              <motion.div
                className="card-glass"
                whileHover={{ y: -6, borderColor: `${color}35` }}
                style={{
                  padding: 32,
                  height: "100%",
                  transition: "border-color 0.2s",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      background: `${color}15`,
                      border: `1px solid ${color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name={icon} size={24} color={color} />
                  </div>

                  <span
                    style={{
                      fontFamily: "Syne",
                      fontWeight: 700,
                      fontSize: 13,
                      color,
                      background: `${color}15`,
                      border: `1px solid ${color}25`,
                      padding: "5px 12px",
                      borderRadius: 8,
                    }}
                  >
                    {price}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "Syne",
                    fontWeight: 800,
                    fontSize: 18,
                    marginBottom: 16,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.3,
                  }}
                >
                  {title}
                </h3>

                <ul
                  style={{
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    flex: 1,
                  }}
                >
                  {features.map((f) => (
                    <li
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 14,
                        color: C.slateLight,
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: `${color}20`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon name="check" size={10} color={color} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className="btn-secondary"
                  onClick={() => {
                    setSelectedService(title);
                    setIsCheckoutOpen(true);
                  }}
                  style={{
                    marginTop: 24,
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  Get This System
                </button>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        {/* Bundle note */}
        <FadeIn>
          <div
            className="card-glass"
            style={{
              marginTop: 48,
              padding: 40,
              textAlign: "center",
              background:
                "linear-gradient(135deg, rgba(34,211,238,0.06), rgba(16,185,129,0.04))",
              borderColor: "rgba(34,211,238,0.2)",
            }}
          >
            <h3
              style={{
                fontFamily: "Syne",
                fontWeight: 800,
                fontSize: 22,
                marginBottom: 12,
              }}
            >
              Want everything bundled?
            </h3>

            <p
              style={{
                color: C.slate,
                fontSize: 16,
                marginBottom: 24,
                maxWidth: 500,
                margin: "0 auto 24px",
              }}
            >
              Our full-stack Conversion System packages combine everything into
              one integrated revenue engine, starting at $1499.99
            </p>

            <button
              className="btn-primary glow-cyan"
              onClick={() => {
                setSelectedService("Full Bundle Package");
                setIsCheckoutOpen(true);
              }}
            >
              Get a Custom Quote{" "}
              <Icon name="arrow" size={16} color={C.indigoDark} />
            </button>
          </div>
        </FadeIn>

        <Checkout
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          selectedService={selectedService}
          customerName={customerName}
          setCustomerName={setCustomerName}
          customerEmail={customerEmail}
          setCustomerEmail={setCustomerEmail}
          customerPhone={customerPhone}
          setCustomerPhone={setCustomerPhone}
          formError={formError}
          onSubmit={handlePayment}
        />
      </div>
    </div>
  );
}
