import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BrandHeader } from '../../components/BrandHeader';
import { PriorityPill } from '../../components/PriorityPill';
import { StatusBadge } from '../../components/StatusBadge';
import { Timeline } from '../../components/Timeline';
import { getDepartmentMeta } from '../../data/catalog';
import {
  canAdvance,
  nextStatus,
  statusActionLabel,
} from '../../lib/statusMachine';
import { useDemoStore } from '../../store/DemoStore';

export function TechTicketDetail() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const {
    state,
    currentUser,
    getVehicle,
    getUser,
    advanceTicketStatus,
    setTicketStatus,
    assignTechnician,
    addTicketNote,
  } = useDemoStore();
  const [note, setNote] = useState('');
  const ticket = state.tickets.find((t) => t.id === ticketId);

  if (!ticket) {
    return (
      <div className="mobile-frame">
        <BrandHeader title="Job" backTo="/tech" />
        <div className="page-pad">Ticket not found.</div>
      </div>
    );
  }

  const vehicle = getVehicle(ticket.vehicleId);
  const driver = getUser(ticket.driverId);
  const dept = getDepartmentMeta(ticket.department);
  const mapsUrl = `https://www.google.com/maps?q=${ticket.location.lat},${ticket.location.lng}`;
  const action = statusActionLabel(ticket.status);
  const next = nextStatus(ticket.status);

  const handleAdvance = () => {
    if (ticket.status === 'submitted') {
      assignTechnician(ticket.id, currentUser!.id);
      setTicketStatus(ticket.id, 'accepted');
      return;
    }
    if (ticket.status === 'team_assigned') {
      if (ticket.assignedTechnicianId !== currentUser!.id) {
        assignTechnician(ticket.id, currentUser!.id);
      }
      setTicketStatus(ticket.id, 'accepted');
      return;
    }
    advanceTicketStatus(ticket.id, note.trim() || undefined);
    setNote('');
  };

  return (
    <div className="mobile-frame">
      <BrandHeader title="Job Detail" backTo="/tech" />
      <div className="page-pad stack" style={{ flex: 1 }}>
        <div className="card" style={{ padding: 14 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <strong>{ticket.id}</strong>
            <PriorityPill priority={ticket.priority} />
          </div>
          <div style={{ marginTop: 8 }}>
            <StatusBadge status={ticket.status} />
          </div>
          <p style={{ margin: '12px 0 0' }}>
            <strong>
              {dept.icon} {ticket.issue}
            </strong>
          </p>
          <p className="muted">{ticket.description}</p>
          <div className="summary-list" style={{ marginTop: 10 }}>
            <div>
              <span className="muted">Vehicle</span>
              <strong>{vehicle?.registrationNumber}</strong>
            </div>
            <div>
              <span className="muted">Driver</span>
              <strong>{driver?.name}</strong>
            </div>
            <div>
              <span className="muted">Location</span>
              <strong>{ticket.location.address}</strong>
            </div>
          </div>
        </div>

        <div className="grid-2">
          <a className="btn btn-secondary" href={`tel:${driver?.phone ?? ''}`}>
            📞 Call Driver
          </a>
          <a
            className="btn btn-secondary"
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            📍 Navigate
          </a>
        </div>

        {ticket.photos.length > 0 && (
          <div className="photo-grid">
            {ticket.photos.map((src) => (
              <img key={src} src={src} alt="Evidence" />
            ))}
          </div>
        )}

        <div className="field">
          <label htmlFor="note">Repair notes</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add diagnosis, parts used, or update for driver..."
          />
        </div>

        <div className="row">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              if (!note.trim()) return;
              addTicketNote(ticket.id, note.trim());
              setNote('');
            }}
          >
            Save Note
          </button>
          {canAdvance(ticket.status) && (
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={handleAdvance}
            >
              {ticket.status === 'submitted' || ticket.status === 'team_assigned'
                ? 'Accept Job'
                : action}
              {next &&
              ticket.status !== 'submitted' &&
              ticket.status !== 'team_assigned'
                ? ''
                : ''}
            </button>
          )}
        </div>

        {ticket.status === 'repair_completed' && (
          <button
            type="button"
            className="btn btn-success btn-block"
            onClick={() => {
              setTicketStatus(ticket.id, 'closed');
              navigate('/tech');
            }}
          >
            Close Ticket
          </button>
        )}

        <div className="card" style={{ padding: 14 }}>
          <h2 className="h2" style={{ marginBottom: 12 }}>
            Timeline
          </h2>
          <Timeline current={ticket.status} history={ticket.statusHistory} />
        </div>

        {ticket.notes.length > 0 && (
          <div className="card" style={{ padding: 14 }}>
            <h2 className="h2" style={{ marginBottom: 10 }}>
              Notes
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
