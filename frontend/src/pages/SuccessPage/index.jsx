import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const transactionId = searchParams.get("transaction_id") || "";
  const txRef = searchParams.get("tx_ref") || "";

  // ✅ 3-state system
  const [status, setStatus] = useState("loading");
  // loading | success | failed

  const [countdown, setCountdown] = useState(5);

  // ✅ payment confirmation
useEffect(() => {
  async function confirm() {
    if (!txRef) {
      setStatus("failed");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/confirm-payment/${transactionId}`,
        {
          method: "GET",
        },
      );

      const data = await res.json();

      setStatus(data.success === true ? "success" : "failed");
    } catch (err) {
      console.error(err);
      setStatus("failed");
    }
  }

  confirm();
}, [txRef, transactionId]);

  // countdown redirect (only on success or failed, not loading)
  useEffect(() => {
    if (status === "loading") return;

    if (countdown <= 0) {
      navigate("/");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate, status]);

  const isSuccess = status === "success";

  if (status === "loading") {
    return <div style={{ color: "white" }}>Verifying payment...</div>;
  }

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
            color: isSuccess ? "#22d3ee" : "#ef4444",
          }}
        >
          {isSuccess ? "Payment Successful ✅" : "Payment Failed ❌"}
        </h1>

        <p style={{ color: "white", marginBottom: "20px" }}>
          {isSuccess
            ? "Your onboarding email will be sent shortly."
            : "Payment was not completed or verification failed."}
        </p>

        <p style={{ color: "#cbd5e1", marginBottom: "10px" }}>
          Status:{" "}
          <b style={{ color: isSuccess ? "#22d3ee" : "#ef4444" }}>
            {status.toUpperCase()}
          </b>
        </p>

        <p style={{ color: "white", marginBottom: "6px" }}>
          Transaction ID: {transactionId}
        </p>

        {txRef && (
          <p style={{ color: "#94a3b8", marginBottom: "10px", fontSize: 13 }}>
            Reference: {txRef}
          </p>
        )}

        <p style={{ color: "#cbd5e1", marginBottom: "20px" }}>
          Redirecting home in <b>{countdown}</b> seconds...
        </p>

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
              background: isSuccess ? "#22d3ee" : "#ef4444",
              transition: "width 1s linear",
            }}
          />
        </div>

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: 10,
            padding: "10px 18px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: isSuccess ? "#22d3ee" : "#ef4444",
            color: "#0f172a",
            fontWeight: 600,
          }}
        >
          Go Home Now
        </button>
      </div>
    </div>
  );
}
