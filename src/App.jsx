import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { GridLoader } from "react-spinners";

export const baseUrl = "https://ecombackend-6znk.onrender.com/";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // duration of spinner

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={styles.glassOverlay}>
        <div style={styles.glassCard}>
          <GridLoader size={20} color="#000" />
          <p style={styles.loadingText}>Loading your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        pauseOnHover
        theme="colored"
      />
      <Outlet />
    </>
  );
}

const styles = {
  glassOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  glassCard: {
    background: "rgba(255, 255, 255, 0.6)",
    borderRadius: "16px",
    padding: "30px 40px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  loadingText: {
    color: "#111",
    fontSize: "14px",
    fontWeight: "500",
    letterSpacing: "0.5px",
  },
};

export default App;
