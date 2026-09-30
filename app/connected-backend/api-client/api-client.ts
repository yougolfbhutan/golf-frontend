import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ADMIN_URL,
  withCredentials: true, // sends httpOnly cookies automatically — this is your auth now
});

// Request interceptor — just handles Content-Type, no manual token attaching needed
// (accessToken cookie is httpOnly, browser sends it automatically)
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
let isRefreshing = false;
let queue: { resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }[] = [];

function processQueue(error: unknown) {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  queue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // a refresh is already in progress — wait for it, then retry
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      isRefreshing = true;

      try {
        // this hits your /refresh route — cookie goes automatically,
        // server sets new accessToken + refreshToken cookies in response
        await axios.post(
          `${process.env.NEXT_PUBLIC_CUSTOMER_URL}/auth/refreshToken`,
          {},
          { withCredentials: true }
        );

        processQueue(null);
        return apiClient(originalRequest); // retry the original failed request
      } catch (refreshError) {
        console.log("🔒 Refresh failed - redirecting to login",refreshError);
        processQueue(refreshError);
        console.log("🔒 Refresh failed - redirecting to login");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;