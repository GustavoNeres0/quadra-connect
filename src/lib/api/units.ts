import { api } from "./client";
import type { Unit } from "./types";

export const unitsApi = {
  list: () => api.get<Unit[]>("/units"),
  get: (id: string) => api.get<Unit>(`/units/${id}`),
};