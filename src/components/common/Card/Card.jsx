import "./Card.css";

export default function Card({ title, right, children }) {
  return (
    <section className="card">
      {(title || right) && (
        <div className="cardHeader">
          <div className="cardTitle">{title}</div>
          <div className="cardRight">{right}</div>
        </div>
      )}
      <div className="cardBody">{children}</div>
    </section>
  );
}