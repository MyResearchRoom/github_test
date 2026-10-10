import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-full  bg-gray-50 px-6">
      <h1 className="text-9xl font-bold text-purple-700">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">Page Not Found</h2>
      <p className="mt-2 text-gray-600 text-center max-w-md">
        Oops! The page you are looking for doesn’t exist or has been moved.
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-6 flex items-center gap-2 px-5 py-2 bg-purple-700 text-white rounded-lg shadow hover:bg-purple-800 transition"
      >
        <Home size={18} /> Back to Home
      </button>
    </div>
  );
}
