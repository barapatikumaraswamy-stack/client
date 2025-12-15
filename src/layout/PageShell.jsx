export default function PageShell({ title, subtitle, actions, children }) {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        <div>{actions}</div>
      </header>
      <div className="page-body">{children}</div>
    </div>
  );
}