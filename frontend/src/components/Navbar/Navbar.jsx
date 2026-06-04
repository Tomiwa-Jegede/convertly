import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

import Icon from "../Icon/Icon";
import { navLinks } from "../../data/navigation";
import C from "../../styles/colors";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

 const routeMap = {
   Home: "/",
   Services: "/services",
   Contact: "/contact",
   About: "/about",
 };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);

    window.addEventListener("scroll", handler);

    return () => {
      window.removeEventListener("scroll", handler);
    };
  }, []);

  return (
    <motion.nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? "12px 0" : "20px 0",
        background: scrolled ? "rgba(8,6,32,0.95)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <motion.div
          onClick={() => navigate("/")}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
          whileHover={{ scale: 1.02 }}
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
            style={{
              fontFamily: "Syne",
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: "-0.02em",
            }}
          >
            Convertly<span style={{ color: C.cyan }}>.</span>
          </span>
        </motion.div>

        {/* Desktop Links */}
        <div
          className="hide-mobile"
          style={{
            display: "flex",
            gap: 36,
            alignItems: "center",
          }}
        >
          {navLinks.map((l) => (
            <button
              key={l}
              className={`nav-link ${
                location.pathname === routeMap[l] ? "active" : ""
              }`}
              onClick={() => navigate(routeMap[l])}
              style={{
                fontFamily: "Syne",
                fontWeight: 600,
                color: location.pathname === routeMap[l] ? C.white : C.slate,
              }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div
          className="hide-mobile"
          style={{
            display: "flex",
            gap: 12,
          }}
        >
          <button
            className="btn-secondary"
            style={{
              padding: "10px 20px",
              fontSize: 14,
            }}
            onClick={() => navigate("/contact")}
          >
            Get Started
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="show-mobile"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: C.white,
          }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Icon name={mobileOpen ? "x" : "menu"} size={24} color={C.white} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "rgba(8,6,32,0.98)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {navLinks.map((l) => (
              <button
                key={l}
                className="nav-link"
                onClick={() => {
                  navigate(routeMap[l]);
                  setMobileOpen(false);
                }}
                style={{
                  fontSize: 18,
                  fontFamily: "Syne",
                  fontWeight: 700,
                  textAlign: "left",
                }}
              >
                {l}
              </button>
            ))}

            <button
              className="btn-primary"
              style={{ width: "fit-content" }}
              onClick={() => {
                navigate("/contact");
                setMobileOpen(false);
              }}
            >
              Get Started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
