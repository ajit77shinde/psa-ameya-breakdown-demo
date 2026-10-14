import { normalizeTicketStatus, STATUS_LABELS } from '../lib/statusMachine';
import type { TicketStatus } from '../types';

const COLORS: Record<TicketStatus, { bg: string; fg: string }> = {
  submitted: { bg: '#e3f2fd', fg: '#1565c0' },
  team_assigned: { bg: '#e8eaf6', fg: '#3949ab' },
  accepted: { bg: '#fff3e0', fg: '#ef6c00' },
  work_started: { bg: '#f3e5f5', fg: '#6a1b9a' },
  repair_completed: { bg: '#e8f5e9', fg: '#2e7d32' },
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  const normalized = normalizeTicketStatus(status);
  const c = COLORS[normalized];
  return (
    <span className="badge" style={{ background: c.bg, color: c.fg }}>
      {STATUS_LABELS[normalized]}
    </span>
  );
}
