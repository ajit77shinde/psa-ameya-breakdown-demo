import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrandHeader } from '../../components/BrandHeader';
import { DeptCard } from '../../components/DeptCard';
import { PriorityPill } from '../../components/PriorityPill';
import { VoiceNote, VoiceRecorder } from '../../components/VoiceNote';
import { DEPARTMENTS, getDepartmentMeta } from '../../data/catalog';
import { useDemoStore } from '../../store/DemoStore';
import type { Department, Priority, Ticket } from '../../types';

const STEP_LABELS = {
  vehicle: 'Vehicle',
  department: 'Department',
  report: 'Submit',
} as const;

type StepId = keyof typeof STEP_LABELS;

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
  const steps = useMemo<StepId[]>(
    () =>
      vehicles.length > 1
        ? ['vehicle', 'department', 'report']
        : ['department', 'report'],
    [vehicles.length],
  );

  const [step, setStep] = useState(0);
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? '');
  const [department, setDepartment] = useState<Department | null>(null);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [submitted, setSubmitted] = useState<Ticket | null>(null);

  const stepId = steps[step] ?? steps[0];

  const goTo = (id: StepId) => {
    const index = steps.indexOf(id);
    if (index >= 0) setStep(index);
  };

  const onPhotos = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setPhotos((p) => [...p, ...urls].slice(0, 6));
  };

  const submit = (priority: Priority) => {
    if (!department || !vehicleId || !voiceNote) return;
    const issue = getDepartmentMeta(department).label;
    const ticket = createTicket({
      vehicleId,
      department,
      issue,
      description: 'Voice recording',
      priority,
      location: location.address.trim() ? location : DEFAULT_LOCATION,
      photos,
      voiceNote,
    });
    setSubmitted(ticket);
  };

  if (vehicles.length === 0) {
    return (
      <div className="mobile-frame">
        <BrandHeader title="Report Breakdown" backTo="/driver" />
        <div className="page-pad">
          <p className="muted">No vehicle is assigned to this driver.</p>
        </div>
      </div>
    );
  }

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
            <VoiceNote src={submitted.voiceNote} />
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
        subtitle={`Step ${step + 1} of ${steps.length} · ${STEP_LABELS[stepId]}`}
      />
      <div className="page-pad stack" style={{ flex: 1 }}>
        <div className="wizard-steps">
          {steps.map((id, i) => (
            <span key={id} className={i <= step ? 'done' : ''} />
          ))}
        </div>

        {stepId === 'vehicle' && (
          <>
            <h2 className="h2">Select Vehicle</h2>
            <p className="muted">Tap the vehicle with the issue.</p>
            {vehicles.map((v) => (
              <button
                key={v.id}
                type="button"
                className={`choice-chip ${vehicleId === v.id ? 'selected' : ''}`}
                onClick={() => {
                  setVehicleId(v.id);
                  goTo('department');
                }}
              >
                <strong>{v.registrationNumber}</strong>
                <div className="muted" style={{ fontSize: 13 }}>
                  {v.type} · {v.manufacturer} {v.model}
                </div>
              </button>
            ))}
          </>
        )}

        {stepId === 'department' && (
          <>
            <h2 className="h2">Select Department</h2>
            <p className="muted">Tap the department for this issue.</p>
            {DEPARTMENTS.map((d) => (
              <DeptCard
                key={d.id}
                dept={d}
                selected={department === d.id}
                onClick={() => {
                  setDepartment(d.id);
                  goTo('report');
                }}
              />
            ))}
          </>
        )}

        {stepId === 'report' && (
          <>
            <h2 className="h2">Send Report</h2>
            <p className="muted">
              Record what happened, then tap a priority to submit.
            </p>
            <VoiceRecorder value={voiceNote} onChange={setVoiceNote} />
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
            <div className="field">
              <label htmlFor="addr">Location</label>
              <input
                id="addr"
                value={location.address}
                onChange={(e) =>
                  setLocation((l) => ({ ...l, address: e.target.value }))
                }
              />
            </div>
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
                className="priority-option"
                disabled={!voiceNote}
                style={{
                  color:
                    p === 'emergency'
                      ? 'var(--danger)'
                      : p === 'high'
                        ? 'var(--warning)'
                        : 'var(--normal)',
                }}
                onClick={() => submit(p)}
              >
                <PriorityPill priority={p} />
                <div className="muted" style={{ marginTop: 6, fontSize: 13 }}>
                  {hint}
                </div>
              </button>
            ))}
          </>
        )}

        {step > 0 && (
          <div className="row" style={{ marginTop: 'auto', paddingTop: 12 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
