import { api } from "./client";
import type { AuthUser, CustomerProfile } from "./types";

export const profileApi = {
  me: () => api.get<AuthUser>("/users/me/profile"),
  customer: () => api.get<CustomerProfile>("/customers/me"),
};