import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import C from "../../styles/colors";

export default function Onboarding() {
  const [searchParams] = useSearchParams();

  const [customer, setCustomer] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    businessName: "",
    businessPhone: "",
    businessEmail: "",

    goal: "",

    brandColors: "",
    competitorSites: "",

    aboutBusiness: "",

    services: "",

    socialLinks: "",

    wantsWhatsapp: false,
    wantsAI: false,
    wantsBooking: false,

    notes: "",

    files: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/customer/${token}`)
      .then((res) => res.json())
      .then((data) => {
        setCustomer(data);
      })
      .catch(console.error);
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }

    if (!form.businessPhone.trim()) {
      newErrors.businessPhone = "Business phone is required";
    }

    if (!form.businessEmail.trim()) {
      newErrors.businessEmail = "Business email is required";
    }

    if (!form.goal.trim()) {
      newErrors.goal = "Project goals are required";
    }

    if (!form.aboutBusiness.trim()) {
      newErrors.aboutBusiness = "Tell us about your business";
    }

    if (!form.services.trim()) {
      newErrors.services = "Please describe your services";
    }

    if (form.files.length === 0) {
      newErrors.files = "Please upload at least one file";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async () => {
    if (!validateForm()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      if (!customer) {
        throw new Error("Customer data not loaded yet");
      }

      formData.append("token", customer.token || "");
      formData.append("customerName", customer.customerName || "");
      formData.append("customerEmail", customer.customerEmail || "");
      formData.append("product", customer.product || "");

      Object.entries(form).forEach(([key, value]) => {
        if (key !== "files") {
          formData.append(key, value);
        }
      });

      form.files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/onboarding`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: 24,
        }}
      >
        <div
          className="card-glass"
          style={{
            maxWidth: 700,
            textAlign: "center",
            padding: 40,
          }}
        >
          <h1
            style={{
              fontSize: 48,
              marginBottom: 16,
            }}
          >
            🎉 Thank You
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.8,
            }}
          >
            Your onboarding form has been submitted successfully.
          </p>

          <p
            style={{
              marginTop: 16,
              color: C.slate,
            }}
          >
            Our team has received your information and assets. We’ll begin
            building your project and will contact you if anything else is
            needed.
          </p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        paddingTop: 120,
        paddingBottom: 80,
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div className="card-glass" style={{ padding: 32 }}>
          <div style={{ marginBottom: 32 }}>
            <div className="section-label">🚀 Client Onboarding</div>

            <h1
              style={{
                fontFamily: "Syne",
                fontWeight: 800,
                fontSize: "clamp(32px,4vw,52px)",
                marginTop: 16,
                marginBottom: 12,
              }}
            >
              Welcome {customer.customerName}
            </h1>

            <p
              style={{
                color: C.slate,
                lineHeight: 1.8,
              }}
            >
              Thanks for choosing Convertly. Complete this onboarding form so we
              can build your conversion system exactly how you need it.
            </p>

            <div
              style={{
                marginTop: 20,
                padding: 12,
                borderRadius: 12,
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.3)",
                color: "#22c55e",
              }}
            >
              Purchased Product: {customer.product}
            </div>
          </div>

          {/* BUSINESS INFO */}
          {Object.keys(errors).length > 0 && (
            <div
              style={{
                background: "#fee2e2",
                border: "1px solid #ef4444",
                color: "#991b1b",
                padding: 16,
                borderRadius: 12,
                marginBottom: 24,
              }}
            >
              <strong>Please complete the following:</strong>

              <ul style={{ marginTop: 10 }}>
                {Object.values(errors).map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          <h2 style={{ marginBottom: 20 }}>Business Information</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: 16,
            }}
          >
            <div>
              <input
                placeholder="Business Name"
                value={form.businessName}
                onChange={(e) => updateField("businessName", e.target.value)}
              />

              {errors.businessName && (
                <p style={{ color: "red", marginTop: 6 }}>
                  {errors.businessName}
                </p>
              )}
            </div>

            <div>
              <input
                placeholder="Business Phone"
                value={form.businessPhone}
                onChange={(e) => updateField("businessPhone", e.target.value)}
              />

              {errors.businessPhone && (
                <p style={{ color: "red", marginTop: 6 }}>
                  {errors.businessPhone}
                </p>
              )}
            </div>

            <div>
              <input
                placeholder="Business Email"
                value={form.businessEmail}
                onChange={(e) => updateField("businessEmail", e.target.value)}
              />

              {errors.businessEmail && (
                <p style={{ color: "red", marginTop: 6 }}>
                  {errors.businessEmail}
                </p>
              )}
            </div>
          </div>

          <hr style={{ margin: "40px 0" }} />

          {/* GOAL */}
          <h2>Project Goals</h2>

          <textarea
            rows={5}
            placeholder="Tell us what you're trying to achieve..."
            value={form.goal}
            onChange={(e) => updateField("goal", e.target.value)}
          />
          {errors.goal && (
            <p style={{ color: "red", marginTop: 6 }}>{errors.goal}</p>
          )}

          <hr style={{ margin: "40px 0" }} />

          {/* BUSINESS */}
          <h2>About Your Business</h2>

          <textarea
            rows={5}
            placeholder="Tell us about your company..."
            value={form.aboutBusiness}
            onChange={(e) => updateField("aboutBusiness", e.target.value)}
          />
          {errors.aboutBusiness && (
            <p style={{ color: "red", marginTop: 6 }}>{errors.aboutBusiness}</p>
          )}

          <hr style={{ margin: "40px 0" }} />

          {/* SERVICES */}
          <h2>Products & Services</h2>

          <textarea
            rows={5}
            placeholder="List your products, services and pricing..."
            value={form.services}
            onChange={(e) => updateField("services", e.target.value)}
          />

          {errors.services && (
            <p style={{ color: "red", marginTop: 6 }}>{errors.services}</p>
          )}

          <hr style={{ margin: "40px 0" }} />

          {/* FILE UPLOADS */}
          <h2>Brand Assets</h2>

          <p
            style={{
              color: C.slate,
              marginBottom: 20,
            }}
          >
            Upload your logo, brand guide, images or any documents you'd like us
            to use.
          </p>

          <input
            type="file"
            multiple
            onChange={(e) => updateField("files", Array.from(e.target.files))}
          />
          {errors.files && (
            <p
              style={{
                color: "red",
                marginTop: 6,
              }}
            >
              {errors.files}
            </p>
          )}
          <hr style={{ margin: "40px 0" }} />

          {/* AUTOMATION */}
          <h2>Automation Features</h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              cursor: "pointer",
            }}
          >
            <label>
              <input
                type="checkbox"
                checked={form.wantsWhatsapp}
                onChange={(e) => updateField("wantsWhatsapp", e.target.checked)}
              />
              WhatsApp Integration
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.wantsAI}
                onChange={(e) => updateField("wantsAI", e.target.checked)}
              />
              AI Customer Assistant
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.wantsBooking}
                onChange={(e) => updateField("wantsBooking", e.target.checked)}
              />
              Booking System
            </label>
          </div>

          <hr style={{ margin: "40px 0" }} />

          {/* NOTES */}
          <h2>Anything Else?</h2>

          <textarea
            rows={6}
            placeholder="Additional notes..."
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
          />

          <div style={{ marginTop: 32 }}>
            <button
              className="btn-primary"
              onClick={submitForm}
              disabled={loading}
              style={{
                width: "100%",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {loading ? "Submitting..." : "Submit Onboarding"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
