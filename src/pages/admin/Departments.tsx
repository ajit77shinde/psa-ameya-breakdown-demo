import { DEPARTMENTS, ISSUE_CATALOG } from '../../data/catalog';

export function AdminDepartments() {
  return (
    <div className="stack">
      <div>
        <h1 className="h1">Departments</h1>
        <p className="muted" style={{ marginTop: 6 }}>
          Color-coded service departments and issue catalogs.
        </p>
      </div>

      <div className="stat-grid">
        {DEPARTMENTS.map((d) => (
          <div
            key={d.id}
            className="stat-card"
            style={{ borderTop: `4px solid ${d.color}` }}
          >
            <div style={{ fontSize: 28 }}>{d.icon}</div>
            <strong style={{ fontSize: '1.2rem', marginTop: 8 }}>
              {d.label}
            </strong>
            <span>{d.examples}</span>
            <ul style={{ margin: '12px 0 0', paddingLeft: 18, fontSize: 13 }}>
              {ISSUE_CATALOG[d.id].map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
