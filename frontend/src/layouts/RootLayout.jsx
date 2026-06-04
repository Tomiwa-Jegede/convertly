import { Navbar, Footer, WhatsAppFloat } from "../components";

export default function RootLayout({ page, setPage, children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#080620" }}>
      <Navbar page={page} setPage={setPage} />
      {children}
      <Footer setPage={setPage} />
      <WhatsAppFloat />
    </div>
  );
}
