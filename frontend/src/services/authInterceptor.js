import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Configure default axios settings
axios.defaults.withCredentials = true;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. Axios Request Interceptor
axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Axios Response Interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if response is 401 Unauthorized and request has not already been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      const url = originalRequest.url || "";
      
      // Avoid refreshing for auth-related endpoints to prevent infinite loops
      if (
        url.includes("/api/auth/refresh") ||
        url.includes("/api/auth/login") ||
        url.includes("/api/auth/register")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(`${API_URL}/api/auth/refresh`, {}, { withCredentials: true });
        const { token, user } = res.data;

        sessionStorage.setItem("token", token);
        if (user) {
          sessionStorage.setItem("user", JSON.stringify(user));
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        originalRequest.headers["Authorization"] = `Bearer ${token}`;

        processQueue(null, token);
        isRefreshing = false;

        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Clear session and redirect to login
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// 3. Global Window Fetch Wrapper
const originalFetch = window.fetch;
window.fetch = async function (input, init) {
  let url = "";
  if (typeof input === "string") {
    url = input;
  } else if (input instanceof URL) {
    url = input.href;
  } else if (input && typeof input === "object" && input.url) {
    url = input.url;
  }

  init = init || {};
  init.headers = init.headers || {};

  let headersObj = init.headers;
  const isHeadersInstance = headersObj instanceof Headers;

  const setHeader = (name, value) => {
    if (isHeadersInstance) {
      headersObj.set(name, value);
    } else if (Array.isArray(headersObj)) {
      headersObj.push([name, value]);
    } else {
      headersObj[name] = value;
    }
  };

  const getHeader = (name) => {
    if (isHeadersInstance) {
      return headersObj.get(name);
    } else if (Array.isArray(headersObj)) {
      const found = headersObj.find(([k]) => k.toLowerCase() === name.toLowerCase());
      return found ? found[1] : undefined;
    } else {
      const key = Object.keys(headersObj).find((k) => k.toLowerCase() === name.toLowerCase());
      return key ? headersObj[key] : undefined;
    }
  };

  // Only apply custom headers / credentials to our API endpoints
  if (url.includes("/api/")) {
    init.credentials = init.credentials || "include";

    const token = sessionStorage.getItem("token");
    if (token && !getHeader("Authorization")) {
      setHeader("Authorization", `Bearer ${token}`);
    }
  }

  try {
    const response = await originalFetch(input, init);

    if (
      response.status === 401 &&
      !url.includes("/api/auth/refresh") &&
      !url.includes("/api/auth/login") &&
      !url.includes("/api/auth/register")
    ) {
      if (init._retry) {
        return response;
      }
      init._retry = true;

      if (isRefreshing) {
        try {
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          setHeader("Authorization", `Bearer ${token}`);
          return originalFetch(input, init);
        } catch (err) {
          return response;
        }
      }

      isRefreshing = true;

      try {
        const refreshResponse = await originalFetch(`${API_URL}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!refreshResponse.ok) {
          throw new Error("Refresh failed");
        }

        const data = await refreshResponse.json();
        const token = data.token;
        const user = data.user;

        sessionStorage.setItem("token", token);
        if (user) {
          sessionStorage.setItem("user", JSON.stringify(user));
        }

        setHeader("Authorization", `Bearer ${token}`);

        processQueue(null, token);
        isRefreshing = false;

        return originalFetch(input, init);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;

        // Clear session and redirect to login
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        window.location.href = "/login";
        return response;
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
};
