import type { BusySlot } from "@/lib/api";

/** Há conflito se o intervalo [start, end) cruza algum horário ocupado. */
export const hasConflict = (busy: BusySlot[], start: Date, end: Date): boolean =>
  busy.some(
    (slot) =>
      new Date(slot.startTime) < end && new Date(slot.endTime) > start
  );

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

/** Ex.: "18:00 – 19:00" */
export const formatBusySlot = (slot: BusySlot): string =>
  `${formatTime(slot.startTime)} – ${formatTime(slot.endTime)}`;

/** Início e fim (exclusivo) do dia local de `date`. */
export const dayBounds = (date: Date): { from: Date; to: Date } => {
  const from = new Date(date);
  from.setHours(0, 0, 0, 0);
  const to = new Date(from);
  to.setDate(to.getDate() + 1);
  return { from, to };
};
