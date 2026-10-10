export function formatTicketId(year: number, seq: number): string {
  return `BRK-${year}-${String(seq).padStart(6, '0')}`;
}

export function nextTicketId(seq: number, date = new Date()): string {
  return formatTicketId(date.getFullYear(), seq);
}
