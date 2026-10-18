
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"
).replace(/\/$/, "");

export function getToken() {
  return localStorage.getItem("accessToken");
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      `Cannot connect to ${API_BASE_URL}. Make sure Spring Boot is running and CORS allows http://localhost:5174.`
    );
  }

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    if (data && typeof data === "object") {
      message =
        data.message ||
        data.error ||
        Object.values(data).find(
          (value) => typeof value === "string"
        ) ||
        message;
    } else if (typeof data === "string" && data.trim()) {
      message = data;
    }

    if (response.status === 401 && path === "/auth/login") {
      message = "Invalid email or password.";
    }

    throw new Error(message);
  }

  return data;
}

export const login = (credentials) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const register = (details) =>
  apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(details),
  });

export async function getApplications() {
  const data = await apiRequest("/applications");

  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;

  throw new Error(
    "The applications endpoint returned an unexpected format."
  );
}

export const createApplication = (application) =>
  apiRequest("/applications", {
    method: "POST",
    body: JSON.stringify(application),
  });

export const updateApplication = (id, application) =>
  apiRequest(`/applications/${id}`, {
    method: "PUT",
    body: JSON.stringify(application),
  });

export const deleteApplication = (id) =>
  apiRequest(`/applications/${id}`, {
    method: "DELETE",
  });
