import axios from "axios";

let guardsInstalled = false;

const SESSION_EXPIRED_EVENT = "conlara:session-expired";

const decodeJwt = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const json = decodeURIComponent(
      Array.from(atob(padded), (character) =>
        `%${character.charCodeAt(0).toString(16).padStart(2, "0")}`
      ).join("")
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const getTokenExpiration = (token) => {
  if (!token) return null;

  const payload = decodeJwt(token);
  return typeof payload?.exp === "number" ? payload.exp * 1000 : null;
};

export const clearExpiredSession = ({ redirect = true } = {}) => {
  const hadToken = Boolean(localStorage.getItem("token"));
  if (!hadToken) return;

  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));

  if (redirect && window.location.pathname !== "/login") {
    window.location.replace("/login?session=expired");
  }
};

export const isSessionExpired = (token = localStorage.getItem("token")) =>
  Boolean(token && getTokenExpiration(token) <= Date.now());

export const installSessionGuards = () => {
  if (guardsInstalled) return;
  guardsInstalled = true;

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        clearExpiredSession();
      }
      return Promise.reject(error);
    }
  );

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    if (response.status === 401) {
      clearExpiredSession();
    }
    return response;
  };
};
