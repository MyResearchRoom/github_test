import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Adjust according to your routing setup
import { getTokenExpiration } from "../utils/getTokenExpiration";

const useAutoLogout = (token) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    const expirationTime = getTokenExpiration(token);
    const currentTime = Date.now();
    const timeUntilLogout = expirationTime - currentTime;

    
    // If the token is already expired, logout immediately
    if (timeUntilLogout <= 0) {
      handleLogout();
    } else {
      const timeoutId = setTimeout(() => {
        handleLogout();
      }, timeUntilLogout);

      return () => clearTimeout(timeoutId); // Cleanup on unmount or token change
    }
  }, [token]);

  const handleLogout = () => {
    // Clear user data from local storage/session storage and any state
    localStorage.removeItem("token"); // Or wherever you store the token
    localStorage.removeItem("role");
    navigate("/"); // Redirect to login page
  };
};

export default useAutoLogout;
