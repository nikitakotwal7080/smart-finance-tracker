import { useState } from "react";
import { autoCat, todayS, CATS, COLORS, ICONS, CAT_BG } from "../utils/helpers";

export default function ExpenseModal({ initial, onSave, onClose }) {
  const [form,setForm]=useState(initial||{amount:"",category:"Food",date:todayS(),notes:""});
  const [err,setErr]=useState("");
  const detected=autoCat(form.notes);
 
  const handleNotes=notes=>{
    const c=autoCat(notes);
    setForm(f=>({...f,notes,category:c||f.category}));
  };
 
  const save=()=>{
    if(!form.amount||isNaN(Number(form.amount))||Number(form.amount)<=0){setErr("Enter a valid amount greater than 0.");return;}
    if(!form.date){setErr("Select a date.");return;}
    onSave({...form,amount:Number(form.amount),category:form.category});
  };
 
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}} onClick={onClose}>
      <div className="aScaleIn" style={{width:"100%",maxWidth:490,background:"var(--surface2)",border:"1px solid var(--border2)",borderRadius:24,padding:28,boxShadow:"0 32px 80px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <h2 style={{fontWeight:800,fontSize:19}}>{initial?"✏️ Edit Expense":"➕ Add Expense"}</h2>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.06)",border:"1px solid var(--border)",borderRadius:8,color:"var(--muted)",padding:"6px 10px",fontSize:16,lineHeight:1}}>✕</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {/* Amount */}
          <div>
            <label className="input-lbl">Amount (₹) *</label>
            <div style={{position:"relative"}}>
              <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontFamily:"var(--mono)",fontWeight:700,color:"var(--accent)",fontSize:15}}>₹</span>
              <input type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} placeholder="0" style={{paddingLeft:28,fontFamily:"var(--mono)",fontSize:17,fontWeight:700}} autoFocus/>
            </div>
          </div>
          {/* Notes */}
          <div>
            <label className="input-lbl">Notes <span style={{color:"var(--accent)",fontSize:10,textTransform:"none",letterSpacing:0}}>(type to auto-detect category)</span></label>
            <input value={form.notes} onChange={e=>handleNotes(e.target.value)} placeholder="e.g. Swiggy dinner, Amazon order, Electricity bill..."/>
            {detected&&<p style={{fontSize:11,color:"var(--green)",marginTop:4}}>✓ Auto-detected: <strong>{ICONS[detected]} {detected}</strong></p>}
          </div>
          {/* Category + Date */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <label className="input-lbl">Category</label>
              <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                {CATS.map(c=><option key={c} value={c}>{ICONS[c]} {c}</option>)}
              </select>
            </div>
            <div>
              <label className="input-lbl">Date *</label>
              <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={{colorScheme:"dark"}}/>
            </div>
          </div>
          {/* Category chips */}
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {CATS.map(c=>(
              <button key={c} onClick={()=>setForm(f=>({...f,category:c}))} style={{padding:"5px 12px",borderRadius:99,fontSize:11,fontWeight:700,background:form.category===c?CAT_BG[c]:"transparent",color:form.category===c?COLORS[c]:"var(--muted)",border:`1px solid ${form.category===c?COLORS[c]+"40":"rgba(255,255,255,.08)"}`,transition:"all .15s"}}>
                {ICONS[c]} {c}
              </button>
            ))}
          </div>
          {err&&<p style={{fontSize:12,color:"var(--red)",background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.2)",borderRadius:8,padding:"8px 12px"}}>{err}</p>}
          <div style={{display:"flex",gap:10,marginTop:4}}>
            <button className="btn-primary" onClick={save}>{initial?"Update Expense":"Add Expense"}</button>
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}