/**
 * Cliente HTTP central para comunicação com a quadra_connect_api.
 * Token JWT é persistido em localStorage ("auth_token") e enviado
 * automaticamente no header Authorization.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const TOKEN_KEY = "auth_token";

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token: string | null) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
};

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type Options = Omit<RequestInit, "body"> & {
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  auth?: boolean; // default true
};

const buildUrl = (path: string, query?: Options["query"]) => {
  const url = new URL(`${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
};

export async function apiRequest<T = unknown>(path: string, options: Options = {}): Promise<T> {
  const { body, query, auth = true, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      ...rest,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new ApiError(
      "Não foi possível conectar à API. Verifique se o backend está rodando e a VITE_API_BASE_URL.",
      0,
      err
    );
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null);

  if (!response.ok) {
    const message =
      (isJson && data && typeof data === "object" && (data as any).message) ||
      `Erro ${response.status}: ${response.statusText}`;
    throw new ApiError(Array.isArray(message) ? message.join(", ") : message, response.status, data);
  }

  return data as T;
}

export const api = {
  get: <T = unknown>(path: string, opts?: Options) => apiRequest<T>(path, { ...opts, method: "GET" }),
  post: <T = unknown>(path: string, body?: unknown, opts?: Options) =>
    apiRequest<T>(path, { ...opts, method: "POST", body }),
  patch: <T = unknown>(path: string, body?: unknown, opts?: Options) =>
    apiRequest<T>(path, { ...opts, method: "PATCH", body }),
};