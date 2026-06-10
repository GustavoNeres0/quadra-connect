import { api, setToken } from "./client";
import type { AuthResponse, AuthUser } from "./types";
import { ProfileType } from "./types";

export interface RegisterPayload {
  email: string;
  password: string;
  profileType: ProfileType.CUSTOMER; // app de cliente final só registra CUSTOMER
  customer: {
    name: string;
    cpf: string;
    phone?: string;
  };
}

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await api.post<AuthResponse>("/auth/login", { email, password }, { auth: false });
    setToken(res.accessToken);
    return res;
  },

  register: async (payload: RegisterPayload) => {
    const res = await api.post<AuthResponse>("/auth/register", payload, { auth: false });
    if (res?.accessToken) setToken(res.accessToken);
    return res;
  },

  logout: () => {
    setToken(null);
  },

  me: () => api.get<AuthUser>("/auth/me"),
};