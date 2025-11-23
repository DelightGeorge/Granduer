import React from "react";

const PaymentSuccess = ({ txRef, transactionId }) => {
  const handleDownloadReceipt = async () => {
    const id = txRef || transactionId;

    if (!id) {
      alert("No transaction reference found.");
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
      a.download = `receipt-${id}.txt`; // you can change to .pdf if backend sends pdf
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Could not download receipt");
    }
  };

  return (
    <div className="payment-success">
      <h2>Payment Successful ✅</h2>

      <button onClick={handleDownloadReceipt} className="download-btn">
        Download Receipt
      </button>
    </div>
  );
};

export default PaymentSuccess;
