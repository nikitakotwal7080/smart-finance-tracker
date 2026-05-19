export default function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div style={{background:"rgba(10,12,23,0.95)",color:"#fff",padding:12,borderRadius:16,boxShadow:"0 20px 60px rgba(0,0,0,0.3)",fontSize:12}}>
      <p style={{margin:0,color:"#fff",fontWeight:700}}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{margin:"8px 0 0",color:"#fff"}}>{p.value}</p>
      ))}
    </div>
  );
}