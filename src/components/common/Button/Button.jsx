import "./Button.css";

export default function Button({ children, onClick, disabled, fullWidth, variant = "primary", type="button" }) {
  const cls = [
    "btn",
    variant === "primary" ? "btnPrimary" : "btnGhost",
    fullWidth ? "btnFull" : ""
  ].join(" ");

  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}