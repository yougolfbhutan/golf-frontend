import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ADMIN_URL,
  withCredentials: true, // sends httpOnly cookies automatically — this is your auth now
});


apiClient.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── refresh queueing so multiple simultaneous 401s don't trigger multiple refreshes ──


apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

    
    }

    return Promise.reject(error);
  }
);

export default apiClient;