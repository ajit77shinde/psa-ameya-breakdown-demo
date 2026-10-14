import { useState } from 'react';
import { useDemoStore } from '../../store/DemoStore';
import type { Vehicle, VehicleStatus } from '../../types';

const emptyForm = (): Omit<Vehicle, 'id'> => ({
  registrationNumber: '',
  type: 'Trailer Truck',
  manufacturer: '',
  model: '',
  year: new Date().getFullYear(),
  assignedDriverId: 'u-driver-1',
  status: 'active',
  odometer: 0,
});

export function AdminVehicles() {
  const { state, upsertVehicle, getUser } = useDemoStore();
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const drivers = state.users.filter((u) => u.role === 'driver');
  const availableDrivers = drivers.filter(
    (driver) =>
      !state.vehicles.some(
        (vehicle) =>
          vehicle.assignedDriverId === driver.id && vehicle.id !== editingId,
      ),
  );
  const selectedDriverId = availableDrivers.some(
    (driver) => driver.id === form.assignedDriverId,
  )
    ? form.assignedDriverId
    : (availableDrivers[0]?.id ?? '');
  const driverTaken = !selectedDriverId;

  const startEdit = (v: Vehicle) => {
    setEditingId(v.id);
    setForm({
      registrationNumber: v.registrationNumber,
      type: v.type,
      manufacturer: v.manufacturer,
      model: v.model,
      year: v.year,
      assignedDriverId: v.assignedDriverId,
      status: v.status,
      odometer: v.odometer,
    });
  };

  const save = () => {
    if (!form.registrationNumber.trim() || !selectedDriverId) return;
    const vehicle: Vehicle = {
      id: editingId ?? `v-${Date.now()}`,
      ...form,
      assignedDriverId: selectedDriverId,
    };
    upsertVehicle(vehicle);
    setEditingId(null);
    setForm(emptyForm());
  };

  return (
    <div className="stack">
      <div>
        <h1 className="h1">Vehicles</h1>
        <p className="muted" style={{ marginTop: 6 }}>
          Each driver is assigned one vehicle.
        </p>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <h2 className="h2">{editingId ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
        <div className="grid-2" style={{ marginTop: 12 }}>
          <div className="field">
            <label>Registration</label>
            <input
              value={form.registrationNumber}
              onChange={(e) =>
                setForm((f) => ({ ...f, registrationNumber: e.target.value }))
              }
              placeholder="MH 12 AB 4587"
            />
          </div>
          <div className="field">
            <label>Type</label>
            <input
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Manufacturer</label>
            <input
              value={form.manufacturer}
              onChange={(e) =>
                setForm((f) => ({ ...f, manufacturer: e.target.value }))
              }
            />
          </div>
          <div className="field">
            <label>Model</label>
            <input
              value={form.model}
              onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Year</label>
            <input
              type="number"
              value={form.year}
              onChange={(e) =>
                setForm((f) => ({ ...f, year: Number(e.target.value) }))
              }
            />
          </div>
          <div className="field">
            <label>Odometer</label>
            <input
              type="number"
              value={form.odometer}
              onChange={(e) =>
                setForm((f) => ({ ...f, odometer: Number(e.target.value) }))
              }
            />
          </div>
          <div className="field">
            <label>Assigned Driver</label>
            <select
              value={selectedDriverId}
              onChange={(e) =>
                setForm((f) => ({ ...f, assignedDriverId: e.target.value }))
              }
              disabled={availableDrivers.length === 0}
            >
              {availableDrivers.length === 0 && (
                <option value="">No driver available</option>
              )}
              {availableDrivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {availableDrivers.length === 0 && (
              <span className="muted" style={{ fontSize: 12 }}>
                Every driver already has a vehicle.
              </span>
            )}
          </div>
          <div className="field">
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  status: e.target.value as VehicleStatus,
                }))
              }
            >
              <option value="active">Active</option>
              <option value="breakdown">Breakdown</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={save}
            disabled={driverTaken}
          >
            {editingId ? 'Update Vehicle' : 'Add Vehicle'}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm());
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Registration</th>
              <th>Type</th>
              <th>Model</th>
              <th>Driver</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {state.vehicles.map((v) => (
              <tr key={v.id}>
                <td>
                  <strong>{v.registrationNumber}</strong>
                </td>
                <td>{v.type}</td>
                <td>
                  {v.manufacturer} {v.model} ({v.year})
                </td>
                <td>{getUser(v.assignedDriverId)?.name}</td>
                <td style={{ textTransform: 'capitalize' }}>{v.status}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => startEdit(v)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
