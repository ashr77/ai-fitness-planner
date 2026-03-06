import "./NumberPill.css";

export default function NumberPill({ value, active, onClick }) {
  return (
    <button
      type="button"
      className={"pill " + (active ? "pillActive" : "")}
      onClick={onClick}
    >
      {value}
    </button>
  );
}