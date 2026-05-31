import HomePage from "./pages/Home";
import ServicesPage from "./pages/Services";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";

export default function Router({ page, setPage, pageData }) {
  const pages = {
    Home: <HomePage setPage={setPage} />,

    Services: <ServicesPage setPage={setPage} pageData={pageData} />,

    About: <AboutPage setPage={setPage} />,

    Contact: <ContactPage setPage={setPage} pageData={pageData} />,
  };

  return pages[page] || <HomePage setPage={setPage} />;
}
