export default function EmptyState({ icon, title, sub, action, onAction, image }) {
  return (
    <div className="empty">
      {image && <img src={image} alt="Illustration" />}
      <div>{icon}</div>
      <h3>{title}</h3>
      <p>{sub}</p>
      {action && <button onClick={onAction}>{action}</button>}
    </div>
  );
}