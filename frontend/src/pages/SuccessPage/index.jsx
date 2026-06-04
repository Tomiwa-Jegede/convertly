import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const transactionId = searchParams.get("transaction_id");
  const status = searchParams.get("status");

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) {
      navigate("/");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        background: "linear-gradient(135deg, #0f172a, #020617)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          textAlign: "center",
          padding: "30px",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            marginBottom: "10px",
            color: "#22d3ee",
          }}
        >
          Payment Successful ✅ <br /> your onboarding email will be sent
        </h1>

        <p style={{ color: "white", marginBottom: "10px" }}>
          Transaction ID: {transactionId}
        </p>

        <p style={{ color: "#cbd5e1", marginBottom: "20px" }}>
          Redirecting home in <b>{countdown}</b> seconds...
        </p>

        {/* progress bar */}
        <div
          style={{
            height: "6px",
            width: "100%",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(countdown / 5) * 100}%`,
              background: "#22d3ee",
              transition: "width 1s linear",
            }}
          />
        </div>
      </div>
    </div>
  );
}
