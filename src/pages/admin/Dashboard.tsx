import { DEPARTMENTS } from '../../data/catalog';
import { STATUS_LABELS } from '../../lib/statusMachine';
import { useDemoStore } from '../../store/DemoStore';
import type { Priority, TicketStatus } from '../../types';

export function AdminDashboard() {
  const { state } = useDemoStore();
  const tickets = state.tickets;

  const byPriority = (p: Priority) =>
    tickets.filter((t) => t.priority === p).length;
  const byStatus = (s: TicketStatus) =>
    tickets.filter((t) => t.status === s).length;
  const open = tickets.filter((t) => t.status !== 'closed').length;

  return (
    <div className="stack">
      <div>
        <h1 className="h1">Today&apos;s Overview</h1>
        <p className="muted" style={{ marginTop: 6 }}>
          Live demo metrics from mock breakdown data.
        </p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <strong>{tickets.length}</strong>
          <span>Total Breakdowns</span>
        </div>
        <div className="stat-card">
          <strong style={{ color: 'var(--danger)' }}>
            {byPriority('emergency')}
          </strong>
          <span>Emergency</span>
        </div>
        <div className="stat-card">
          <strong style={{ color: 'var(--warning)' }}>
            {byPriority('high')}
          </strong>
          <span>High</span>
        </div>
        <div className="stat-card">
          <strong style={{ color: '#f9a825' }}>{byPriority('normal')}</strong>
          <span>Normal</span>
        </div>
        <div className="stat-card">
          <strong>{open}</strong>
          <span>Open Jobs</span>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card" style={{ padding: 16 }}>
          <h2 className="h2">Current Status</h2>
          <div className="summary-list" style={{ marginTop: 12 }}>
            {(
              [
                'submitted',
                'team_assigned',
                'accepted',
                'on_the_way',
                'work_started',
                'repair_completed',
                'closed',
              ] as TicketStatus[]
            ).map((s) => (
              <div key={s}>
                <span className="muted">{STATUS_LABELS[s]}</span>
                <strong>{byStatus(s)}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <h2 className="h2">By Department</h2>
          <div className="summary-list" style={{ marginTop: 12 }}>
            {DEPARTMENTS.map((d) => (
              <div key={d.id}>
                <span className="muted">
                  {d.icon} {d.label}
                </span>
                <strong>
                  {tickets.filter((t) => t.department === d.id).length}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
