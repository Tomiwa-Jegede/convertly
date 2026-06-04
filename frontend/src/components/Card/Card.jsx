export default function Card({ children, style = {}, className = "" }) {
  return (
    <div className={`card-glass ${className}`} style={style}>
      {children}
    </div>
  );
}
