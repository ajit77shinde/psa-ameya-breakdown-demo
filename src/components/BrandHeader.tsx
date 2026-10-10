import { Link } from 'react-router-dom';

interface Props {
  title?: string;
  backTo?: string;
  subtitle?: string;
}

export function BrandHeader({ title, backTo, subtitle }: Props) {
  return (
    <header className="brand-header">
      <div className="brand-header__top">
        {backTo ? (
          <Link to={backTo} className="brand-header__back" aria-label="Back">
            ←
          </Link>
        ) : (
          <div className="brand-mark">
            <span className="brand-mark__badge">PSA</span>
            <div>
              <strong>AMEYA CFS</strong>
              <small>LOGISTICS | SOLUTIONS</small>
            </div>
          </div>
        )}
        {title && <h1 className="brand-header__title">{title}</h1>}
        {backTo && <span style={{ width: 28 }} />}
      </div>
      {subtitle && <p className="brand-header__sub muted">{subtitle}</p>}
    </header>
  );
}
