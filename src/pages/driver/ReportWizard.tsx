import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrandHeader } from '../../components/BrandHeader';
import { DeptCard } from '../../components/DeptCard';
import { PriorityPill } from '../../components/PriorityPill';
import { DEPARTMENTS, ISSUE_CATALOG, getDepartmentMeta } from '../../data/catalog';
import { useDemoStore } from '../../store/DemoStore';
import type { Department, Priority, Ticket } from '../../types';

const STEPS = [
  'Vehicle',
  'Department',
  'Problem',
  'Details',
  'Evidence',
  'Location',
  'Priority',
  'Confirm',
] as const;

const DEFAULT_LOCATION = {
  lat: 18.8302,
  lng: 73.2567,
  address: 'Mumbai-Pune Expressway, Khalapur',
};

export function ReportWizard() {
  const navigate = useNavigate();
  const { currentUser, vehiclesForDriver, createTicket, getVehicle } =
    useDemoStore();
  const vehicles = vehiclesForDriver(currentUser!.id);

  const [step, setStep] = useState(0);
  const [vehicleId, setVehicleId] = useState(
    vehicles.length === 1 ? vehicles[0].id : '',
  );
  const [department, setDepartment] = useState<Department | null>(null);
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [priority, setPriority] = useState<Priority>('high');
  const [submitted, setSubmitted] = useState<Ticket | null>(null);

  const issues = useMemo(
    () => (department ? ISSUE_CATALOG[department] : []),
    [department],
  );

  const canNext = () => {
    switch (step) {
      case 0:
        return Boolean(vehicleId);
      case 1:
        return Boolean(department);
      case 2:
        return Boolean(issue);
      case 3:
        return description.trim().length >= 8;
      case 4:
        return true;
      case 5:
        return location.address.trim().length > 0;
      case 6:
        return Boolean(priority);
      default:
        return true;
    }
  };

  const onPhotos = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setPhotos((p) => [...p, ...urls].slice(0, 6));
  };

  const submit = () => {
    if (!department || !vehicleId) return;
    const ticket = createTicket({
      vehicleId,
      department,
      issue,
      description,
      priority,
      location,
      photos,
    });
    setSubmitted(ticket);
    setStep(7);
  };

  if (submitted) {
    const vehicle = getVehicle(submitted.vehicleId);
    const dept = getDepartmentMeta(submitted.department);
    return (
      <div className="mobile-frame">
        <BrandHeader title="Issue Submitted" />
        <div className="page-pad" style={{ flex: 1 }}>
          <div className="confirm-check" aria-hidden>
            ✓
          </div>
          <h2 className="h2" style={{ textAlign: 'center' }}>
            Your request has been submitted!
          </h2>
          <p className="muted" style={{ textAlign: 'center' }}>
            Your issue has been sent to the respective team.
          </p>
          <div className="card" style={{ padding: 14, marginTop: 18 }}>
            <div className="summary-list">
              <div>
                <span className="muted">Ticket ID</span>
                <strong>{submitted.id}</strong>
              </div>
              <div>
                <span className="muted">Department</span>
                <strong>
                  {dept.icon} {dept.label}
                </strong>
              </div>
              <div>
                <span className="muted">Vehicle No.</span>
                <strong>{vehicle?.registrationNumber}</strong>
              </div>
              <div>
                <span className="muted">Issue</span>
                <strong>{submitted.issue}</strong>
              </div>
              <div>
                <span className="muted">Location</span>
                <strong>{submitted.location.address}</strong>
              </div>
              <div>
                <span className="muted">Priority</span>
                <PriorityPill priority={submitted.priority} />
              </div>
              <div>
                <span className="muted">Reported By</span>
                <strong>Driver</strong>
              </div>
              <div>
                <span className="muted">Time</span>
                <strong>
                  {new Date(submitted.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </strong>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-block"
            style={{ marginTop: 20 }}
            onClick={() => navigate('/driver')}
          >
            🏠 Back to Home
          </button>
          <Link
            to={`/driver/complaints/${submitted.id}`}
            className="btn btn-secondary btn-block"
            style={{ marginTop: 10 }}
          >
            Track Status
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-frame">
      <BrandHeader
        title="Report Breakdown"
        backTo="/driver"
        subtitle={`Step ${step + 1} of 7 · ${STEPS[step]}`}
      />
      <div className="page-pad stack" style={{ flex: 1 }}>
        <div className="wizard-steps">
          {STEPS.slice(0, 7).map((_, i) => (
            <span key={STEPS[i]} className={i <= step ? 'done' : ''} />
          ))}
        </div>

        {step === 0 && (
          <>
            <h2 className="h2">Select Vehicle</h2>
            <p className="muted">Choose the vehicle with the issue.</p>
            {vehicles.map((v) => (
              <button
                key={v.id}
                type="button"
                className={`choice-chip ${vehicleId === v.id ? 'selected' : ''}`}
                onClick={() => setVehicleId(v.id)}
              >
                <strong>{v.registrationNumber}</strong>
                <div className="muted" style={{ fontSize: 13 }}>
                  {v.type} · {v.manufacturer} {v.model}
                </div>
              </button>
            ))}
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="h2">Select Department</h2>
            <p className="muted">Choose the department for vehicle issue.</p>
            {DEPARTMENTS.map((d) => (
              <DeptCard
                key={d.id}
                dept={d}
                selected={department === d.id}
                onClick={() => {
                  setDepartment(d.id);
                  setIssue('');
                }}
              />
            ))}
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="h2">Select Problem</h2>
            <p className="muted">
              {department ? getDepartmentMeta(department).label : ''} issues
            </p>
            {issues.map((item) => (
              <button
                key={item}
                type="button"
                className={`choice-chip ${issue === item ? 'selected' : ''}`}
                onClick={() => setIssue(item)}
              >
                {item}
              </button>
            ))}
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="h2">Describe Problem</h2>
            <div className="field">
              <label htmlFor="desc">What happened?</label>
              <textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Vehicle stopped suddenly while travelling. Engine temperature is very high..."
              />
            </div>
            <p className="muted" style={{ fontSize: 13 }}>
              Voice recording — Coming in Phase 2
            </p>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="h2">Upload Evidence</h2>
            <p className="muted">Camera / Gallery photos (local preview only).</p>
            <label className="btn btn-secondary btn-block">
              📷 Add Photos
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => onPhotos(e.target.files)}
              />
            </label>
            {photos.length > 0 && (
              <div className="photo-grid">
                {photos.map((src) => (
                  <img key={src} src={src} alt="Evidence" />
                ))}
              </div>
            )}
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="h2">Location</h2>
            <p className="muted">GPS captured for demo. You can edit the address.</p>
            <div className="card" style={{ padding: 14 }}>
              <div className="muted" style={{ fontSize: 13 }}>
                Lat {location.lat}, Lng {location.lng}
              </div>
            </div>
            <div className="field">
              <label htmlFor="addr">Address</label>
              <input
                id="addr"
                value={location.address}
                onChange={(e) =>
                  setLocation((l) => ({ ...l, address: e.target.value }))
                }
              />
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setLocation(DEFAULT_LOCATION)}
            >
              📍 Use current demo GPS
            </button>
          </>
        )}

        {step === 6 && (
          <>
            <h2 className="h2">Priority</h2>
            {(
              [
                ['emergency', 'Accident, blocking road, brake/engine failure'],
                ['high', 'Vehicle stranded, needs quick attention'],
                ['normal', 'Can wait for scheduled response'],
              ] as const
            ).map(([p, hint]) => (
              <button
                key={p}
                type="button"
                className={`priority-option ${priority === p ? 'selected' : ''}`}
                style={{
                  color:
                    p === 'emergency'
                      ? 'var(--danger)'
                      : p === 'high'
                        ? 'var(--warning)'
                        : 'var(--normal)',
                }}
                onClick={() => setPriority(p)}
              >
                <PriorityPill priority={p} />
                <div className="muted" style={{ marginTop: 6, fontSize: 13 }}>
                  {hint}
                </div>
              </button>
            ))}
          </>
        )}

        <div className="row" style={{ marginTop: 'auto', paddingTop: 12 }}>
          {step > 0 && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </button>
          )}
          {step < 6 ? (
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={!canNext()}
              onClick={() => setStep((s) => s + 1)}
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-success"
              style={{ flex: 1 }}
              disabled={!canNext()}
              onClick={submit}
            >
              Submit Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
