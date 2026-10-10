import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandHeader } from '../../components/BrandHeader';
import { BottomNav } from '../../components/BottomNav';
import { PriorityPill } from '../../components/PriorityPill';
import { StatusBadge } from '../../components/StatusBadge';
import { useDemoStore } from '../../store/DemoStore';
import type { Ticket } from '../../types';

type Tab = 'new' | 'assigned' | 'active' | 'completed';

function matchesTab(t: Ticket, tab: Tab, techId: string): boolean {
  if (tab === 'new') {
    return (
      (t.status === 'submitted' || t.status === 'team_assigned') &&
      (!t.assignedTechnicianId || t.assignedTechnicianId === techId)
    );
  }
  if (tab === 'assigned') {
    return (
      t.assignedTechnicianId === techId &&
      (t.status === 'team_assigned' || t.status === 'accepted')
    );
  }
  if (tab === 'active') {
    return (
      t.assignedTechnicianId === techId &&
      (t.status === 'on_the_way' || t.status === 'work_started')
    );
  }
  return (
    t.assignedTechnicianId === techId &&
    (t.status === 'repair_completed' || t.status === 'closed')
  );
}

export function TechDashboard() {
  const { currentUser, ticketsForTechnician, getVehicle } = useDemoStore();
  const [tab, setTab] = useState<Tab>('new');
  const all = ticketsForTechnician(currentUser!);

  const filtered = useMemo(
    () => all.filter((t) => matchesTab(t, tab, currentUser!.id)),
    [all, tab, currentUser],
  );

  const counts: Record<Tab, number> = {
    new: all.filter((t) => matchesTab(t, 'new', currentUser!.id)).length,
    assigned: all.filter((t) => matchesTab(t, 'assigned', currentUser!.id))
      .length,
    active: all.filter((t) => matchesTab(t, 'active', currentUser!.id)).length,
    completed: all.filter((t) => matchesTab(t, 'completed', currentUser!.id))
      .length,
  };

  return (
    <div className="mobile-frame">
      <BrandHeader
        title="Technician Dashboard"
        subtitle={`${currentUser!.name} · ${currentUser!.department}`}
      />
      <div className="page-pad stack" style={{ flex: 1 }}>
        <div className="tabs">
          {(
            [
              ['new', 'New'],
              ['assigned', 'Assigned'],
              ['active', 'Active'],
              ['completed', 'Completed'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={tab === id ? 'active' : ''}
              onClick={() => setTab(id)}
            >
              {label} ({counts[id]})
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="muted">No jobs in this list.</p>
        )}

        {filtered.map((t) => {
          const vehicle = getVehicle(t.vehicleId);
          return (
            <Link
              key={t.id}
              to={`/tech/tickets/${t.id}`}
              className="ticket-list-item"
            >
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <strong>{t.id}</strong>
                <PriorityPill priority={t.priority} />
              </div>
              <div style={{ marginTop: 6 }}>
                {vehicle?.registrationNumber} · {t.issue}
              </div>
              <div style={{ marginTop: 8 }}>
                <StatusBadge status={t.status} />
              </div>
            </Link>
          );
        })}
      </div>
      <BottomNav variant="tech" />
    </div>
  );
}

export function TechProfile() {
  const { currentUser } = useDemoStore();
  return (
    <div className="mobile-frame">
      <BrandHeader title="Profile" backTo="/tech" />
      <div className="page-pad stack" style={{ flex: 1 }}>
        <div className="card" style={{ padding: 16 }}>
          <h2 className="h2">{currentUser!.name}</h2>
          <div className="summary-list" style={{ marginTop: 12 }}>
            <div>
              <span className="muted">Employee ID</span>
              <strong>{currentUser!.employeeId}</strong>
            </div>
            <div>
              <span className="muted">Department</span>
              <strong style={{ textTransform: 'capitalize' }}>
                {currentUser!.department}
              </strong>
            </div>
            <div>
              <span className="muted">Phone</span>
              <strong>{currentUser!.phone}</strong>
            </div>
          </div>
        </div>
      </div>
      <BottomNav variant="tech" />
    </div>
  );
}
