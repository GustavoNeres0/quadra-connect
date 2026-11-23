import { dayBounds, formatBusySlot, hasConflict } from '@/lib/availability';

const slot = (start: string, end: string) => ({
  startTime: start,
  endTime: end,
  status: 'CONFIRMED',
});

describe('hasConflict', () => {
  const busy = [slot('2026-12-01T18:00:00.000Z', '2026-12-01T19:00:00.000Z')];

  it('detecta sobreposição parcial no início', () => {
    expect(
      hasConflict(busy, new Date('2026-12-01T17:30:00.000Z'), new Date('2026-12-01T18:30:00.000Z'))
    ).toBe(true);
  });

  it('detecta sobreposição parcial no fim', () => {
    expect(
      hasConflict(busy, new Date('2026-12-01T18:30:00.000Z'), new Date('2026-12-01T19:30:00.000Z'))
    ).toBe(true);
  });

  it('detecta reserva que contém o horário ocupado', () => {
    expect(
      hasConflict(busy, new Date('2026-12-01T17:00:00.000Z'), new Date('2026-12-01T20:00:00.000Z'))
    ).toBe(true);
  });

  it('permite reservar logo antes ou logo depois (horários adjacentes)', () => {
    expect(
      hasConflict(busy, new Date('2026-12-01T17:00:00.000Z'), new Date('2026-12-01T18:00:00.000Z'))
    ).toBe(false);
    expect(
      hasConflict(busy, new Date('2026-12-01T19:00:00.000Z'), new Date('2026-12-01T20:00:00.000Z'))
    ).toBe(false);
  });

  it('não há conflito quando nada está ocupado', () => {
    expect(
      hasConflict([], new Date('2026-12-01T18:00:00.000Z'), new Date('2026-12-01T19:00:00.000Z'))
    ).toBe(false);
  });
});

describe('dayBounds', () => {
  it('retorna o início do dia e o início do dia seguinte (24h)', () => {
    const { from, to } = dayBounds(new Date(2026, 11, 1, 15, 45));
    expect(from.getHours()).toBe(0);
    expect(from.getMinutes()).toBe(0);
    expect(to.getDate()).toBe(2);
    expect(to.getTime() - from.getTime()).toBe(24 * 60 * 60 * 1000);
  });
});

describe('formatBusySlot', () => {
  it('formata o intervalo como HH:MM – HH:MM', () => {
    const text = formatBusySlot(slot('2026-12-01T18:00:00.000Z', '2026-12-01T19:30:00.000Z'));
    expect(text).toMatch(/^\d{2}:\d{2} – \d{2}:\d{2}$/);
  });
});
