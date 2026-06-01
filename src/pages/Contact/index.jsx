import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "../../utils/FadeIn";
import { Icon } from "../../components";
import C from "../../styles/colors";

const businessTypes = [
  "Real Estate Agent",
  "Event Planner / Vendor",
  "Health / Wellness Clinic",
  "Coach / Tutor / Consultant",
  "Service Business (Cleaning, Repair etc.)",
  "Marketplace / Directory",
  "Restaurant / Food Business",
  "Retail / E-commerce",
  "Other",
];

const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL || "officialconvertly@gmail.com";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "447423342297";

const RESPONSE_TIME =
  import.meta.env.VITE_RESPONSE_TIME || "Within 2 business hours";

const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT;

export default function ContactPage({ pageData }) {
  const selectedService = pageData?.service || "";
  const [form, setForm] = useState({
    name: "",
    businessType: "",
    service: "",
    contact: "",
    problem: "",
  });

  const [status, setStatus] = useState("idle");
  const isMobile = window.innerWidth < 768;
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      service: selectedService || "",
    }));
  }, [selectedService]);

const handleSubmit = async () => {
  if (!form.name || !form.contact || !form.problem) {
    alert("Please complete all required fields.");
    return;
  }

  setStatus("loading");

  try {
    const payload = {
      name: form.name,
      businessType: form.businessType,
      service: form.service,
      contact: form.contact,
      problem: form.problem,
      submittedAt: new Date().toISOString(),
    };

    await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload),
    }).catch(() => {});

    setStatus("success");

    setForm({
      name: "",
      businessType: "",
      service: "",
      contact: "",
      problem: "",
    });
  } catch (err) {
    console.error(err);
    setStatus("error");
  }
};

  return (
    <div style={{ paddingTop: 120, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 72,
            alignItems: "start",
          }}
        >
          {/* LEFT SIDE */}
          <div>
            <FadeIn>
              <div className="section-label" style={{ marginBottom: 20 }}>
                <Icon name="mail" size={12} color={C.cyan} /> Get In Touch
              </div>

              <h1
                style={{
                  fontSize: "clamp(30px, 4.5vw, 52px)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  marginBottom: 20,
                  lineHeight: 1.15,
                }}
              >
                Let's build your{" "}
                <span className="glow-text">conversion system</span>
              </h1>

              <p
                style={{
                  color: C.slate,
                  fontSize: 16,
                  lineHeight: 1.8,
                  marginBottom: 40,
                }}
              >
                Tell us about your business and the problems you're facing.
                We'll design a system that turns your traffic into revenue.
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  marginBottom: 48,
                }}
              >
                {[
                  {
                    icon: "phone",
                    label: "WhatsApp",
                    value: `+${WHATSAPP_NUMBER}`,
                    color: C.emerald,
                  },
                  {
                    icon: "mail",
                    label: "Email",
                    value: CONTACT_EMAIL,
                    color: C.cyan,
                  },
                  {
                    icon: "globe",
                    label: "Response Time",
                    value: RESPONSE_TIME,
                    color: "#A78BFA",
                  },
                ].map(({ icon, label, value, color }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: `${color}15`,
                        border: `1px solid ${color}25`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon name={icon} size={18} color={color} />
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          color: C.slate,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          fontWeight: 600,
                        }}
                      >
                        {label}
                      </div>

                      <div
                        style={{
                          fontFamily: "Syne",
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        {value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div
                className="card-glass"
                style={{
                  padding: 20,
                  borderColor: `${C.emerald}25`,
                }}
              >
                <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Icon key={i} name="star" size={14} color={C.emerald} />
                  ))}
                </div>

                <p
                  style={{
                    color: C.slateLight,
                    fontSize: 14,
                    lineHeight: 1.7,
                    fontStyle: "italic",
                    marginBottom: 14,
                  }}
                >
                  "Honestly this has been great 😊 Customers are getting answers
                  and booking trips without us having to reply to every message.
                  It's saving us so much time. Thank you! 🙏"
                </p>

                <div
                  style={{
                    fontFamily: "Syne",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  Emma Virtanen.
                </div>

                <div style={{ color: C.slate, fontSize: 12 }}>
                  Northern Routes Travel — Helsinki, Finland
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Form */}
          <FadeIn delay={0.15}>
            <div
              className="card-glass"
              style={{
                padding: "32px 24px",
                borderRadius: 20,
              }}
            >
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ textAlign: "center", padding: "40px 20px" }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      style={{
                        width: 72,

                        height: 72,

                        borderRadius: "50%",

                        background: `${C.emerald}20`,

                        border: `2px solid ${C.emerald}`,

                        display: "flex",

                        alignItems: "center",

                        justifyContent: "center",

                        margin: "0 auto 24px",
                      }}
                    >
                      <Icon name="check" size={32} color={C.emerald} />
                    </motion.div>

                    <h3
                      style={{
                        fontFamily: "Syne",

                        fontWeight: 800,

                        fontSize: 24,

                        marginBottom: 12,
                      }}
                    >
                      Message Received!
                    </h3>

                    <p
                      style={{ color: C.slate, fontSize: 15, lineHeight: 1.7 }}
                    >
                      We'll review your details and reach out within 2 business
                      hours to discuss your conversion system.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <h2
                      style={{
                        fontFamily: "Syne",

                        fontWeight: 800,

                        fontSize: 22,

                        marginBottom: 8,
                      }}
                    >
                      Book a Free Demo
                    </h2>

                    {form.service && (
                      <div
                        style={{
                          marginBottom: 16,
                          padding: "8px 12px",
                          borderRadius: 10,
                          background: "rgba(34,197,94,0.1)",
                          border: "1px solid rgba(34,197,94,0.3)",
                          color: "#22c55e",
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        Selected Service: {form.service}
                      </div>
                    )}

                    <p
                      style={{ color: C.slate, fontSize: 14, marginBottom: 28 }}
                    >
                      We'll analyse your setup and show you what a system could
                      look like.
                    </p>

                    <div
                      style={{
                        display: "flex",

                        flexDirection: "column",

                        gap: 18,
                      }}
                    >
                      <div>
                        <label
                          style={{
                            fontSize: 13,

                            fontWeight: 600,

                            color: C.slateLight,

                            display: "block",

                            marginBottom: 6,
                          }}
                        >
                          Full Name *
                        </label>

                        <input
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          placeholder="Your full name"
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            fontSize: 13,

                            fontWeight: 600,

                            color: C.slateLight,

                            display: "block",

                            marginBottom: 6,
                          }}
                        >
                          Business Type
                        </label>

                        <select
                          value={form.businessType}
                          onChange={(e) =>
                            setForm({ ...form, businessType: e.target.value })
                          }
                        >
                          <option value="">Select your business type</option>

                          {businessTypes.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: C.slateLight,
                            display: "block",
                            marginBottom: 6,
                          }}
                        >
                          Service Interested In
                        </label>

                        <input
                          value={form.service}
                          onChange={(e) =>
                            setForm({ ...form, service: e.target.value })
                          }
                          placeholder="e.g. AI Customer Response Bots"
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            fontSize: 13,

                            fontWeight: 600,

                            color: C.slateLight,

                            display: "block",

                            marginBottom: 6,
                          }}
                        >
                          Email or WhatsApp *
                        </label>

                        <input
                          value={form.contact}
                          onChange={(e) =>
                            setForm({ ...form, contact: e.target.value })
                          }
                          placeholder="yourname@email.com or +234 XXX"
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            fontSize: 13,

                            fontWeight: 600,

                            color: C.slateLight,

                            display: "block",

                            marginBottom: 6,
                          }}
                        >
                          What's your current problem? *
                        </label>

                        <textarea
                          value={form.problem}
                          onChange={(e) =>
                            setForm({ ...form, problem: e.target.value })
                          }
                          placeholder="Describe how you currently get leads and where you're losing customers..."
                          rows={5}
                        />
                      </div>

                      {status === "error" && (
                        <div
                          style={{
                            padding: "12px 16px",

                            background: "rgba(239,68,68,0.1)",

                            border: "1px solid rgba(239,68,68,0.3)",

                            borderRadius: 10,

                            fontSize: 13,

                            color: "#FCA5A5",
                          }}
                        >
                          Something went wrong. Please try WhatsApp or email
                          instead.
                        </div>
                      )}

                      <motion.button
                        className="btn-primary"
                        onClick={handleSubmit}
                        disabled={status === "loading"}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          justifyContent: "center",

                          width: "100%",

                          padding: "16px",

                          fontSize: 16,

                          opacity: status === "loading" ? 0.8 : 1,
                        }}
                      >
                        {status === "loading" ? (
                          <span
                            style={{
                              display: "flex",

                              alignItems: "center",

                              gap: 10,
                            }}
                          >
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 0.8,

                                repeat: Infinity,

                                ease: "linear",
                              }}
                              style={{
                                display: "block",

                                width: 16,

                                height: 16,

                                border: `2px solid ${C.indigoDark}`,

                                borderTopColor: "transparent",

                                borderRadius: "50%",
                              }}
                            />
                            Sending…
                          </span>
                        ) : (
                          <>
                            Get My Conversion System{" "}
                            <Icon name="arrow" size={17} color={C.indigoDark} />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
