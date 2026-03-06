import "./AppShell.css";

function LogoMark() {
  return (
    <div className="logoMark" aria-hidden="true">
      <svg className="logoSvg" width="22" height="22" viewBox="0 0 24 24">
        {/* Outer ring */}
        <circle cx="12" cy="12" r="9" className="logoRing" />
        {/* Upward trend */}
        <path
          className="logoLine"
          d="M7 14l3-3 2 2 5-5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        {/* Arrow head */}
        <path
          className="logoLine"
          d="M16.8 8H18v1.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        {/* Dot */}
        <circle cx="7" cy="14" r="1.2" className="logoDot" />
      </svg>
    </div>
  );
}

export default function AppShell({ children }) {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <LogoMark />
          <div className="brandText">AI FITNESS PLANNER</div>
        </div>
      </header>

      <main className="content">{children}</main>
    </div>
  );
}