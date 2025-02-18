import { config } from "../config";

export const httpClient = {
  get: async (path, token, isResponseBody = true) => {
    const response = await fetch(
      `https://proxter.onrender.com${path}?proxter=${config.apiBaseUrl}`,
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
      `https://proxter.onrender.com${path}?proxter=${config.apiBaseUrl}`,
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
      `https://proxter.onrender.com${path}?proxter=${config.apiBaseUrl}`,
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
};
