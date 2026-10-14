import { Link, useNavigate } from 'react-router-dom';
import { DEMO_LOGIN_IDS } from '../data/seed';
import { useDemoStore } from '../store/DemoStore';

export function DemoBar() {
  const { currentUser, logout, resetDemo, state, loginAs } = useDemoStore();
  const navigate = useNavigate();

  const personas = DEMO_LOGIN_IDS.map(
    (id) => state.users.find((u) => u.id === id)!,
  ).filter(Boolean);

  return (
    <div className="demo-bar">
      <div className="demo-bar__left">
        <strong>Demo Mode</strong>
        <span className="muted">
          {currentUser
            ? `${currentUser.name} · ${currentUser.role}`
            : 'Not signed in'}
        </span>
      </div>
      <div className="demo-bar__right">
        {currentUser && (
          <select
            aria-label="Switch persona"
            value={currentUser.id}
            onChange={(e) => {
              loginAs(e.target.value);
              const user = state.users.find((u) => u.id === e.target.value);
              if (!user) return;
              if (user.role === 'driver') navigate('/driver');
              else if (user.role === 'technician') navigate('/tech');
              else navigate('/admin');
            }}
          >
            {personas.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        )}
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            resetDemo();
            navigate('/');
          }}
        >
          Reset data
        </button>
        {currentUser ? (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Logout
          </button>
        ) : (
          <Link to="/" className="btn btn-ghost">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
