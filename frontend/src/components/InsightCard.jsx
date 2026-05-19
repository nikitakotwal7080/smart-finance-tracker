export default function InsightCard({ icon, text, type, delay = 0 }) {
  return (
    <div className="insight-card aFadeUp" style={{ animationDelay: `${delay}s` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 16 }}>{icon || '💡'}</span>
        <strong style={{ fontSize: 13, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{type || 'Tip'}</strong>
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.4, color: 'var(--text)' }}>{text}</p>
    </div>
  );
}