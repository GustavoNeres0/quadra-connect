import { getToken } from "@/lib/api";

export const useAuth = () => {
  const isAuthenticated = !!getToken();
  return { isAuthenticated };
};