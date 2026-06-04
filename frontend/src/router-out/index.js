import SuccessPage from "../pages/SuccessPage";
export default function Router({ page, setPage, pageData }) {
  switch (page) {
    case "Home":
      return <Home setPage={setPage} />;

    case "Services":
      return <ServicesPage setPage={setPage} pageData={pageData} />;

    case "Contact":
      return <ContactPage setPage={setPage} pageData={pageData} />;

         case "Success":
      return <SuccessPage setPage={setPage} pageData={pageData} />;

    default:
      return <Home setPage={setPage} />;
  }
}
