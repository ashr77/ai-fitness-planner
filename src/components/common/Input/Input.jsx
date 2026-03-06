import "./Input.css";

export default function Input({ label, value, onChange, type="text", placeholder }) {
  return (
    <label className="field">
      <div className="fieldLabel">{label}</div>
      <input
        className="fieldInput"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
      />
    </label>
  );
}