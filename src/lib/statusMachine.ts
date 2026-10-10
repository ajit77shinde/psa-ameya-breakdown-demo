import type { TicketStatus } from '../types';

export const STATUS_ORDER: TicketStatus[] = [
  'submitted',
  'team_assigned',
  'accepted',
  'on_the_way',
  'work_started',
  'repair_completed',
  'closed',
];

export const STATUS_LABELS: Record<TicketStatus, string> = {
  submitted: 'Submitted',
  team_assigned: 'Team Assigned',
  accepted: 'Technician Accepted',
  on_the_way: 'On The Way',
  work_started: 'Work Started',
  repair_completed: 'Repair Completed',
  closed: 'Closed',
};

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
    on_the_way: 'Start Travel',
    work_started: 'Start Work',
    repair_completed: 'Complete Repair',
    closed: 'Close Ticket',
  };
  return labels[n] ?? `Mark as ${STATUS_LABELS[n]}`;
}
