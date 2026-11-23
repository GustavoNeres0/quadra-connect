import { api } from "./client";
import type { Unit, UnitAvailability } from "./types";

export const unitsApi = {
  list: () => api.get<Unit[]>("/units"),
  get: (id: string) => api.get<Unit>(`/units/${id}`),
  /** Horários já ocupados da unidade no período (ISO 8601). */
  availability: (id: string, from: Date, to: Date) =>
    api.get<UnitAvailability>(`/units/${id}/availability`, {
      query: { from: from.toISOString(), to: to.toISOString() },
    }),
};
