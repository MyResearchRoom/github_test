import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { myImg } from "../assets/Images";

const STATUS = {
  VERIFYING: "verifying",
  SUCCESS: "success",
  ERROR: "error",
};

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(STATUS.VERIFYING);
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus(STATUS.ERROR);
        setMessage("Invalid verification link.");
        return;
      }
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/doctors/verify-email/${token}`,
          {}
        );
        setStatus(STATUS.SUCCESS);
        setMessage(response.data.message || "Email verified successfully!");
      } catch (error) {
        setStatus(STATUS.ERROR);
        setMessage(
          error?.response?.data?.error ||
            "This verification link is invalid or has expired."
        );
      }
    };
    verify();
  }, [token]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center flex flex-col items-center gap-4">
        <img src={myImg.login_bg} alt="Clinic" className="w-32 mb-2" />

        {status === STATUS.VERIFYING && (
          <>
            <div className="h-10 w-10 border-4 border-[#521785] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === STATUS.SUCCESS && (
          <>
            <h2 className="text-2xl font-bold text-[#043133]">
              Email Verified!
            </h2>
            <p className="text-gray-600">{message}</p>
            <Link
              to="/"
              className="mt-2 w-full py-3 bg-[#521785] text-white rounded-lg font-semibold text-center hover:opacity-90 transition"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === STATUS.ERROR && (
          <>
            <h2 className="text-2xl font-bold text-red-600">
              Verification Failed
            </h2>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={() => navigate("/")}
              className="mt-2 w-full py-3 bg-[#521785] text-white rounded-lg font-semibold hover:opacity-90 transition"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
