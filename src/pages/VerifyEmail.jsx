import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading | success | failed

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        toast.error("No verification token found.");
        setStatus("failed");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/users/verifyemail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          toast.success(data.message);
          setStatus("success");
        } else {
          toast.error(data.message || "Email verification failed.");
          setStatus("failed");
        }
      } catch (err) {
        console.error(err);
        toast.error("Network error during email verification.");
        setStatus("failed");
      }
    };

    verifyEmail();
  }, [token]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <PulseLoader size={12} color="#000" />
        <p>Verifying your email...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-red-600 text-xl font-bold mb-4">
          Email verification failed
        </h2>
        <a href="/" className="px-4 py-2 bg-black text-white rounded">
          Go Back
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-green-600 text-xl font-bold mb-4">
        Email verified successfully!
      </h2>
      <a href="/" className="px-4 py-2 bg-black text-white rounded">
        Continue
      </a>
    </div>
  );
}
