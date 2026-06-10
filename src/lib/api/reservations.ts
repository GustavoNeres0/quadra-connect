import { api } from "./client";
import { ReservationStatus, type Reservation } from "./types";

export interface CreateReservationPayload {
  unitId: string;
  startTime: string; // ISO datetime, ex: "2026-06-20T14:00:00.000Z"
  endTime: string;   // ISO datetime
  isSplit?: boolean;
  totalPrice?: number;
  bailPaid?: boolean;
}

export const reservationsApi = {
  listMine: () => api.get<Reservation[]>("/reservations/mine"),

  create: (payload: CreateReservationPayload) =>
    api.post<Reservation>("/reservations", payload),

  cancel: (id: string) =>
    api.patch<Reservation>(`/reservations/${id}`, { status: ReservationStatus.CANCELLED }),
};