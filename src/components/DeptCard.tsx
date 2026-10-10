import type { DepartmentMeta } from '../data/catalog';

interface Props {
  dept: DepartmentMeta;
  selected?: boolean;
  onClick?: () => void;
}

export function DeptCard({ dept, selected, onClick }: Props) {
  return (
    <button
      type="button"
      className={`dept-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
      style={{ ['--dept-color' as string]: dept.color }}
    >
      <div className="dept-card__icon" aria-hidden>
        {dept.icon}
      </div>
      <div className="dept-card__body">
        <strong>{dept.label}</strong>
        <span>{dept.examples}</span>
      </div>
      <span className="dept-card__chev" aria-hidden>
        ›
      </span>
    </button>
  );
}
