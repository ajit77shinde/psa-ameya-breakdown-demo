import { Link, useParams } from 'react-router-dom';
import { BrandHeader } from '../../components/BrandHeader';
import { BottomNav } from '../../components/BottomNav';
import { PriorityPill } from '../../components/PriorityPill';
import { StatusBadge } from '../../components/StatusBadge';
import { Timeline } from '../../components/Timeline';
import { getDepartmentMeta } from '../../data/catalog';
import { useDemoStore } from '../../store/DemoStore';

export function DriverComplaints() {
  const { currentUser, ticketsForDriver, getVehicle } = useDemoStore();
  const tickets = ticketsForDriver(currentUser!.id);

  return (
    <div className="mobile-frame">
      <BrandHeader title="My Complaints" backTo="/driver" />
      <div className="page-pad" style={{ flex: 1 }}>
        {tickets.length === 0 && (
          <p className="muted">No complaints yet. Report a breakdown to start.</p>
        )}
        {tickets.map((t) => {
          const vehicle = getVehicle(t.vehicleId);
          const dept = getDepartmentMeta(t.department);
          return (
            <Link
              key={t.id}
              to={`/driver/complaints/${t.id}`}
              className="ticket-list-item"
            >
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <strong>{t.id}</strong>
                <PriorityPill priority={t.priority} />
              </div>
              <div style={{ marginTop: 6 }}>
                {dept.icon} {t.issue}
              </div>
              <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                {vehicle?.registrationNumber} ·{' '}
                {new Date(t.createdAt).toLocaleString()}
              </div>
              <div style={{ marginTop: 8 }}>
                <StatusBadge status={t.status} />
              </div>
            </Link>
          );
        })}
      </div>
      <BottomNav variant="driver" />
    </div>
  );
}

export function DriverComplaintDetail() {
  const { ticketId } = useParams();
  const { state, getVehicle, getUser } = useDemoStore();
  const ticket = state.tickets.find((t) => t.id === ticketId);

  if (!ticket) {
    return (
      <div className="mobile-frame">
        <BrandHeader title="Complaint" backTo="/driver/complaints" />
        <div className="page-pad">Ticket not found.</div>
      </div>
    );
  }

  const vehicle = getVehicle(ticket.vehicleId);
  const tech = ticket.assignedTechnicianId
    ? getUser(ticket.assignedTechnicianId)
    : undefined;
  const dept = getDepartmentMeta(ticket.department);

  return (
    <div className="mobile-frame">
      <BrandHeader title="Complaint Detail" backTo="/driver/complaints" />
      <div className="page-pad stack" style={{ flex: 1 }}>
        <div className="card" style={{ padding: 14 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <strong>{ticket.id}</strong>
            <StatusBadge status={ticket.status} />
          </div>
          <p style={{ margin: '10px 0 0' }}>
            <strong>
              {dept.icon} {ticket.issue}
            </strong>
          </p>
          <p className="muted" style={{ margin: '6px 0 0' }}>
            {ticket.description}
          </p>
          <div className="summary-list" style={{ marginTop: 12 }}>
            <div>
              <span className="muted">Vehicle</span>
              <strong>{vehicle?.registrationNumber}</strong>
            </div>
            <div>
              <span className="muted">Priority</span>
              <PriorityPill priority={ticket.priority} />
            </div>
            <div>
              <span className="muted">Location</span>
              <strong>{ticket.location.address}</strong>
            </div>
            <div>
              <span className="muted">Technician</span>
              <strong>{tech?.name ?? 'Awaiting assignment'}</strong>
            </div>
          </div>
          {tech?.phone && (
            <a
              className="btn btn-secondary btn-block"
              style={{ marginTop: 12 }}
              href={`tel:${tech.phone}`}
            >
              📞 Call Technician
            </a>
          )}
        </div>

        {ticket.photos.length > 0 && (
          <div className="photo-grid">
            {ticket.photos.map((src) => (
              <img key={src} src={src} alt="Evidence" />
            ))}
          </div>
        )}

        <div className="card" style={{ padding: 14 }}>
          <h2 className="h2" style={{ marginBottom: 12 }}>
            Status Timeline
          </h2>
          <Timeline current={ticket.status} history={ticket.statusHistory} />
        </div>

        {ticket.notes.length > 0 && (
          <div className="card" style={{ padding: 14 }}>
            <h2 className="h2" style={{ marginBottom: 10 }}>
              Updates
            </h2>
            {ticket.notes.map((n) => (
              <div key={n.id} style={{ marginBottom: 10 }}>
                <strong>{getUser(n.authorId)?.name ?? 'Team'}</strong>
                <div>{n.text}</div>
                <div className="muted" style={{ fontSize: 12 }}>
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
