import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Confetti from "react-confetti";
import Layout from "../Shared/Layout";

const ThankYouPage = () => {
  const [searchParams] = useSearchParams();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const transactionId = searchParams.get("transaction_id");
  const txRef = searchParams.get("tx_ref");

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener("resize", handleResize);

    // ✅ Prevent horizontal scroll globally for this page
    document.body.style.overflowX = "hidden";

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflowX = "auto";
    };
  }, []);

  const handleDownloadReceipt = async () => {
    const id = txRef || transactionId;

    if (!id) {
      alert("No transaction reference found to generate a receipt.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/receipt/${id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to download receipt");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${id}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error(error);
      alert("Could not download receipt");
    }
  };

  return (
    <Layout>
      <div className="relative min-h-screen flex items-center justify-center bg-gray-100 px-4 overflow-hidden">
        {/* ✅ Confetti fixed & safe */}
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        />

        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center relative z-10">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Payment Successful</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase! Your order has been processed
            successfully.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleDownloadReceipt}
              className="bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Download Receipt
            </button>

            <Link
              to="/"
              className="border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ThankYouPage;
