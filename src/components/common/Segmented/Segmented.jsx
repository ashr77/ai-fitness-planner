import "./Segmented.css";

export default function Segmented({ options, value, onChange, columns = 3 }) {
  return (
    <div className="seg" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            className={"segItem " + (active ? "segActive" : "")}
            onClick={() => onChange(opt.value)}
          >
            <div className="segTop">{opt.label}</div>
            {opt.sub && <div className="segSub">{opt.sub}</div>}
          </button>
        );
      })}
    </div>
  );
}