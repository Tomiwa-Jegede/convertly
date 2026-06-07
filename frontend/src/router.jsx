import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/Home";
import ServicesPage from "./pages/Services";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import SuccessPage from "./pages/SuccessPage";
import Onboarding from "./pages/Onboarding";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/onboarding" element={<Onboarding />} />
    </Routes>
  );
}
