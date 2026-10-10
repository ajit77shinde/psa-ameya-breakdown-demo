import { Link } from 'react-router-dom';
import { BrandHeader } from '../../components/BrandHeader';
import { BottomNav } from '../../components/BottomNav';
import { useDemoStore } from '../../store/DemoStore';

export function DriverHome() {
  const { currentUser, vehiclesForDriver, ticketsForDriver } = useDemoStore();
  const vehicles = vehiclesForDriver(currentUser!.id);
  const primary = vehicles[0];
  const openCount = ticketsForDriver(currentUser!.id).filter(
    (t) => t.status !== 'closed',
  ).length;

  return (
    <div className="mobile-frame">
      <BrandHeader />
      <div className="hero-truck">
        <div className="hero-truck__caption">
          <h2>Truck Breakdown Report App</h2>
          <p>Select Department to Report Vehicle Issue.</p>
        </div>
      </div>
      <div className="page-pad stack" style={{ flex: 1 }}>
        <div>
          <p className="muted" style={{ margin: 0 }}>
            Welcome, Driver
          </p>
          <h1 className="h1" style={{ marginTop: 4 }}>
            {currentUser!.name}
          </h1>
          {primary && (
            <p style={{ margin: '8px 0 0' }}>
              Vehicle: <strong>{primary.registrationNumber}</strong>
              <br />
              <span
                className={`vehicle-status ${
                  primary.status === 'breakdown' ? 'breakdown' : ''
                }`}
              >
                {primary.status === 'active'
                  ? '🟢 Vehicle Active'
                  : '🔴 Breakdown Reported'}
              </span>
            </p>
          )}
        </div>

        <Link to="/driver/report" className="cta-role blue">
          <span className="cta-role__icon" aria-hidden>
            🚛
          </span>
          <span>
            <strong>Driver (Report Issue)</strong>
            <span>Start breakdown report</span>
          </span>
          <span className="cta-role__arrow">›</span>
        </Link>

        <Link to="/driver/complaints" className="cta-role green">
          <span className="cta-role__icon" aria-hidden>
            📋
          </span>
          <span>
            <strong>My Complaints</strong>
            <span>
              {openCount} open ticket{openCount === 1 ? '' : 's'}
            </span>
          </span>
          <span className="cta-role__arrow">›</span>
        </Link>

        <div className="grid-2">
          <Link to="/driver/vehicle" className="btn btn-secondary">
            🚛 Vehicle Details
          </Link>
          <Link to="/driver/history" className="btn btn-secondary">
            📜 History
          </Link>
        </div>

        <div className="feature-row">
          <div>Quick Reporting</div>
          <div>Connects to Right Team</div>
          <div>Faster Resolution</div>
        </div>
      </div>
      <BottomNav variant="driver" />
    </div>
  );
}
