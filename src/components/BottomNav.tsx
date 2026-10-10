import { NavLink } from 'react-router-dom';

const DRIVER_LINKS = [
  { to: '/driver', label: 'Home', end: true },
  { to: '/driver/complaints', label: 'Complaints' },
  { to: '/driver/vehicle', label: 'Vehicle' },
  { to: '/driver/history', label: 'History' },
];

const TECH_LINKS = [
  { to: '/tech', label: 'Jobs', end: true },
  { to: '/tech/profile', label: 'Profile' },
];

export function BottomNav({ variant }: { variant: 'driver' | 'tech' }) {
  const links = variant === 'driver' ? DRIVER_LINKS : TECH_LINKS;
  return (
    <nav className={`bottom-nav ${variant === 'tech' ? 'tech-nav' : ''}`}>
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className={({ isActive }) => (isActive ? 'active' : undefined)}
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}
