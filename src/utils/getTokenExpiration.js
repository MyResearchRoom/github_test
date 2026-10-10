import { jwtDecode } from "jwt-decode";

const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

export const getTokenExpiration = (token) => {
  const decoded = decodeToken(token);
  return decoded ? decoded.exp * 1000 : null; // `exp` is in seconds, so multiply by 1000 to get milliseconds
};
