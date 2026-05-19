export default function StatCard({
  label,
  value,
  sub,
  accent,
  icon,
  delay = 0,
}) {
  return (
    <div
      className="card aFadeUp"
      style={{
        animationDelay: `${delay}s`,
        border: `1px solid ${accent}30`,
        background: "rgba(15,18,25,0.95)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              color: "#ffffff",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            {label}
          </div>

          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: "#ffffff",
              marginBottom: 6,
            }}
          >
            {value}
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#d1d5db",
            }}
          >
            {sub}
          </div>
        </div>

        <div
          style={{
            fontSize: 28,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}