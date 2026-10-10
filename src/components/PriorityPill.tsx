import type { Priority } from '../types';

const META: Record<Priority, { label: string; bg: string; fg: string; dot: string }> = {
  emergency: { label: 'Emergency', bg: '#ffebee', fg: '#c62828', dot: '🔴' },
  high: { label: 'High', bg: '#fff3e0', fg: '#ef6c00', dot: '🟠' },
  normal: { label: 'Normal', bg: '#fffde7', fg: '#f9a825', dot: '🟡' },
};

export function PriorityPill({ priority }: { priority: Priority }) {
  const m = META[priority];
  return (
    <span className="badge" style={{ background: m.bg, color: m.fg }}>
      <span aria-hidden>{m.dot}</span> {m.label}
    </span>
  );
}
