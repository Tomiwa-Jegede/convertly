import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RootLayout from "./layouts/RootLayout";
import Router from "./router";
import "./styles/global.css";

export default function App() {
  const [page, setPage] = useState(() => {
    return localStorage.getItem("page") || "Home";
  });

  const [pageData, setPageData] = useState(() => {
    return JSON.parse(localStorage.getItem("pageData") || "{}");
  });

  const navigate = (newPage, data = {}) => {
    setPageData(data);
    setPage(newPage);

    localStorage.setItem("page", newPage);
    localStorage.setItem("pageData", JSON.stringify(data));
  };

  useEffect(() => {
    localStorage.setItem("page", page);
    localStorage.setItem("pageData", JSON.stringify(pageData));
  }, [page, pageData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <RootLayout page={page} setPage={navigate}>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Router page={page} setPage={navigate} pageData={pageData} />
        </motion.div>
      </AnimatePresence>
    </RootLayout>
  );
}
