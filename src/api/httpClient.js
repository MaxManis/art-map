import { config } from "../config";

const PROXIE_URL = "https://proxter.onrender.com"; //"http://localhost:3005"

export const httpClient = {
  get: async (path, token, isResponseBody = true) => {
    const response = await fetch(
      `${PROXIE_URL}${path}?proxter=${config.apiBaseUrl}`,
      {
        method: "GET",
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
      },
    );
    if (response.status >= 400) {
      throw new Error(response.status);
    }

    if (isResponseBody) {
      const res = await response.json();
      return res;
    }
  },
  post: async (path, token, body, isResponseBody = true) => {
    const response = await fetch(
      `${PROXIE_URL}${path}?proxter=${config.apiBaseUrl}`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
      },
    );
    if (response.status >= 400) {
      throw new Error(response.status);
    }

    if (isResponseBody) {
      const res = await response.json();
      return res;
    }
  },
  delete: async (path, token, isResponseBody = true) => {
    const response = await fetch(
      `${PROXIE_URL}${path}?proxter=${config.apiBaseUrl}`,
      {
        method: "DELETE",
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
      },
    );
    if (response.status >= 400) {
      throw new Error(response.status);
    }

    if (isResponseBody) {
      const res = await response.json();
      return res;
    }
  },
  put: async (path, token, body, isResponseBody = true) => {
    const response = await fetch(
      `${PROXIE_URL}${path}?proxter=${config.apiBaseUrl}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
      },
    );
    if (response.status >= 400) {
      throw new Error(response.status);
    }

    if (isResponseBody) {
      const res = await response.json();
      return res;
    }
  },
};
