import axios from "axios";

const api = axios.create({
  baseURL: "https://local-harvest-2.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach the latest token to every request
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token"); // Use correct key

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 errors and refresh the token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          console.error("No refresh token. Logging out...");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const response = await api.post("/api/token/refresh/",
          { refresh: refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        localStorage.setItem("access_token", response.data.access);

        api.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

        return api(originalRequest);
      } catch (err) {
        console.error("Token refresh failed. Logging out...", err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
