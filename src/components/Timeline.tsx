import {
  normalizeTicketStatus,
  STATUS_LABELS,
  STATUS_ORDER,
} from '../lib/statusMachine';
import type { StatusEvent, TicketStatus } from '../types';

interface Props {
  current: TicketStatus;
  history: StatusEvent[];
}

export function Timeline({ current, history }: Props) {
  const currentIdx = STATUS_ORDER.indexOf(normalizeTicketStatus(current));
  const byStatus = new Map(history.map((h) => [h.status, h]));

  return (
    <ol className="timeline">
      {STATUS_ORDER.map((status, idx) => {
        const done = idx <= currentIdx;
        const event = byStatus.get(status);
        return (
          <li key={status} className={done ? 'done' : ''}>
            <span className="timeline__dot" />
            <div>
              <strong>{STATUS_LABELS[status]}</strong>
              {event && (
                <div className="muted" style={{ fontSize: 12 }}>
                  {new Date(event.at).toLocaleString()}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
