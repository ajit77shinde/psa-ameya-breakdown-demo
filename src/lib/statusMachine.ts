import type { TicketStatus } from '../types';

export const STATUS_ORDER: TicketStatus[] = [
  'submitted',
  'team_assigned',
  'accepted',
  'work_started',
  'repair_completed',
];

export const STATUS_LABELS: Record<TicketStatus, string> = {
  submitted: 'Submitted',
  team_assigned: 'Team Assigned',
  accepted: 'Technician Accepted',
  work_started: 'Work Started',
  repair_completed: 'Repair Completed',
};

const LEGACY_STATUS: Record<string, TicketStatus> = {
  on_the_way: 'accepted',
  closed: 'repair_completed',
};

export function normalizeTicketStatus(status: string): TicketStatus {
  if (STATUS_ORDER.includes(status as TicketStatus)) return status as TicketStatus;
  return LEGACY_STATUS[status] ?? 'submitted';
}

export function isTicketClosed(status: TicketStatus): boolean {
  return status === 'repair_completed';
}

export function nextStatus(current: TicketStatus): TicketStatus | null {
  const idx = STATUS_ORDER.indexOf(current);
  if (idx < 0 || idx >= STATUS_ORDER.length - 1) return null;
  return STATUS_ORDER[idx + 1];
}

export function canAdvance(current: TicketStatus): boolean {
  return nextStatus(current) !== null;
}

export function statusActionLabel(current: TicketStatus): string | null {
  const n = nextStatus(current);
  if (!n) return null;
  const labels: Partial<Record<TicketStatus, string>> = {
    team_assigned: 'Assign to Me',
    accepted: 'Accept Job',
    work_started: 'Start Work',
    repair_completed: 'Complete Repair',
  };
  return labels[n] ?? `Mark as ${STATUS_LABELS[n]}`;
}
