import { useMemo, useState } from 'react';
import { PriorityPill } from '../../components/PriorityPill';
import { StatusBadge } from '../../components/StatusBadge';
import { DEPARTMENTS } from '../../data/catalog';
import { STATUS_LABELS, STATUS_ORDER } from '../../lib/statusMachine';
import { useDemoStore } from '../../store/DemoStore';
import type { Department } from '../../types';

export function AdminBreakdowns() {
  const { state, getVehicle, getUser, assignTechnician } = useDemoStore();
  const [dept, setDept] = useState<Department | 'all'>('all');
  const [status, setStatus] = useState('all');

  const techs = state.users.filter((u) => u.role === 'technician');

  const tickets = useMemo(() => {
    return state.tickets
      .filter((t) => (dept === 'all' ? true : t.department === dept))
      .filter((t) => (status === 'all' ? true : t.status === status))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [state.tickets, dept, status]);

  return (
    <div className="stack">
      <div>
        <h1 className="h1">Breakdowns</h1>
        <p className="muted" style={{ marginTop: 6 }}>
          Filter, assign, and reassign technicians.
        </p>
      </div>

      <div className="row" style={{ flexWrap: 'wrap' }}>
        <div className="field" style={{ minWidth: 180 }}>
          <label htmlFor="dept">Department</label>
          <select
            id="dept"
            value={dept}
            onChange={(e) => setDept(e.target.value as Department | 'all')}
          >
            <option value="all">All</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field" style={{ minWidth: 180 }}>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All</option>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Vehicle</th>
              <th>Issue</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assign Technician</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => {
              const vehicle = getVehicle(t.vehicleId);
              const deptTechs = techs.filter(
                (u) => u.department === t.department,
              );
              return (
                <tr key={t.id}>
                  <td>
                    <strong>{t.id}</strong>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {getUser(t.driverId)?.name}
                    </div>
                  </td>
                  <td>{vehicle?.registrationNumber}</td>
                  <td>
                    {t.issue}
                    <div className="muted" style={{ fontSize: 12 }}>
                      {t.department}
                    </div>
                  </td>
                  <td>
                    <PriorityPill priority={t.priority} />
                  </td>
                  <td>
                    <StatusBadge status={t.status} />
                  </td>
                  <td>
                    <select
                      value={t.assignedTechnicianId ?? ''}
                      onChange={(e) => {
                        if (!e.target.value) return;
                        assignTechnician(t.id, e.target.value);
                      }}
                    >
                      <option value="">Unassigned</option>
                      {deptTechs.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
