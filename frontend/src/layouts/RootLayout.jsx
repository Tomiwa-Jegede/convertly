import { Navbar, Footer, WhatsAppFloat } from "../components";

export default function RootLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#080620" }}>
      <Navbar />
      {children}
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
