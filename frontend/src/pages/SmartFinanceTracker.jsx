import API from "../services/api";
import { 
  ResponsiveContainer, 
  AreaChart,
  Area,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
} from "recharts";
import { 
  fmt, 
  lsSet,
  uid,
  todayS,
  CATS,
  COLORS,
  ICONS,
  CAT_BG,
  isWE,
} from "../utils/helpers";
//import React from 'react';
import { useEffect, useMemo, useState } from "react";
import { GLOBAL_CSS } from "../styles/globalStyles";

  const getWeekInMonth = (date) => {
  const d = new Date(date);
  const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
  const firstDayOfWeek = firstDay.getDay();
  const dayOfMonth = d.getDate();
  return Math.ceil((dayOfMonth + firstDayOfWeek) / 7);
};
import useAnalytics from "../hooks/useAnalytics";
import AuthPage from "../components/AuthPage";
import ExpenseModal from "../components/ExpenseModal";
import Toast from "../components/Toast";
import InsightCard from "../components/InsightCard";
import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";
import ChartTip from "../components/ChartTip";
import heroImg from "../assets/hero.png";


export default function SmartFinanceTracker(){
  // Inject CSS once
  useEffect(()=>{
    const id="sft-style";
    if(!document.getElementById(id)){
      const s=document.createElement("style");
      s.id=id; s.textContent=GLOBAL_CSS;
      document.head.appendChild(s);
    }
  },[]);
 
  const [user,setUser]=useState(null);
  const [ready,setReady]=useState(false);
  const [expenses,setExpenses]=useState([]);
  const [budget,setBudget]=useState(0);
  const [budgetInput,setBudgetInput]=useState("");
  const [selectedMonth,setSelectedMonth]=useState(new Date().getMonth());
  const [selectedYear,setSelectedYear]=useState(new Date().getFullYear());
  const [tab,setTab]=useState("dashboard");
  const [modal,setModal]=useState(null);
  const [filterCat,setFilterCat]=useState("All");
  const [toast,setToast]=useState(null);
  const [aiIns,setAiIns]=useState([]);
  const [aiLoading,setAiLoading]=useState(false);
  const [search,setSearch]=useState("");
  const [customGoalTitle,setCustomGoalTitle]=useState("");
  const [customGoalTarget,setCustomGoalTarget]=useState("");
  const [customGoals,setCustomGoals]=useState([]);
  const [hiddenGoalIds,setHiddenGoalIds]=useState([]);
  const [budgetHistory,setBudgetHistory]=useState([]);
  const [loadingExpense, setLoadingExpense] = useState(false);
 
  const loadExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/expenses", {
        headers: {
          Authorization: token,
        },
      });
      setExpenses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadBudget = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/budget", {
        headers: {
          Authorization: token,
        },
        params: {
          year: selectedYear,
          month: selectedMonth,
        },
      });
      setBudget(res.data.amount);
      setBudgetInput(res.data.amount);
    } catch (err) {
      console.log(err);
    }
  };

  const loadBudgetHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/budget/history", {
        headers: {
          Authorization: token,
        },
      });
      setBudgetHistory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  const persistBudget = async (value) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        "/budget",
        {
          budget: value,
          year: selectedYear,
          month: selectedMonth,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setBudgetHistory(Array.isArray(res.data.history) ? res.data.history : budgetHistory);
    } catch (err) {
      console.log(err);
    }
  };

  const createExpense = async (data) => {
    if (loadingExpense) return;
    setLoadingExpense(true);

    try {
      const token = localStorage.getItem("token");
      const res = await API.post("/expenses", data, {
        headers: {
          Authorization: token,
        },
      });

      if (res && res.data) {
        setExpenses((prev) => [res.data, ...prev]);
        showToast("Expense added ✓", "success");
        return res.data;
      } else {
        showToast("Unexpected server response", "error");
        return null;
      }
    } catch (err) {
      const msg = (err && err.response && err.response.data && err.response.data.message) || err.message || "Failed to add expense";
      showToast(msg, "error");
       return null;
    } finally {
      setLoadingExpense(false);
    }
  };

  const updateExpense = async (id, data) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.put(`/expenses/${id}`, data, {
        headers: {
          Authorization: token,
        },
      });
      if (res && res.data) {
        setExpenses((prev) => prev.map((e) => (e._id === id ? res.data : e)));
        showToast("Expense updated", "success");
        return res.data;
      } else {
        showToast("Unexpected server response", "error");
        return null;
      }
    } catch (err) {
      const msg = (err && err.response && err.response.data && err.response.data.message) || err.message || "Failed to update expense";
      showToast(msg, "error");
      console.error("updateExpense error:", err);
      return null;
    }
  };

  const deleteExpense = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/expenses/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
  const initAuth = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setReady(true);
        return;
      }

      const res = await API.get("/auth/me", {
        headers: {
          Authorization: token,
        },
      });

      setUser(res.data);
    } catch (err) {
      console.log(err);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setReady(true);
    }
  };

  initAuth();
}, []);
 
  useEffect(() => {
    if (!user) return;

    setCustomGoals([]);
    setHiddenGoalIds([]);

    setTab("dashboard");
  }, [user]);

  useEffect(() => {
    if (!user) return;

    loadExpenses();
    loadBudget();
    loadBudgetHistory();
  }, [user, selectedMonth, selectedYear]);
 
  const showToast=(msg,type="success")=>setToast({msg,type});
 
  const addOrUpdate=async(data)=>{
    if (modal && modal._id) {
      await updateExpense(modal._id, data);
    } else {
      createExpense(data);
    }
    setModal(null);
  };

  const deleteExp=async(id)=>{
    await deleteExpense(id);
    showToast("Deleted","info");
  };

  const handleSaveBudget=async()=>{
    const b=Number(budgetInput)||0;
    setBudget(b);
    await persistBudget(b);
    showToast("Budget saved ✓","success");
  };

  const logout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setExpenses([]);
    setBudget(0);
    setAiIns([]);
  };
 
  const A=useAnalytics(expenses,budget,selectedMonth,selectedYear);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const isCurrentBudgetMonth = selectedMonth === currentMonth && selectedYear === currentYear;
  const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const handleSelectMonth = (monthIndex, year) => {
    setSelectedMonth(monthIndex);
    setSelectedYear(year);
  };

  const persistCustomGoals = (next) => {
  setCustomGoals(next);
};

const persistHiddenGoals = (next) => {
  setHiddenGoalIds(next);
};

  const removeCustomGoal = (id) => {
    const next = customGoals.filter(g => g.id !== id);
    persistCustomGoals(next);
    showToast("Goal removed", "info");
  };

  const removeGoal = (goal) => {
    if (goal.isCustom) {
      removeCustomGoal(goal.id);
      return;
    }
    if (!hiddenGoalIds.includes(goal.id)) {
      persistHiddenGoals([...hiddenGoalIds, goal.id]);
      showToast("Suggestion hidden", "info");
    }
  };
  
  // Get days in selected month
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const displayBudgetPct = A.budgetPct;
  const displayBudgetPctBar = A.budgetPctBar;
  const displayRemaining = A.remaining;
  const displayRemainingText = displayRemaining >= 0 ? fmt(displayRemaining) : `${fmt(Math.abs(displayRemaining))} over`;
  const displaySpent = fmt(A.currTotal);
  
  const savedAcrossMonths = useMemo(() => {
    if (!user) return 0;
    return budgetHistory.reduce((sum, record) => {
      const budgetVal = Number(record.amount || 0);
      if (budgetVal <= 0) return sum;
      const spent = expenses
        .filter((e) => {
          const d = new Date(e.date);
          return d.getFullYear() === record.year && d.getMonth() === record.month;
        })
        .reduce((s, e) => s + Number(e.amount || 0), 0);
      return sum + Math.max(0, budgetVal - spent);
    }, 0);
  }, [expenses, budgetHistory, user]);
  
  // Calculate previous month
  const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
  const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;

  const filteredExp=useMemo(()=>expenses.filter(e=>{
    const d = new Date(e.date);
    const selectedMonthOk = d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    const prevMonthOk = d.getMonth() === prevMonth && d.getFullYear() === prevYear;
    const monthOk = selectedMonthOk || prevMonthOk;
    const cOk=filterCat==="All"||e.category===filterCat;
    const sOk=!search||(e.notes||"").toLowerCase().includes(search.toLowerCase())||e.category.toLowerCase().includes(search.toLowerCase());
    return monthOk&&cOk&&sOk;
  }).sort((a,b)=>new Date(b.date)-new Date(a.date)),[expenses,filterCat,search,selectedMonth,selectedYear]);
 
  // Calculate week-wise data for previous month
  const prevMonthWeekwiseData = useMemo(() => {
    const prevMonthExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
    });
    
    const weekMap = {};
    prevMonthExpenses.forEach((e) => {
      if (!e.date) return;
      const weekNum = getWeekInMonth(e.date);
      const weekKey = `Week ${weekNum}`;
      if (!weekMap[weekKey]) {
        weekMap[weekKey] = {
          week: weekNum,
          transactions: [],
          total: 0,
          byCategory: {},
        };
      }
      weekMap[weekKey].transactions.push(e);
      weekMap[weekKey].total += Number(e.amount || 0);
      const cat = e.category;
      weekMap[weekKey].byCategory[cat] = (weekMap[weekKey].byCategory[cat] || 0) + Number(e.amount || 0);
    });
    
    return Object.values(weekMap).sort((a, b) => a.week - b.week);
  }, [expenses, prevMonth, prevYear]);

  const loadAI=async()=>{
    setAiLoading(true);
    try{
      // Mock AI analysis based on actual data
      const insights = [];
      const curr = A.curr; // Use selected month data from analytics

      // Insight 1: Spending trend
      if (A.prevTotal > 0) {
        const change = ((A.currTotal - A.prevTotal) / A.prevTotal * 100).toFixed(1);
        insights.push({
          icon: change > 0 ? "📈" : "📉",
          type: change > 10 ? "warning" : change < -10 ? "good" : "info",
          text: `Spending ${change > 0 ? "increased" : "decreased"} by ${Math.abs(change)}% vs last month (${fmt(A.prevTotal)} → ${fmt(A.currTotal)})`
        });
      }

      // Insight 2: Top category
      const topCat = Object.entries(A.currCat).sort((a,b)=>b[1]-a[1])[0];
      if (topCat && topCat[1] > 0) {
        const pct = Math.round((topCat[1] / A.currTotal) * 100);
        insights.push({
          icon: ICONS[topCat[0]],
          type: pct > 50 ? "warning" : "info",
          text: `${topCat[0]} dominates at ${pct}% of spending (${fmt(topCat[1])}) - consider optimizing this category`
        });
      }

      // Insight 3: Budget or savings advice
      if (budget > 0) {
        if (A.budgetPct >= 80) {
          insights.push({
            icon: "⚠️",
            type: "alert",
            text: `Budget alert: ${A.budgetPct}% used. Only ${fmt(budget - A.currTotal)} remaining - slow down spending!`
          });
        } else if (A.budgetPct < 50) {
          insights.push({
            icon: "💡",
            type: "good",
            text: `Great control! Only ${A.budgetPct}% of budget used. You're on track to save ${fmt(budget - A.currTotal)} this month`
          });
        }
      } else {
        insights.push({
          icon: "🎯",
          type: "info",
          text: `Set a monthly budget to unlock personalized savings goals and spending alerts`
        });
      }

      // Ensure exactly 3 insights
      while (insights.length < 3) {
        insights.push({
          icon: "💡",
          type: "info",
          text: `Track more expenses to get deeper AI insights about your spending patterns`
        });
      }

      setAiIns(insights.slice(0, 3));
    }catch(e){
      setAiIns([{icon:"⚠️",type:"info",text:"AI analysis unavailable right now. The pattern-based insights below are still accurate."}]);
    }
    setAiLoading(false);
  };
 
  const exportCSV=()=>{
    const rows=["Date,Category,Amount,Notes",...expenses.map(e=>`${e.date},${e.category},${e.amount},"${(e.notes||"").replace(/"/g,'""')}"`)] .join("\n");
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([rows],{type:"text/csv"}));
    a.download=`finance_${user.name.replace(/ /g,"_")}_${todayS()}.csv`;a.click();
    showToast("CSV exported","success");
  };
 
  if(!ready)return null;
  if(!user)return <AuthPage onAuth={u=>setUser(u)}/>;
 
  const TABS=[
    {id:"dashboard",label:"Dashboard",icon:"📊"},
    {id:"insights",label:"Insights",icon:"🧠"},
    {id:"savings",label:"Savings",icon:"💡"},
    {id:"predictions",label:"Predictions",icon:"🔮"},
    {id:"expenses",label:"Expenses",icon:"📋"},
    {id:"budget",label:"Budget",icon:"💰"}
  ];

  const savingsTips = [];

  if (expenses.length > 0) {
    if (A.budgetPct >= 80) {
      const diff = Math.round(budget - A.currTotal);
      const tip = diff >= 0 ? `You've used ${A.budgetPct}% of budget; try trimming non-essential spending by ₹${diff} to stay safe.` : `You've overspent by ₹${Math.abs(diff)}; reduce costs now to get back under budget.`;
      savingsTips.push({title: "Reduce monthly budget risk", detail: tip});
    }
    const topCat = Object.entries(A.currCat).sort((a,b)=>b[1]-a[1])[0];
    if (topCat && topCat[1] > 0) {
      const [cat,val] = topCat;
      savingsTips.push({title: `Target ${cat} spend`, detail: `Your ${cat} spend is ${Math.round((val/A.currTotal)*100)}% of this month. Aim to cut 15% and save ${fmt(Math.round(val*0.15))}/month.`});
    }
    if (A.avgDaily > 0) {
      savingsTips.push({title: "Limit micro transactions", detail: `You average ₹${Math.round(A.avgDaily)} per active day; avoid small extra spends under ₹200 to improve savings over time.`});
    }
    if (A.currCat.Food > 2500) {
      savingsTips.push({title: "Food spending control", detail: `Food expenses ₹${fmt(A.currCat.Food)} - consider meal prep and cheaper alternatives to save up to ₹${fmt(Math.round(A.currCat.Food * 0.2))} per month.`});
    }
    if (A.predicted > budget && budget > 0) {
      savingsTips.push({title: "Prepare for next month", detail: `Predicted next month ₹${fmt(A.predicted)} exceeds budget by ₹${fmt(A.predicted - budget)}. Shift 2-3 discretionary expenses to next month.`});
    }
  }

  return(
    <div className="aFadeIn" style={{minHeight:"100vh",background:"var(--bg)",width:"100%",position:"relative",overflow:"hidden"}}>
      <div className="blob" style={{width:260,height:260,top:80,left:-40,background:"rgba(94,234,212,.16)",pointerEvents:"none"}} />
      <div className="blob" style={{width:200,height:200,bottom:100,right:-30,background:"rgba(129,140,248,.16)",pointerEvents:"none"}} />
      {/* NAV */}
      <nav className="aFadeDown" style={{position:"sticky",top:0,zIndex:200,background:"rgba(7,9,15,.93)",backdropFilter:"blur(20px)",borderBottom:"1px solid var(--border)",padding:"0 20px",display:"flex",alignItems:"center",height:58,gap:12}}>
        <span style={{fontSize:22}}>💰</span>
        <span style={{fontWeight:900,fontSize:15,background:"linear-gradient(135deg,var(--accent),var(--accent2))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginRight:"auto"}}>SmartFinance</span>
        <span style={{fontSize:13,color:"var(--muted)"}} className="hide-sm">Hi, {user.name.split(" ")[0]} 👋</span>
        <button onClick={exportCSV} className="btn-ghost" style={{fontSize:12,padding:"6px 12px"}}>⬇ CSV</button>
        <button onClick={()=>setModal("add")} style={{padding:"7px 16px",borderRadius:10,background:"linear-gradient(135deg,var(--accent),var(--accent2))",color:"white",fontWeight:700,fontSize:13,boxShadow:"0 2px 12px rgba(79,158,255,.3)"}}>+ Add</button>
        <button onClick={logout} style={{padding:"7px 12px",borderRadius:10,background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.2)",color:"var(--red)",fontSize:13,fontWeight:600}}>Logout</button>
      </nav>
 
      {/* TABS */}
      <div className="aFadeUp" style={{position:"sticky",top:58,zIndex:190,width:"100%",background:"rgba(14,17,23,.85)",backdropFilter:"blur(12px)",borderBottom:"1px solid var(--border)",display:"flex",gap:2,overflowX:"auto"}}>
        {TABS.map((t)=>(
          <button key={t.id} className={`tab-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10,marginTop:16,marginBottom:4,alignItems:"center"}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"}}>
          <span style={{fontSize:13,color:"var(--muted)",fontWeight:700}}>Select month:</span>
          {A.monthly6.map((item,i)=>(
            <button key={`${item.month}-${item.year}-${i}`} className={`month-pill${selectedMonth===item.monthIndex&&selectedYear===item.year?" active":""}`} onClick={()=>handleSelectMonth(item.monthIndex,item.year)}>
              {item.month} {item.year}
            </button>
          ))}
        </div>
        <button onClick={()=>handleSelectMonth(currentMonth,currentYear)} className="btn-ghost" style={{fontSize:12,padding:"8px 16px"}}>Current month</button>
      </div>

      <div className="hero-panel aFadeUp" style={{maxWidth:1600,margin:"0 auto",marginTop:20,padding:"24px 28px",alignItems:"flex-start"}}>
        <div />
        <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"flex-end"}} />
      </div>

      <div style={{width:"100%",maxWidth:1600,margin:"0 auto",padding:"24px 24px 56px",transition:"all .3s ease"}}>
 
        {/* ═══ DASHBOARD ═══ */}
        {tab==="dashboard"&&(
          <div className="aFadeIn">
            {expenses.length===0?(
              <EmptyState image={heroImg} icon="📊" title="Welcome to SmartFinance!" sub="Add your first expense to see your personal financial dashboard with charts, insights, and predictions." action="+ Add First Expense" onAction={()=>setModal("add")}/>
            ):(
              <>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}} className="g4">
                  <StatCard label={`${MONTH_NAMES[selectedMonth]} ${selectedYear}`} value={fmt(A.currTotal)} sub={A.prevTotal>0?`${A.currTotal>A.prevTotal?"▲":"▼"} vs ${fmt(A.prevTotal)} prev mo.`:"First month!"} accent="var(--accent)" icon="💸" delay={0}/>
                  <StatCard label="Transactions" value={A.curr.length} sub={`in ${MONTH_NAMES[selectedMonth]}`} accent="var(--accent2)" icon="🧾" delay={.06}/>
                  <StatCard label="Daily Average" value={fmt(Math.round(A.currTotal/(daysInMonth||1)))} sub="₹ per day" accent="var(--orange)" icon="📅" delay={.12}/>
                  <StatCard label="Next Month Est." value={fmt(A.predicted)} sub="Moving avg" accent="var(--amber)" icon="🔮" delay={.18}/>
                </div>
 
                {budget>0&&(
                  <div className="card aFadeUp" style={{marginBottom:20,animationDelay:".22s"}}>
                    <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:10}}>
                      <div style={{fontWeight:700,fontSize:15}}>{MONTH_NAMES[selectedMonth]} Budget <span style={{fontSize:12,color:"var(--muted)",fontWeight:400}}>({fmt(budget)} total)</span></div>
                      <span style={{fontWeight:700,fontSize:14,color:A.budgetPct>=90?"var(--red)":A.budgetPct>=70?"var(--amber)":"var(--green)"}}>{A.budgetPct}% used · {displayRemaining >= 0 ? `${fmt(displayRemaining)} left` : `${fmt(Math.abs(displayRemaining))} over`}</span>
                    </div>
                    <div className="prog-bar"><div className="prog-fill progress-animate" style={{width:`${A.budgetPctBar}%`,background:A.budgetPct>=90?"linear-gradient(90deg,var(--red),#dc2626)":A.budgetPct>=70?"linear-gradient(90deg,var(--amber),var(--orange))":"linear-gradient(90deg,var(--accent),var(--green))"}}/></div>
                    {A.budgetPct>=80&&<p style={{fontSize:12,color:"var(--amber)",marginTop:8}}>⚠️ You've used {A.budgetPct}% of your monthly budget.</p>}
                  </div>
                )}
 
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}} className="g2">
                  <div className="card aFadeUp" style={{animationDelay:".26s"}}>
                    <h3 style={{fontSize:12,fontWeight:700,color:"var(--text)",marginBottom:14,textTransform:"uppercase",letterSpacing:"1px"}}>Daily Spending — {MONTH_NAMES[selectedMonth]} {selectedYear}</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={A.last14}>
                        <defs>
                          <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f9eff" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#4f9eff" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,.04)"/>
                        <XAxis dataKey="date" tick={{fill:"var(--text)",fontSize:10}}/>
                        <YAxis tick={{fill:"var(--text)",fontSize:10}} tickFormatter={v=>v>=1000?`₹${Math.round(v/1000)}k`:`₹${v}`} width={44}/>
                        <Tooltip content={<ChartTip/>}/>
                        <Area type="monotone" dataKey="amount" stroke="#4f9eff" strokeWidth={2} fill="url(#ag)" dot={{r:2,fill:"#4f9eff"}}/>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="card aFadeUp" style={{animationDelay:".3s"}}>
                    <h3 style={{fontSize:12,fontWeight:700,color:"var(--muted)",marginBottom:14,textTransform:"uppercase",letterSpacing:"1px"}}>Category Breakdown</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie data={Object.entries(A.currCat).filter(([,v])=>v>0).map(([k,v])=>({name:k,value:v}))} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                          {Object.entries(A.currCat).filter(([,v])=>v>0).map(([k],i)=><Cell key={i} fill={COLORS[k]}/>)}
                        </Pie>
                        <Tooltip formatter={v=>fmt(v)}/>
                        <Legend formatter={v=><span style={{color:"var(--muted)",fontSize:11}}>{ICONS[v]} {v}</span>}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
 
                <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:16,marginBottom:16}} className="g2">
                  <div className="card aFadeUp" style={{animationDelay:".34s"}}>
                    <h3 style={{fontSize:12,fontWeight:700,color:"var(--muted)",marginBottom:14,textTransform:"uppercase",letterSpacing:"1px"}}>6-Month Trend</h3>
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={A.monthly6}>
                        <defs><linearGradient id="bgrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4f9eff"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,.04)"/>
                        <XAxis dataKey="month" tick={{fill:"rgba(255,255,255,.3)",fontSize:11}}/>
                        <YAxis tick={{fill:"rgba(255,255,255,.3)",fontSize:10}} tickFormatter={v=>v>=1000?`₹${Math.round(v/1000)}k`:`₹${v}`} width={44}/>
                        <Tooltip content={<ChartTip/>}/>
                        <Bar dataKey="amount" radius={[5,5,0,0]}>
                          {A.monthly6.map((entry,i)=>(
                            <Cell key={i} fill={i===5?"url(#bgrad)":"rgba(79,158,255,.3)"} cursor="pointer" onClick={()=>handleSelectMonth(entry.monthIndex, entry.year)}/>
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="card aFadeUp" style={{animationDelay:".38s"}}>
                    <h3 style={{fontSize:12,fontWeight:700,color:"var(--muted)",marginBottom:14,textTransform:"uppercase",letterSpacing:"1px"}}>Top Categories</h3>
                    <div style={{display:"flex",flexDirection:"column",gap:12}}>
                      {Object.entries(A.currCat).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([cat,val])=>{
                        const pct=A.currTotal>0?Math.round(val/A.currTotal*100):0;
                        return(
                          <div key={cat}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:13}}>
                              <span>{ICONS[cat]} {cat}</span>
                              <span style={{fontFamily:"var(--mono)",fontWeight:700,color:COLORS[cat],fontSize:12}}>{fmt(val)} <span style={{color:"var(--muted)",fontWeight:400,fontSize:10}}>({pct}%)</span></span>
                            </div>
                            <div className="prog-bar" style={{height:4}}><div className="prog-fill" style={{width:`${pct}%`,background:COLORS[cat]}}/></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
 
                {A.insights.length>0&&(
                  <div className="card aFadeUp" style={{animationDelay:".42s"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                      <h3 style={{fontSize:14,fontWeight:700}}>🧠 Key Insights</h3>
                      <button onClick={()=>setTab("insights")} style={{background:"none",color:"var(--accent)",fontSize:12,fontWeight:600}}>See all →</button>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {A.insights.slice(0,3).map((ins,i)=><InsightCard key={i} {...ins} delay={i*.06}/>)}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
 
        {/* ═══ INSIGHTS ═══ */}
        {tab==="insights"&&(
          <div className="aFadeIn">
            {expenses.length===0?(
              <EmptyState image={heroImg} icon="🧠" title="No data to analyze yet" sub="Start tracking your expenses and come back here to discover powerful patterns in your spending habits." action="+ Add Expense" onAction={()=>setModal("add")}/>
            ):(
              <>
                <div style={{background:"linear-gradient(135deg,rgba(79,158,255,.05),rgba(167,139,250,.05))",border:"1px solid rgba(167,139,250,.2)",borderRadius:20,padding:24,marginBottom:20}} className="aFadeUp">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:aiIns.length?"18px":0}} className="aFadeUp d1">
                    <div><h2 style={{fontWeight:800,fontSize:18,marginBottom:4,color:"#ffffff"}}>🤖 AI-Powered Analysis</h2><p style={{fontSize:13,color:"var(--muted)"}}>Smart analysis of your spending patterns with personalized insights</p></div>
                    <button onClick={loadAI} disabled={aiLoading} className="btn-primary aFadeUp d2" style={{width:"auto",padding:"10px 22px",opacity:aiLoading?0.7:1}}>
                      {aiLoading?"⏳ Analyzing…":"✨ Run AI Analysis"}
                    </button>
                  </div>
                  {aiIns.length>0&&<div style={{display:"flex",flexDirection:"column",gap:8}} className="aFadeUp d3">{aiIns.map((ins,i)=><InsightCard key={i} {...ins} delay={i*.08}/>)}</div>}
                </div>
 
                <h3 style={{fontSize:15,fontWeight:700,marginBottom:12}} className="aFadeUp d4">📊 Pattern Analysis</h3>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}} className="aFadeUp d5">
                  {A.insights.map((ins,i)=><InsightCard key={i} {...ins} delay={i*.04}/>)}
                </div>
 
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}} className="g2">
                  <div className="card aFadeUp" style={{animationDelay:".34s"}}>
                    <h3 style={{fontSize:12,fontWeight:700,color:"var(--muted)",marginBottom:14,textTransform:"uppercase",letterSpacing:"1px"}}>Spending by Day of Week</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d,i)=>({day:d,amount:A.dotw[i]}))}>
                        <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,.04)"/>
                        <XAxis dataKey="day" tick={{fill:"rgba(255,255,255,.3)",fontSize:11}}/>
                        <YAxis tick={{fill:"rgba(255,255,255,.3)",fontSize:10}} tickFormatter={v=>v>=1000?`₹${Math.round(v/1000)}k`:`₹${v}`} width={42}/>
                        <Tooltip content={<ChartTip/>}/>
                        <Bar dataKey="amount" radius={[4,4,0,0]}>{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((_,i)=><Cell key={i} fill={[0,6].includes(i)?"#f87171":"#4f9eff"}/>)}</Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <p style={{textAlign:"center",fontSize:11,color:"var(--muted)",marginTop:8}}>🔴 Weekend &nbsp;🔵 Weekday</p>
                  </div>

                  <div className="card aFadeUp" style={{animationDelay:".38s"}}>
                    <h3 style={{fontSize:12,fontWeight:700,color:"var(--muted)",marginBottom:14,textTransform:"uppercase",letterSpacing:"1px"}}>Behavior Profile</h3>
                    <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}} className="aFadeUp d1">
                      {[
                        A.curr.filter(e=>e.category==="Food").length>8&&{label:"🍔 Food Lover",c:"var(--orange)"},
                        A.curr.filter(e=>e.category==="Shopping").length>4&&{label:"🛍️ Frequent Shopper",c:"var(--accent2)"},
                        A.curr.filter(e=>e.amount<300).length>6&&{label:"💳 Micro-spender",c:"var(--amber)"},
                        A.curr.filter(e=>e.category==="Travel").length>3&&{label:"✈️ Active Traveller",c:"var(--cyan)"},
                        A.budgetPct>=80&&{label:"⚠️ Budget Risk",c:"var(--red)"},
                        A.budgetPct>0&&A.budgetPct<50&&{label:"✅ Budget Disciplined",c:"var(--green)"},
                        A.curr.filter(e=>isWE(e.date)).length>A.curr.length*.4&&{label:"🎉 Weekend Spender",c:"var(--accent)"},
                      ].filter(Boolean).map((b,i)=>(
                        <span key={i} className="badge aFadeUp" style={{background:`${b.c}12`,color:b.c,borderColor:`${b.c}30`,animationDelay:`${i*0.1}s`}}>{b.label}</span>
                      ))}
                      {A.curr.length<3&&<p style={{color:"var(--muted)",fontSize:13}}>Add more expenses to unlock your behavior profile.</p>}
                    </div>
                    {A.currCat.Food>3000&&(
                      <div style={{background:"rgba(52,211,153,.06)",border:"1px solid rgba(52,211,153,.2)",borderRadius:12,padding:14}} className="aFadeUp d2">
                        <p style={{fontSize:13,color:"#d1d5db",fontWeight:700}}>💡 Savings Opportunity</p>
                        <p style={{fontSize:12,color:"rgba(52,211,153,.75)",marginTop:4,lineHeight:1.6}}>Reduce food by 20% → Save {fmt(Math.round(A.currCat.Food*.2))}/mo = <strong>{fmt(Math.round(A.currCat.Food*.2*12))}/year</strong></p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
 
        {/* ═══ SAVINGS SUGGESTIONS ═══ */}
        {tab==="savings"&&(
          <div className="aFadeIn">
            {expenses.length===0? (
              <EmptyState image={heroImg} icon="💡" title="No expenses yet" sub="Add expenses first to generate personalized savings advice." action="+ Add Expense" onAction={()=>setModal("add")}/>
            ) : (
              <>
                {/* Savings Calculator & Goals */}
                {(() => {
                  const savedThisMonth = Math.max(0, budget - A.currTotal);
                  const monthsTracked = budgetHistory.length || 1;
                  const avgSavedPerBudgetedMonth = Math.round(savedAcrossMonths / monthsTracked);
                  const motivationalGoals = [
                    { id: "motivational_budget_dinner", amount: 500, label: "Budget dinner night", emoji: "🍽️", isCustom: false },
                    { id: "motivational_movie_weekend", amount: 1000, label: "Movie weekend", emoji: "🎬", isCustom: false },
                    { id: "motivational_weekend_getaway", amount: 2500, label: "Weekend getaway", emoji: "🏖️", isCustom: false },
                    { id: "motivational_shopping_spree", amount: 5000, label: "Shopping spree", emoji: "🛍️", isCustom: false },
                    { id: "motivational_dream_vacation", amount: 10000, label: "Dream vacation", emoji: "✈️", isCustom: false }
                  ];
                  const allGoals = [
                    ...customGoals.map((goal) => ({
                      amount: Number(goal.target) || savedThisMonth,
                      label: goal.title,
                      emoji: "⭐",
                      id: goal.id,
                      isCustom: true
                    })),
                    ...motivationalGoals.filter((goal) => !hiddenGoalIds.includes(goal.id))
                  ];
                  
                  const addCustomGoal = () => {
                    const title = customGoalTitle.trim();
                    const target = Number(customGoalTarget);
                    if (!title) {
                      showToast("Enter a custom goal title", "info");
                      return;
                    }
                    if (!target || target <= 0) {
                      showToast("Enter a valid target amount", "info");
                      return;
                    }
                    const newGoal = { id: uid(), title, target };
                    persistCustomGoals([newGoal, ...customGoals]);
                    setCustomGoalTitle("");
                    setCustomGoalTarget("");
                    showToast("Custom savings goal added", "success");
                  };
                  
                  return (
                    <>
<div className="card aFadeUp" style={{background:"linear-gradient(135deg,rgba(52,211,153,.08),rgba(34,211,238,.08))",border:"1px solid rgba(52,211,153,.2)",borderRadius:22,padding:32,marginBottom:24,position:"relative",overflow:"hidden"}}>
                        <div style={{position:"absolute",top:-20,right:-20,fontSize:100,opacity:0.08}}>💰</div>
                        <div style={{position:"relative",zIndex:1}}>
                          <p style={{fontSize:12,color:"var(--muted)",marginBottom:12,textTransform:"uppercase",letterSpacing:"1px",fontWeight:600}}>🏦 Saved Money</p>
                          <div style={{fontSize:56,fontWeight:900,fontFamily:"var(--mono)",color:"var(--green)",letterSpacing:"-2px",marginBottom:16}}>₹{fmt(savedAcrossMonths)}</div>
                          <p style={{fontSize:14,color:"#d1d5db",lineHeight:1.6,marginBottom:16}}>Actual total saved money from budgeted months only. This excludes potential or projected savings.</p>
                          <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:12,marginTop:16}}>
                            <div style={{background:"rgba(255,255,255,.05)",borderRadius:14,padding:16}}>
                              <div style={{fontSize:12,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"1px"}}>This month saved</div>
                              <div style={{fontSize:24,fontWeight:800,color:"var(--green)"}}>₹{fmt(savedThisMonth)}</div>
                            </div>
                            <div style={{background:"rgba(255,255,255,.05)",borderRadius:14,padding:16}}>
                              <div style={{fontSize:12,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"1px"}}>Avg saved per budget month</div>
                              <div style={{fontSize:24,fontWeight:800,color:"var(--green)"}}>₹{fmt(avgSavedPerBudgetedMonth)}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Custom Savings Goal Input */}
                      <div className="card aFadeUp" style={{padding:24,marginBottom:24,display:"grid",gap:14,border:"1px solid rgba(255,255,255,.08)"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                          <div>
                            <p style={{fontSize:12,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:6,fontWeight:700}}>🎯 Add Your Own Savings Goal</p>
                            <h4 style={{fontSize:18,fontWeight:800,color:"#ffffff",margin:0}}>Personalize your goal title and amount</h4>
                          </div>
                          <button className="btn-primary" onClick={addCustomGoal} style={{minWidth:160}}>Save Goal</button>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:12,flexWrap:"wrap"}}>
                          <input
                            value={customGoalTitle}
                            onChange={(e)=>setCustomGoalTitle(e.target.value)}
                            placeholder="Dream holiday, budget dinner night..."
                            style={{padding:14,borderRadius:14,border:"1px solid rgba(255,255,255,.12)",background:"rgba(255,255,255,.04)",color:"#fff",outline:"none",fontSize:14,width:"100%"}}
                          />
                          <input
                            value={customGoalTarget}
                            onChange={(e)=>setCustomGoalTarget(e.target.value)}
                            placeholder="Target amount"
                            type="number"
                            style={{padding:14,borderRadius:14,border:"1px solid rgba(255,255,255,.12)",background:"rgba(255,255,255,.04)",color:"#fff",outline:"none",fontSize:14,width:"100%"}}
                          />
                        </div>
                      </div>

                      {customGoals.length > 0 && (
                        <div className="card aFadeUp" style={{padding:20,marginBottom:24,border:"1px solid rgba(255,255,255,.08)"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                            <div>
                              <p style={{fontSize:12,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"1px",margin:0,fontWeight:700}}>Saved Goals</p>
                              <h4 style={{fontSize:16,fontWeight:800,color:"#ffffff",margin:0}}>{customGoals.length} custom goal{customGoals.length === 1 ? "" : "s"}</h4>
                            </div>
                          </div>
                          <div style={{display:"grid",gap:12}}>
                            {customGoals.map((goal)=> (
                              <div key={goal.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:14,background:"rgba(255,255,255,.05)",borderRadius:14}}>
                                <div>
                                  <div style={{fontSize:14,fontWeight:700,color:"#ffffff"}}>{goal.title}</div>
                                  <div style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Target ₹{fmt(goal.target)}</div>
                                </div>
                                <button
                                  onClick={()=>removeCustomGoal(goal.id)}
                                  style={{padding:"8px 14px",borderRadius:12,border:"1px solid rgba(255,255,255,.16)",background:"rgba(255,255,255,.08)",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:700}}
                                >
                                  Delete
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* What You Could Achieve */}
                      <h3 style={{fontSize:15,fontWeight:700,marginBottom:16,color:"#ffffff"}}>🎯 What You Could Achieve With These Savings</h3>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginBottom:24}}>
                        {allGoals.map((goal,i)=>{
                          const percent = goal.amount > 0 ? Math.min(100, Math.round((savedAcrossMonths / goal.amount) * 100)) : 0;
                          const achievable = savedAcrossMonths >= goal.amount;
                          return (
                            <div key={goal.id || `${goal.label}-${i}`} className="card aFadeUp" style={{animationDelay:`${i*0.08}s`,position:"relative",overflow:"hidden",borderLeft:`4px solid ${achievable?"var(--green)":"rgba(255,255,255,.1)"}`}}>
                              <button
                                onClick={()=>removeGoal(goal)}
                                style={{position:"absolute",top:12,right:12,padding:"8px 12px",border:"1px solid rgba(248,113,113,.45)",borderRadius:999,background:"rgba(248,113,113,.18)",color:"#fee2e2",cursor:"pointer",fontSize:12,fontWeight:700,backdropFilter:"blur(4px)"}}
                                title="Remove savings goal"
                                aria-label={`Remove savings goal ${goal.label}`}
                              >
                                Remove
                              </button>
                              <div style={{fontSize:32,marginBottom:8}}>{goal.emoji}</div>
                              <h4 style={{fontSize:14,fontWeight:800,marginBottom:4,color:"#ffffff"}}>{goal.label}</h4>
                              <p style={{fontSize:12,color:"var(--muted)",marginBottom:12}}>Needs ₹{fmt(goal.amount)}</p>
                              <div style={{background:"rgba(255,255,255,.05)",borderRadius:8,height:8,overflow:"hidden"}}>
                                <div style={{background:achievable?"linear-gradient(90deg,var(--green),var(--cyan))":"rgba(251,191,36,.5)",height:"100%",width:`${percent}%`,transition:"width 0.3s ease"}}></div>
                              </div>
                              <p style={{fontSize:11,color:achievable?"var(--green)":"var(--muted)",marginTop:8,fontWeight:600}}>{percent}% achievable monthly</p>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Savings Tips */}
                      {savingsTips.length > 0 && (
                        <>
                          <h3 style={{fontSize:15,fontWeight:700,marginBottom:16,color:"#ffffff"}}>💡 Personalized Tips</h3>
                          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:14}}>
                            {savingsTips.map((tip,i)=>(
                              <div key={i} className="card aFadeUp" style={{padding:20,animationDelay:`${i*0.06}s`,borderTop:`3px solid var(--cyan)`}}>
                                <h4 style={{fontSize:15,fontWeight:800,marginBottom:8}}>{tip.title}</h4>
                                <p style={{color:"#d1d5db",fontSize:13,lineHeight:1.4}}>{tip.detail}</p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      
                      {savingsTips.length === 0 && savedAcrossMonths === 0 && (
                        <div className="card" style={{padding:20,textAlign:"center",background:"linear-gradient(135deg,rgba(34,211,238,.05),rgba(129,140,248,.05))",border:"1px solid rgba(129,140,248,.2)"}}>
                          <h3 style={{fontSize:16,fontWeight:700,marginBottom:8,color:"#ffffff"}}>You're already optimized 🎉</h3>
                          <p style={{color:"var(--muted)",fontSize:13}}>Your spending looks balanced. Continue tracking and this section will produce advanced savings actions.</p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </>
            )}
          </div>
        )}

        {/* ═══ PREDICTIONS ═══ */}
        {tab==="predictions"&&(
          <div className="aFadeIn">
            {A.predicted===0?(
              <EmptyState image={heroImg} icon="🔮" title="Need more data for predictions" sub="Keep tracking for 2+ months and the prediction engine will forecast your future spending automatically."/>
            ):(
              <>
                <div style={{background:"linear-gradient(135deg,rgba(251,191,36,.05),rgba(251,146,60,.05))",border:"1px solid rgba(251,191,36,.2)",borderRadius:22,padding:32,marginBottom:20,textAlign:"center",position:"relative",overflow:"hidden"}} className="aFadeUp">
                  <div style={{position:"absolute",top:20,right:20,fontSize:60,opacity:0.1}}>🔮</div>
                  <p style={{fontSize:12,color:"var(--muted)",marginBottom:8,textTransform:"uppercase",letterSpacing:"1px"}}>Predicted Next Month Total</p>
                  <div style={{fontSize:56,fontWeight:900,fontFamily:"var(--mono)",background:"linear-gradient(135deg,var(--amber),var(--orange))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"-2px"}}>{fmt(A.predicted)}</div>
                  <p style={{fontSize:13,color:"var(--muted)",marginTop:8}}>Based on moving average of recent months</p>
                  {budget>0&&A.predicted>budget&&<div style={{display:"inline-block",marginTop:16,background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.25)",borderRadius:12,padding:"10px 20px",fontSize:13,fontWeight:600,color:"var(--red)"}}>⚠️ Predicted {fmt(A.predicted-budget)} over your {fmt(budget)} budget</div>}
                  {budget>0&&A.predicted<=budget&&<div style={{display:"inline-block",marginTop:16,background:"rgba(52,211,153,.08)",border:"1px solid rgba(52,211,153,.25)",borderRadius:12,padding:"10px 20px",fontSize:13,fontWeight:600,color:"var(--green)"}}>✅ Predicted within budget — {fmt(budget-A.predicted)} to spare</div>}
                </div>
 
                <h3 style={{fontSize:15,fontWeight:700,marginBottom:12}}>Category Forecasts</h3>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}} className="g3">
                  {A.catPred.map(({cat,avg,dir},i)=>(
                    <div key={cat} className="card aFadeUp" style={{textAlign:"center",animationDelay:`${i*0.1}s`}}>
                      <div style={{fontSize:28,marginBottom:8}}>{ICONS[cat]}</div>
                      <div style={{fontFamily:"var(--mono)",fontWeight:800,fontSize:20,color:COLORS[cat]}}>{fmt(avg)}</div>
                      <div style={{fontSize:12,color:"var(--muted)",marginBottom:8}}>{cat}</div>
                      <span className="badge" style={{background:dir==="up"?"rgba(248,113,113,.1)":dir==="down"?"rgba(52,211,153,.1)":"rgba(255,255,255,.06)",color:dir==="up"?"var(--red)":dir==="down"?"var(--green)":"var(--muted)",borderColor:dir==="up"?"rgba(248,113,113,.3)":dir==="down"?"rgba(52,211,153,.3)":"rgba(255,255,255,.08)",fontSize:10,margin:"0 auto"}}>
                        {dir==="up"?"↑ Rising":dir==="down"?"↓ Falling":"→ Stable"}
                      </span>
                    </div>
                  ))}
                </div>
 
                <div className="card">
                  <h3 style={{fontSize:12,fontWeight:700,color:"var(--muted)",marginBottom:14,textTransform:"uppercase",letterSpacing:"1px"}}>Spending Trajectory</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={[...A.monthly6,{month:"Next*",amount:A.predicted}]}>
                      <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#fbbf24" stopOpacity={0.25}/><stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,.04)"/>
                      <XAxis dataKey="month" tick={{fill:"rgba(255,255,255,.3)",fontSize:11}}/>
                      <YAxis tick={{fill:"rgba(255,255,255,.3)",fontSize:10}} tickFormatter={v=>v>=1000?`₹${Math.round(v/1000)}k`:`₹${v}`} width={44}/>
                      <Tooltip content={<ChartTip/>}/>
                      <Area type="monotone" dataKey="amount" stroke="#fbbf24" strokeWidth={2.5} fill="url(#tg)" dot={{r:3,fill:"#fbbf24"}}/>
                    </AreaChart>
                  </ResponsiveContainer>
                  <p style={{textAlign:"center",fontSize:11,color:"var(--muted)",marginTop:8}}>* "Next" bar is the AI-predicted value</p>
                </div>
              </>
            )}
          </div>
        )}
 
        {/* ═══ EXPENSES ═══ */}
        {tab==="expenses"&&(
          <div className="aFadeIn">
            <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
              <div style={{flex:"1 1 200px",position:"relative"}}>
                <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,pointerEvents:"none"}}>🔍</span>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by notes or category…" style={{paddingLeft:36}}/>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {["All",...CATS].map(c=>(
                  <button key={c} onClick={()=>setFilterCat(c)} style={{padding:"7px 14px",borderRadius:99,fontSize:12,fontWeight:700,transition:"all .15s",background:filterCat===c?(c==="All"?"rgba(79,158,255,.15)":CAT_BG[c]):"transparent",color:filterCat===c?(c==="All"?"var(--accent)":COLORS[c]):"var(--muted)",border:`1px solid ${filterCat===c?(c==="All"?"rgba(79,158,255,.3)":COLORS[c]+"40"):"rgba(255,255,255,.08)"}`}}>
                    {c!=="All"&&ICONS[c]} {c}
                  </button>
                ))}
              </div>
              <button onClick={()=>setModal("add")} className="btn-primary" style={{width:"auto",padding:"8px 20px",fontSize:13}}>+ Add</button>
            </div>
 
            {filteredExp.length>0&&(
              <div style={{display:"flex",gap:12,marginBottom:12,fontSize:13,color:"var(--muted)",alignItems:"center",flexWrap:"wrap"}}>
                <span>{filteredExp.length} transaction{filteredExp.length!==1?"s":""} from {MONTH_NAMES[selectedMonth]} {selectedYear} & {MONTH_NAMES[prevMonth]} {prevYear} from {MONTH_NAMES[selectedMonth]} {selectedYear} & {MONTH_NAMES[prevMonth]} {prevYear}</span>
                <span>·</span>
                <span style={{color:"var(--text)",fontFamily:"var(--mono)",fontWeight:700}}>{fmt(filteredExp.reduce((a,b)=>a+b.amount,0))}</span>
                <span>total</span>
              </div>
            )}
 
            {filteredExp.length===0?(
              <EmptyState image={heroImg} icon="📋" title={expenses.length===0?"No expenses yet":"No matches found"} sub={expenses.length===0?"Tap + Add to record your first expense — no sample data here, just yours!":"Try adjusting your search or filter."} action={expenses.length===0?"+ Add First Expense":null} onAction={()=>setModal("add")}/>
            ):(
              <>
                <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:32}}>
                  {filteredExp.map((exp,i)=>(
                    <div key={exp._id} className="exp-row aFadeUp" style={{animationDelay:`${Math.min(i,15)*.03}s`}}>
                      <div style={{width:42,height:42,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,background:CAT_BG[exp.category],flexShrink:0}}>{ICONS[exp.category]}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:600,fontSize:14,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{exp.notes||exp.category}</div>
                        <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{exp.date} · <span style={{color:COLORS[exp.category]}}>{exp.category}</span></div>
                      </div>
                      <div style={{fontFamily:"var(--mono)",fontWeight:800,fontSize:16,color:COLORS[exp.category],flexShrink:0}}>{fmt(exp.amount)}</div>
                      <div style={{display:"flex",gap:6,flexShrink:0}}>
                        <button onClick={()=>setModal(exp)} style={{padding:"6px 10px",borderRadius:8,background:"rgba(79,158,255,.08)",border:"1px solid rgba(79,158,255,.15)",color:"var(--accent)",fontSize:13,transition:"all .15s"}}>✏️</button>
                        <button onClick={()=>deleteExp(exp._id)} style={{padding:"6px 10px",borderRadius:8,background:"rgba(248,113,113,.06)",border:"1px solid rgba(248,113,113,.15)",color:"var(--red)",fontSize:13,transition:"all .15s"}}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 style={{fontSize:14,fontWeight:700,marginBottom:16,color:"var(--text)"}}>📅 Week-wise Breakdown</h3>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {/* Current Month Weeks */}
                  {A.weekwiseData.map((week,wi)=>{
                    const weekExp = week.transactions.filter(e=>{
                      const cOk=filterCat==="All"||e.category===filterCat;
                      const sOk=!search||(e.notes||"").toLowerCase().includes(search.toLowerCase())||e.category.toLowerCase().includes(search.toLowerCase());
                      return cOk&&sOk;
                    }).sort((a,b)=>new Date(b.date)-new Date(a.date));
                    
                    if(weekExp.length===0) return null;
                    
                    return(
                      <div key={`curr-week-${week.week}`} className="card aFadeUp" style={{animationDelay:`${wi*0.1}s`,overflow:"hidden"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",background:"rgba(79,158,255,.05)",borderBottom:"1px solid var(--border)",cursor:"pointer"}} className="week-header">
                          <div>
                            <h4 style={{fontSize:14,fontWeight:700,marginBottom:2}}>📍 {MONTH_NAMES[selectedMonth]} - {week.week===1?`1st Week`:week.week===2?`2nd Week`:week.week===3?`3rd Week`:`${week.week}th Week`}</h4>
                            <span style={{fontSize:12,color:"var(--muted)"}}>{weekExp.length} transaction{weekExp.length!==1?"s":""} · {fmt(week.transactions.filter(e=>{
                              const cOk=filterCat==="All"||e.category===filterCat;
                              const sOk=!search||(e.notes||"").toLowerCase().includes(search.toLowerCase())||e.category.toLowerCase().includes(search.toLowerCase());
                              return cOk&&sOk;
                            }).reduce((a,b)=>a+b.amount,0))}</span>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div style={{fontFamily:"var(--mono)",fontWeight:800,fontSize:16,color:"var(--accent)"}}>{fmt(week.transactions.filter(e=>{
                              const cOk=filterCat==="All"||e.category===filterCat;
                              const sOk=!search||(e.notes||"").toLowerCase().includes(search.toLowerCase())||e.category.toLowerCase().includes(search.toLowerCase());
                              return cOk&&sOk;
                            }).reduce((a,b)=>a+b.amount,0))}</div>
                            <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{budget>0?`${Math.round(week.transactions.filter(e=>{
                              const cOk=filterCat==="All"||e.category===filterCat;
                              const sOk=!search||(e.notes||"").toLowerCase().includes(search.toLowerCase())||e.category.toLowerCase().includes(search.toLowerCase());
                              return cOk&&sOk;
                            }).reduce((a,b)=>a+b.amount,0)/budget*100)}% of monthly budget`:`Average/week`}</div>
                          </div>
                        </div>
                        <div style={{padding:"0"}}>
                          {weekExp.map((exp,ei)=>(
                            <div key={exp._id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:ei<weekExp.length-1?"1px solid var(--border)":"none",transition:"all .15s",cursor:"pointer"}} className="exp-week-item" onMouseEnter={e=>e.currentTarget.style.background="rgba(79,158,255,.03)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                              <div style={{width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,background:CAT_BG[exp.category],flexShrink:0}}>{ICONS[exp.category]}</div>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{fontWeight:600,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{exp.notes||exp.category}</div>
                                <div style={{fontSize:10,color:"var(--muted)",marginTop:1}}>{exp.date}</div>
                              </div>
                              <div style={{fontFamily:"var(--mono)",fontWeight:700,fontSize:14,color:COLORS[exp.category],flexShrink:0}}>{fmt(exp.amount)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Previous Month Weeks */}
                  {prevMonthWeekwiseData.map((week,wi)=>{
                    const weekExp = week.transactions.filter(e=>{
                      const cOk=filterCat==="All"||e.category===filterCat;
                      const sOk=!search||(e.notes||"").toLowerCase().includes(search.toLowerCase())||e.category.toLowerCase().includes(search.toLowerCase());
                      return cOk&&sOk;
                    }).sort((a,b)=>new Date(b.date)-new Date(a.date));
                    
                    if(weekExp.length===0) return null;
                    
                    return(
                      <div key={`prev-week-${week.week}`} className="card aFadeUp" style={{animationDelay:`${(A.weekwiseData.length + wi)*0.1}s`,overflow:"hidden"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",background:"rgba(156,163,175,.05)",borderBottom:"1px solid var(--border)",cursor:"pointer"}} className="week-header">
                          <div>
                            <h4 style={{fontSize:14,fontWeight:700,marginBottom:2}}>📍 {MONTH_NAMES[prevMonth]} - {week.week===1?`1st Week`:week.week===2?`2nd Week`:week.week===3?`3rd Week`:`${week.week}th Week`}</h4>
                            <span style={{fontSize:12,color:"var(--muted)"}}>{weekExp.length} transaction{weekExp.length!==1?"s":""} · {fmt(week.transactions.filter(e=>{
                              const cOk=filterCat==="All"||e.category===filterCat;
                              const sOk=!search||(e.notes||"").toLowerCase().includes(search.toLowerCase())||e.category.toLowerCase().includes(search.toLowerCase());
                              return cOk&&sOk;
                            }).reduce((a,b)=>a+b.amount,0))}</span>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div style={{fontFamily:"var(--mono)",fontWeight:800,fontSize:16,color:"var(--text-secondary)"}}>{fmt(week.transactions.filter(e=>{
                              const cOk=filterCat==="All"||e.category===filterCat;
                              const sOk=!search||(e.notes||"").toLowerCase().includes(search.toLowerCase())||e.category.toLowerCase().includes(search.toLowerCase());
                              return cOk&&sOk;
                            }).reduce((a,b)=>a+b.amount,0))}</div>
                            <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>Previous month</div>
                          </div>
                        </div>
                        <div style={{padding:"0"}}>
                          {weekExp.map((exp,ei)=>(
                            <div key={exp._id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:ei<weekExp.length-1?"1px solid var(--border)":"none",transition:"all .15s",cursor:"pointer"}} className="exp-week-item" onMouseEnter={e=>e.currentTarget.style.background="rgba(79,158,255,.03)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                              <div style={{width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,background:CAT_BG[exp.category],flexShrink:0}}>{ICONS[exp.category]}</div>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{fontWeight:600,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{exp.notes||exp.category}</div>
                                <div style={{fontSize:10,color:"var(--muted)",marginTop:1}}>{exp.date}</div>
                              </div>
                              <div style={{fontFamily:"var(--mono)",fontWeight:700,fontSize:14,color:COLORS[exp.category],flexShrink:0}}>{fmt(exp.amount)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
 
        {/* ═══ BUDGET ═══ */}
        {tab==="budget"&&(
          <div className="aFadeIn">
            <div className="card aFadeUp" style={{marginBottom:20}}>
              <h2 style={{fontWeight:800,fontSize:18,marginBottom:4}}>
                💰 {[
                  "January","February","March","April","May","June",
                  "July","August","September","October","November","December"
                ][selectedMonth]} {selectedYear} Budget
              </h2>
              <p style={{fontSize:13,color:"var(--muted)",marginBottom:20}}>Set your monthly spending limit and SmartFinance will alert you when you're approaching it.</p>

              {/* Month Selector */}
              <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end",marginBottom:20}}>
                <div style={{flex:"1 1 150px"}}>
                  <label className="input-lbl">Month</label>
                  <select value={selectedMonth} onChange={e=>setSelectedMonth(Number(e.target.value))} style={{width:"100%"}}>
                    {[
                      "January","February","March","April","May","June",
                      "July","August","September","October","November","December"
                    ].map((month,i)=>(
                      <option key={i} value={i}>{month}</option>
                    ))}
                  </select>
                </div>
                <div style={{flex:"1 1 120px"}}>
                  <label className="input-lbl">Year</label>
                  <select value={selectedYear} onChange={e=>setSelectedYear(Number(e.target.value))} style={{width:"100%"}}>
                    {[2024,2025,2026,2027,2028].map(year=>(
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
                <div style={{flex:"1 1 200px"}}>
                  <label className="input-lbl">Monthly Budget (₹)</label>
                  <div style={{position:"relative"}}>
                    <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontFamily:"var(--mono)",fontWeight:700,color:"var(--accent)"}}>₹</span>
                    <input type="number" value={budgetInput} onChange={e=>setBudgetInput(e.target.value)} placeholder="e.g. 25000" style={{paddingLeft:28,fontFamily:"var(--mono)",fontSize:17,fontWeight:700}} onKeyDown={e=>e.key==="Enter"&&handleSaveBudget()}/>
                  </div>
                </div>
                <button className="btn-primary" onClick={handleSaveBudget} style={{width:"auto",padding:"11px 28px",flexShrink:0}}>Save Budget</button>
                {budget>0&&<button className="btn-ghost" onClick={async()=>{setBudget(0);setBudgetInput("");await persistBudget(0);showToast("Budget cleared","info");}}>Clear</button>}
              </div>
            </div>
 
            {budget>0?(
              <>
                <div style={{background:displayBudgetPct>=90?"rgba(248,113,113,.05)":displayBudgetPct>=70?"rgba(251,191,36,.05)":"rgba(52,211,153,.05)",border:`1px solid ${displayBudgetPct>=90?"rgba(248,113,113,.2)":displayBudgetPct>=70?"rgba(251,191,36,.2)":"rgba(52,211,153,.2)"}`,borderRadius:22,padding:32,marginBottom:20,textAlign:"center",position:"relative",overflow:"hidden"}} className="aFadeUp d1">
                  <div style={{position:"absolute",top:20,right:20,fontSize:60,opacity:0.1}}>💰</div>
                  <div style={{fontSize:56,fontWeight:900,fontFamily:"var(--mono)",color:displayBudgetPct>=90?"var(--red)":displayBudgetPct>=70?"var(--amber)":"var(--green)",letterSpacing:"-1px"}}>{displayBudgetPct}<span style={{fontSize:28,fontWeight:500}}>%</span></div>
                  <p style={{color:"var(--muted)",fontSize:14,marginTop:4}}>
                    of selected month's budget used
                  </p>
                  <div style={{maxWidth:400,margin:"20px auto"}} className="aFadeUp d2">
                    <div className="prog-bar" style={{height:10}}>
                      <div className="prog-fill progress-animate" style={{
                        width:`${displayBudgetPctBar}%`,
                        background:displayBudgetPct>=90?"linear-gradient(90deg,var(--red),#dc2626)":displayBudgetPct>=70?"linear-gradient(90deg,var(--amber),var(--orange))":"linear-gradient(90deg,var(--accent),var(--green))"
                      }}/>
                    </div>
                  </div>
                  <div style={{display:"flex",justifyContent:"center",gap:40,flexWrap:"wrap"}} className="aFadeUp d3">
                    {[["Spent",displaySpent,"var(--red)"],["Remaining",displayRemainingText,"var(--green)"],["Budget",fmt(budget),"var(--muted)"]].map(([l,v,c])=>(
                      <div key={l}><div style={{fontFamily:"var(--mono)",fontWeight:800,fontSize:22,color:c}}>{v}</div><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{l}</div></div>
                    ))}
                  </div>
                </div>

                {selectedMonth === new Date().getMonth() && selectedYear === new Date().getFullYear() && (
                  <>
                    <h3 style={{fontSize:15,fontWeight:700,marginBottom:12}} className="aFadeUp d4">📊 Week-wise Budget Distribution</h3>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:20}} className="aFadeUp d5">
                      {A.weekwiseData.map((week,wi)=>{
                        const weekBudget = budget/4;
                        const spent = week.transactions.reduce((a,b)=>a+Number(b.amount||0),0);
                        const pct = Math.min(100, Math.round((spent/weekBudget)*100));
                        return(
                          <div key={`w-${week.week}`} style={{background:"rgba(79,158,255,.03)",border:"1px solid var(--border)",borderRadius:14,padding:14,textAlign:"center"}}>
                            <div style={{fontWeight:700,fontSize:13,marginBottom:8}}>Week {week.week}</div>
                            <div style={{fontFamily:"var(--mono)",fontWeight:800,fontSize:16,color:pct>=100?"var(--red)":pct>=80?"var(--amber)":"var(--green)",marginBottom:8}}>{fmt(spent)}</div>
                            <div style={{height:3,background:"rgba(255,255,255,.08)",borderRadius:99,overflow:"hidden",marginBottom:6}}>
                              <div style={{height:"100%",width:`${pct}%`,background:pct>=100?"linear-gradient(90deg,var(--red),#dc2626)":pct>=80?"linear-gradient(90deg,var(--amber),var(--orange))":"linear-gradient(90deg,var(--accent),var(--green))",transition:"all .3s"}}/>
                            </div>
                            <div style={{fontSize:10,color:"var(--muted)"}}>of {fmt(weekBudget)} ({pct}%)</div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{background:"rgba(79,158,255,.05)",border:"1px solid rgba(79,158,255,.15)",borderRadius:14,padding:14,marginBottom:20}} className="aFadeUp d6">
                      <h4 style={{fontSize:12,fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.5px"}}>Weekly Pace Analysis</h4>
                      <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.6}}>
                        {A.weekwiseData.length === 0 ? (
                          "No expenses recorded yet this month."
                        ) : (
                          <>
                            <div>Average weekly spend: <span style={{color:"var(--accent)",fontWeight:700}}>{fmt(Math.round(A.currTotal/Math.max(1,A.weekwiseData.length)))}</span></div>
                            <div style={{marginTop:6}}>Highest spending week: <span style={{color:A.weekwiseData.reduce((m,w)=>m.transactions.reduce((a,b)=>a+Number(b.amount||0),0)>w.transactions.reduce((a,b)=>a+Number(b.amount||0),0)?m:w).transactions.reduce((a,b)=>a+Number(b.amount||0),0)>budget/4?"var(--amber)":"var(--accent)",fontWeight:700}}>Week {A.weekwiseData.reduce((m,w)=>m.transactions.reduce((a,b)=>a+Number(b.amount||0),0)>w.transactions.reduce((a,b)=>a+Number(b.amount||0),0)?m:w).week} - {fmt(A.weekwiseData.reduce((m,w)=>m.transactions.reduce((a,b)=>a+Number(b.amount||0),0)>w.transactions.reduce((a,b)=>a+Number(b.amount||0),0)?m:w).transactions.reduce((a,b)=>a+Number(b.amount||0),0))}</span></div>
                          </>
                        )}
                      </div>
                    </div>

                    <h3 style={{fontSize:15,fontWeight:700,marginBottom:12}} className="aFadeUp d4">🚨 Smart Alerts</h3>
                    <div style={{display:"flex",flexDirection:"column",gap:8}} className="aFadeUp d5">
                      {A.budgetPct>=90&&<InsightCard type="alert" icon="🚨" text={`Critical! ${A.budgetPct}% of your budget is gone. Only ${fmt(budget-A.currTotal)} remaining this month.`}/>}
                      {A.budgetPct>=70&&A.budgetPct<90&&<InsightCard type="warning" icon="⚠️" text={`You've crossed 70% of your budget. Slow down spending — ${fmt(budget-A.currTotal)} left.`}/>}
                      {A.budgetPct<50&&A.curr.length>2&&<InsightCard type="good" icon="✅" text={`Great discipline! Only ${A.budgetPct}% used. You're on track to save ${fmt(budget-A.currTotal)} this month.`}/>}
                      {A.predicted>0&&budget>0&&A.predicted>budget&&<InsightCard type="alert" icon="🔮" text={`Prediction: At current pace, next month spending will be ${fmt(A.predicted)} — ${fmt(A.predicted-budget)} over budget.`}/>}
                      {A.currCat.Food>budget*.3&&<InsightCard type="warning" icon="🍔" text={`Food alone is ${Math.round(A.currCat.Food/budget*100)}% of your budget (${fmt(A.currCat.Food)}). Consider cooking at home more.`}/>}
                      {A.curr.length===0&&<InsightCard type="info" icon="ℹ️" text={`No expenses logged in ${MONTH_NAMES[selectedMonth]}. Your full budget is available.`}/>}
                    </div>
                  </>
                )}

                {selectedMonth !== new Date().getMonth() || selectedYear !== new Date().getFullYear() ? (
                  <div style={{background:"rgba(79,158,255,.05)",border:"1px solid rgba(79,158,255,.2)",borderRadius:16,padding:20,textAlign:"center"}} className="aFadeUp d4">
                    <div style={{fontSize:40,marginBottom:10}}>📅</div>
                    <h3 style={{fontSize:16,fontWeight:700,marginBottom:8}}>Future Month Budget</h3>
                    <p style={{color:"var(--muted)",fontSize:14}}>You've set a budget of {fmt(budget)} for {[
                      "January","February","March","April","May","June",
                      "July","August","September","October","November","December"
                    ][selectedMonth]} {selectedYear}. No spending data available yet.</p>
                  </div>
                ) : null}
              </>
            ):(
              <EmptyState image={heroImg} icon="💰" title="No budget set yet" sub={`Enter a monthly budget above to unlock progress tracking, smart alerts, and savings projections. You can set budgets for current or future months.`}/>
            )}
          </div>
        )}
 
      </div>
 
      {modal&&<ExpenseModal initial={modal!=="add"?modal:null} onSave={addOrUpdate} onClose={()=>setModal(null)}/>}
      {toast&&<Toast {...toast} onDone={()=>setToast(null)}/>}
    </div>
  );
}
