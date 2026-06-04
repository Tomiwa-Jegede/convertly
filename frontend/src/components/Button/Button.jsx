export default function Button({ children, variant = "primary", onClick, style = {}, className = "" }) {
  return (
    <button
      className={`btn-${variant} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
}
