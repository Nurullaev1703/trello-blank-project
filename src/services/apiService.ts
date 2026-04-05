import { tokenStorage } from "./storageService";

const baseUrl =
  import.meta.env.VITE_API_URL || "https://trello-blank-project.onrender.com/api";

// Request configuration
interface RequestOptions {
  url: string;
  dto?: unknown;
  headers?: HeadersInit;
}
// Response shape returned from server
interface RequestResponse<T>{
  statusCode: number;
  message: string
  data: T;
}

// Supported HTTP methods
type RequestMethod = "GET" | "POST" | "UPDATE" | "DELETE" | "PATCH";

class ApiService {
  // Bearer token storage
  bearerToken:Record<string, string> = tokenStorage.hasValue() ? {"Authorization": `Bearer ${tokenStorage.getValue()}`} : {};

  // Determines the full URL for the request
  private _checkNewUrl(url: string) {
    if (url.includes("http://") || url.includes("https://")) {
      return url;
    }
    return baseUrl + url;
  }

  // Decides whether to attach the bearer token
  private _checkBearerNecessity(url: string) {
    if (url.includes("http://") || url.includes("https://")) {
      return null;
    }
    return this.bearerToken;
  }

  // Core request method
  private async _serverRequest<T>(
    options: RequestOptions,
    method: RequestMethod
  ): Promise<RequestResponse<T>> {
    const url = this._checkNewUrl(options.url);
    return fetch(url, {
      method: method,
      body: JSON.stringify(options.dto),
      headers: {
        "Content-Type": "application/json",
        ...this._checkBearerNecessity(options.url),
      },
    }).then(async (response) => {
      const data: RequestResponse<T> = await response.json();

      return data
    });
  }

  // HTTP method helpers
  async get<T>(options: RequestOptions) {
    return this._serverRequest<T>(options, "GET");
  }
  async post<T>(options: RequestOptions) {
    return this._serverRequest<T>(options, "POST");
  }
  async patch<T>(options: RequestOptions) {
    return this._serverRequest<T>(options, "PATCH");
  }
  async delete<T>(options: RequestOptions) {
    return this._serverRequest<T>(options, "DELETE");
  }

  // Stores the bearer token for authenticated requests
  saveBearerToken(token: string) {
    this.bearerToken = { Authorization: `Bearer ${token}` };
  }

  // Clears the stored bearer token
  deleteBearerToken() {
    this.bearerToken = {};
  }
}

export const apiService = new ApiService();




