import { useNavigate } from 'react-router-dom';
import { DEMO_LOGIN_IDS } from '../data/seed';
import { useDemoStore } from '../store/DemoStore';

export function Login() {
  const { state, loginAs } = useDemoStore();
  const navigate = useNavigate();

  const users = DEMO_LOGIN_IDS.map(
    (id) => state.users.find((u) => u.id === id)!,
  );

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand-mark" style={{ marginBottom: 18 }}>
          <span className="brand-mark__badge">PSA</span>
          <div>
            <strong style={{ color: 'var(--brand-navy)' }}>AMEYA CFS</strong>
            <small style={{ color: 'var(--text-muted)' }}>
              LOGISTICS | SOLUTIONS
            </small>
          </div>
        </div>
        <h1 className="h1">Truck Breakdown Report App</h1>
        <p className="muted" style={{ marginTop: 8, marginBottom: 22 }}>
          Select a demo persona to explore the Phase 1 frontend walkthrough.
        </p>
        {users.map((u) => (
          <button
            key={u.id}
            type="button"
            className="persona-btn"
            onClick={() => {
              loginAs(u.id);
              if (u.role === 'driver') navigate('/driver');
              else if (u.role === 'technician') navigate('/tech');
              else navigate('/admin');
            }}
          >
            <div>
              <strong>{u.name}</strong>
              <div className="muted" style={{ fontSize: 13 }}>
                {u.employeeId}
                {u.department ? ` · ${u.department}` : ''}
              </div>
            </div>
            <span className="persona-btn__role">{u.role}</span>
          </button>
        ))}
        <p className="muted" style={{ marginTop: 18, fontSize: 13 }}>
          Together We Keep Your Fleet Moving · Safe | Reliable | Efficient
        </p>
      </div>
    </div>
  );
}
