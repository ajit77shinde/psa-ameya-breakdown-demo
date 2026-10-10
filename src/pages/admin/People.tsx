import { useDemoStore } from '../../store/DemoStore';

export function AdminPeople() {
  const { state } = useDemoStore();
  const drivers = state.users.filter((u) => u.role === 'driver');
  const techs = state.users.filter((u) => u.role === 'technician');
  const admins = state.users.filter((u) => u.role === 'admin');

  return (
    <div className="stack">
      <div>
        <h1 className="h1">Drivers & Technicians</h1>
        <p className="muted" style={{ marginTop: 6 }}>
          Seeded demo users for the stakeholder walkthrough.
        </p>
      </div>

      <Section title="Drivers" rows={drivers} />
      <Section title="Technicians" rows={techs} showDept />
      <Section title="Admins / Supervisors" rows={admins} />
    </div>
  );
}

function Section({
  title,
  rows,
  showDept,
}: {
  title: string;
  rows: {
    id: string;
    name: string;
    employeeId: string;
    phone: string;
    department?: string;
  }[];
  showDept?: boolean;
}) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <h2 className="h2">{title}</h2>
      <div className="table-wrap" style={{ marginTop: 12, border: 'none' }}>
        <table className="data">
          <thead>
            <tr>
              <th>Name</th>
              <th>Employee ID</th>
              <th>Phone</th>
              {showDept && <th>Department</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td>
                  <strong>{u.name}</strong>
                </td>
                <td>{u.employeeId}</td>
                <td>{u.phone}</td>
                {showDept && (
                  <td style={{ textTransform: 'capitalize' }}>
                    {u.department}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
