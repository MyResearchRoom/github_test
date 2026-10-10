import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);

  const verifyEmail = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/doctors/verify-email/${token}`,
        {}
      );
      if (response.status === 200) {
        setLoading(false);
        toast.success("Email verified successfully");
      }
    } catch (error) {
      setLoading(null);
      toast.error(error.response?.data?.error || "Failed to verify your email");
    }
  };

  useEffect(() => {
    verifyEmail();
  },[]);

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="bg-white shadow-md rounded-md">
        <div className="px-4 py-8">
          {loading ? (
            <div className="text-center text-lg font-bold">
              Wait..., We are verifying your email...
            </div>
          ) : (
            <>
              {loading === null ? (
                <h1 className="text-2xl font-bold text-red-300">
                  Failed to verify your email
                </h1>
              ) : (
                <h1 className="text-2xl font-bold text-green-300">
                  Your email verify successfully !!
                </h1>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
