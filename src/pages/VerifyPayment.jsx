import React, { useContext, useEffect, useState, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Confetti from "react-confetti";
import { toast } from "react-toastify";
import { ProductContext } from "../Context/ProductContext";
import { baseUrl } from "../App";
import { PulseLoader } from "react-spinners";

export default function ThankYouPage() {
  const [params] = useSearchParams();
  const transactionId = params.get("transaction_id");
  const [isVisible, setIsVisible] = useState(false);

  const { token, setCartItems } = useContext(ProductContext);

  const [isVerified, setIsVerified] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const hasVerified = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (hasVerified.current) return;

      if (!transactionId) {
        toast.error("No transaction ID found");
        setIsLoading(false);
        return;
      }

      if (!token) {
        toast.error("No authentication token found");
        setIsLoading(false);
        return;
      }

      hasVerified.current = true;

      try {
        const res = await fetch(`${baseUrl}verifypayment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            transaction_id: transactionId,
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          console.log("data", data);

          setIsVerified(true);
          setReceiptData(data.data);
          toast.success("Payment verified successfully!");

          setCartItems([]);
          localStorage.removeItem("cartItems");
        } else if (data.message?.includes("Receipt already exists")) {
          console.log("data", data);

          setIsVerified(true);
          setReceiptData(data.data || null);
          toast.info("Payment already verified. Showing existing receipt.");

          setCartItems([]);
          localStorage.removeItem("cartItems");
        } else {
          toast.error(data?.message || "Payment verification failed.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        toast.error("Network error during payment verification.");
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [transactionId, token]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Loader
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center z-50 bg-white">
        <PulseLoader size={12} color="#000" />
        <p className="mt-2 font-semibold text-lg text-black">
          Verifying Payment...
        </p>
      </div>
    );
  }

  // Verification failed
  if (!isVerified) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
        <p className="text-xl font-bold mb-4 text-red-600">
          Payment verification failed.
        </p>
        <a
          href="/"
          className="px-6 py-3 rounded-xl bg-black text-white hover:bg-white hover:text-black border transition"
        >
          Go Back
        </a>
      </div>
    );
  }

  // Verified
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white text-black px-4">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={30}
      />

      {!isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full border border-gray-200 text-center z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            className="flex justify-center"
          >
            <div className="text-white w-20 h-20 flex items-center justify-center rounded-full shadow-lg mb-6 bg-green-500">
              <FaCheckCircle className="w-10 h-10" />
            </div>
          </motion.div>

          <h1 className="text-3xl font-extrabold mb-2">Payment Successful!</h1>

          <p className="text-gray-600 mb-6 text-lg">
            Your payment has been confirmed. Thank you for shopping with us.
          </p>

          {receiptData && (
            <div className="bg-blue-50 p-5 rounded-2xl text-left mb-6">
              <h3 className="font-bold mb-2">Order Details</h3>
              <p>
                <strong>Order ID:</strong> {receiptData.orderId}
              </p>
              <p>
                <strong>Amount:</strong> ₦{receiptData.amount}
              </p>
              <p>
                <strong>Status:</strong> {receiptData.status}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVisible(true)}
              className="px-6 py-3 rounded-xl border border-black hover:bg-black hover:text-white transition"
            >
              View Receipt
            </motion.button>

            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl bg-black text-white hover:bg-white hover:text-black border transition"
            >
              Continue Shopping
            </motion.a>
          </div>
        </motion.div>
      )}

      {isVisible && (
        <AnimatePresence mode="wait">
          <motion.div
            key="content"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-100 text-black p-8 rounded-lg overflow-x-auto w-[90%] lg:w-[70%]"
          >
            <table>
              <thead>
                <tr>
                  <th className="p-4">S/N</th>
                  <th className="p-4">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">ReceiptId</th>
                  <th className="p-4">Total</th>
                </tr>
              </thead>

              <tbody>
                {receiptData?.receiptItems?.map((item, i) => (
                  <tr key={i}>
                    <td className="p-4">{i + 1}</td>
                    <td className="p-4">
                      <img
                        className="w-12 h-12 bg-center bg-cover"
                        src={item.image}
                        alt=""
                      />
                    </td>
                    <td className="p-4">{item.name}</td>
                    <td className="p-4">{item.price}</td>
                    <td className="p-4">{item.quantity}</td>
                    <td className="p-4">{item.receiptId}</td>
                    <td className="p-4">{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
