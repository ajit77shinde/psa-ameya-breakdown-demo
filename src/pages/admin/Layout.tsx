import { NavLink, Outlet } from 'react-router-dom';
import { useDemoStore } from '../../store/DemoStore';

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/breakdowns', label: 'Breakdowns' },
  { to: '/admin/vehicles', label: 'Vehicles' },
  { to: '/admin/people', label: 'People' },
  { to: '/admin/departments', label: 'Departments' },
];

export function AdminLayout() {
  const { currentUser } = useDemoStore();

  return (
    <div className="desktop-shell">
      <header
        className="card"
        style={{
          padding: '18px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(120deg, #0b2a4a, #1565c0)',
          color: '#fff',
          border: 'none',
        }}
      >
        <div className="brand-mark">
          <span className="brand-mark__badge">PSA</span>
          <div>
            <strong>AMEYA CFS · Fleet Control</strong>
            <small>Supervisor / Admin Dashboard</small>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <strong>{currentUser?.name}</strong>
          <div style={{ opacity: 0.85, fontSize: 13 }}>
            {currentUser?.employeeId}
          </div>
        </div>
      </header>

      <nav className="admin-nav">
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end}>
            {l.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}
