import { BrandHeader } from '../../components/BrandHeader';
import { BottomNav } from '../../components/BottomNav';
import { useDemoStore } from '../../store/DemoStore';

export function DriverVehicle() {
  const { currentUser, vehiclesForDriver } = useDemoStore();
  const vehicles = vehiclesForDriver(currentUser!.id);

  return (
    <div className="mobile-frame">
      <BrandHeader title="Vehicle Details" backTo="/driver" />
      <div className="page-pad stack" style={{ flex: 1 }}>
        {vehicles.map((v) => (
          <div key={v.id} className="card" style={{ padding: 16 }}>
            <h2 className="h2">{v.registrationNumber}</h2>
            <div className="summary-list" style={{ marginTop: 12 }}>
              <div>
                <span className="muted">Type</span>
                <strong>{v.type}</strong>
              </div>
              <div>
                <span className="muted">Make / Model</span>
                <strong>
                  {v.manufacturer} {v.model}
                </strong>
              </div>
              <div>
                <span className="muted">Year</span>
                <strong>{v.year}</strong>
              </div>
              <div>
                <span className="muted">Odometer</span>
                <strong>{v.odometer.toLocaleString()} km</strong>
              </div>
              <div>
                <span className="muted">Status</span>
                <strong style={{ textTransform: 'capitalize' }}>
                  {v.status}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>
      <BottomNav variant="driver" />
    </div>
  );
}
