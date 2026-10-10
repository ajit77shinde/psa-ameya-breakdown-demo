import { Link } from 'react-router-dom';
import { BrandHeader } from '../../components/BrandHeader';
import { BottomNav } from '../../components/BottomNav';
import { StatusBadge } from '../../components/StatusBadge';
import { getDepartmentMeta } from '../../data/catalog';
import { useDemoStore } from '../../store/DemoStore';

export function DriverHistory() {
  const { currentUser, ticketsForDriver, getVehicle } = useDemoStore();
  const tickets = ticketsForDriver(currentUser!.id);
  const byDept = tickets.reduce<Record<string, number>>((acc, t) => {
    acc[t.department] = (acc[t.department] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mobile-frame">
      <BrandHeader title="Breakdown History" backTo="/driver" />
      <div className="page-pad stack" style={{ flex: 1 }}>
        <div className="card" style={{ padding: 16 }}>
          <h2 className="h2">Your breakdowns</h2>
          <p style={{ margin: '8px 0 0', fontSize: '1.4rem', fontWeight: 750 }}>
            Total: {tickets.length}
          </p>
          <div className="muted" style={{ marginTop: 8, fontSize: 13 }}>
            {Object.entries(byDept).map(([d, n]) => (
              <div key={d}>
                {getDepartmentMeta(d as never).label}: {n}
              </div>
            ))}
          </div>
        </div>

        {tickets.map((t) => {
          const vehicle = getVehicle(t.vehicleId);
          return (
            <Link
              key={t.id}
              to={`/driver/complaints/${t.id}`}
              className="ticket-list-item"
            >
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <strong>
                  {new Date(t.createdAt).toLocaleDateString(undefined, {
                    day: '2-digit',
                    month: 'short',
                  })}{' '}
                  – {t.issue}
                </strong>
                <StatusBadge status={t.status} />
              </div>
              <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                {vehicle?.registrationNumber}
              </div>
            </Link>
          );
        })}
      </div>
      <BottomNav variant="driver" />
    </div>
  );
}
