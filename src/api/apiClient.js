// import axios from "axios";

// const apiClient = axios.create({
//   baseURL: process.env.REACT_APP_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error?.response?.status;
//     const message =
//       error?.response?.data?.error || error?.response?.data?.message || "";
//     const isExpiredToken =
//       status === 401 || (status === 400 && message.toLowerCase().includes("expired token"));

//     if (isExpiredToken && localStorage.getItem("token")) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("role");
//       localStorage.removeItem("tempToken");

//       if (window.location.pathname !== "/") {
//         window.location.replace("/");
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default apiClient;

import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Important:
    // Let Axios/browser set Content-Type and boundary for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      "";

    const isExpiredToken =
      status === 401 ||
      (status === 400 &&
        message.toLowerCase().includes("expired token"));

    if (isExpiredToken && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("tempToken");

      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
