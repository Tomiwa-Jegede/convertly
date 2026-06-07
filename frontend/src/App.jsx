import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import RootLayout from "./layouts/RootLayout";

import Home from "./pages/Home";
import ServicesPage from "./pages/Services";
import ContactPage from "./pages/Contact";
import SuccessPage from "./pages/SuccessPage";
import AboutPage from "./pages/About";
import Onboarding from "./pages/onBoarding";

import "./styles/global.css";

export default function App() {
  return (
    <RootLayout>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </AnimatePresence>
    </RootLayout>
  );
}
