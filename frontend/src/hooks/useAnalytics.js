import { useMemo } from "react";
import { CATS, ICONS, isWE, fmt } from "../utils/helpers";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Helper to get week number in month
const getWeekInMonth = (date) => {
  const d = new Date(date);
  const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
  const firstDayOfWeek = firstDay.getDay();
  const dayOfMonth = d.getDate();
  return Math.ceil((dayOfMonth + firstDayOfWeek) / 7);
};

// Helper to get week start and end dates
const getWeekRange = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  const weekStart = new Date(d.setDate(diff));
  const weekEnd = new Date(d.setDate(diff + 6));
  return { weekStart: weekStart.toISOString().split("T")[0], weekEnd: weekEnd.toISOString().split("T")[0] };
};

export default function useAnalytics(expenses, budget, selectedMonth, selectedYear) {
  return useMemo(() => {
    const cm = selectedMonth !== undefined ? selectedMonth : new Date().getMonth();
    const cy = selectedYear !== undefined ? selectedYear : new Date().getFullYear();
    const pm = cm === 0 ? 11 : cm - 1;
    const py = cm === 0 ? cy - 1 : cy;

    const curr = expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === cm && d.getFullYear() === cy;
    });

    const prev = expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === pm && d.getFullYear() === py;
    });

    const sum = (arr) => arr.reduce((acc, item) => acc + Number(item.amount || 0), 0);
    const currTotal = sum(curr);
    const prevTotal = sum(prev);

    const byCat = (arr) =>
      CATS.reduce((acc, cat) => {
        acc[cat] = sum(arr.filter((e) => e.category === cat));
        return acc;
      }, {});

    const currCat = byCat(curr);
    const prevCat = byCat(prev);

    const dailyMap = {};
    curr.forEach((e) => {
      if (!e.date) return;
      dailyMap[e.date] = (dailyMap[e.date] || 0) + Number(e.amount || 0);
    });

    const dailyVals = Object.values(dailyMap);
    const avgDaily = dailyVals.length ? dailyVals.reduce((a, b) => a + b, 0) / dailyVals.length : 0;

    const dotw = Array(7).fill(0);
    curr.forEach((e) => {
      const d = new Date(e.date);
      if (!isNaN(d)) dotw[d.getDay()] += Number(e.amount || 0);
    });

    const spike = Object.entries(dailyMap).find(([, v]) => v > avgDaily * 2.2);

    // Get all days of the selected month for daily spending chart
    const daysInMonth = new Date(cy, cm + 1, 0).getDate();
    const last14 = [...Array(daysInMonth)].map((_, i) => {
      const d = new Date(cy, cm, i + 1);
      const ds = d.toISOString().split("T")[0];
      return { date: ds.slice(5), amount: dailyMap[ds] || 0 };
    });

    // Get 6 months centered around selected month
    const monthly6 = [...Array(6)].map((_, i) => {
      const d = new Date(cy, cm - 5 + i, 1);
      const total = expenses
        .filter((e) => {
          const ed = new Date(e.date);
          return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
        })
        .reduce((a, b) => a + Number(b.amount || 0), 0);
      return { month: MONTHS[d.getMonth()], amount: total, monthIndex: d.getMonth(), year: d.getFullYear() };
    });

    const lastThree = [...Array(3)]
      .map((_, i) => {
        const d = new Date(cy, cm - 2 + i, 1);
        return expenses
          .filter((e) => {
            const ed = new Date(e.date);
            return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
          })
          .reduce((a, b) => a + Number(b.amount || 0), 0);
      })
      .filter((v) => v > 0);

    const predicted = lastThree.length ? Math.round(lastThree.reduce((a, b) => a + b, 0) / lastThree.length) : 0;

    const catPred = CATS.map((cat) => {
      const vals = [...Array(3)].map((_, i) => {
        const d = new Date(cy, cm - 2 + i, 1);
        return expenses
          .filter((e) => {
            const ed = new Date(e.date);
            return e.category === cat && ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
          })
          .reduce((a, b) => a + Number(b.amount || 0), 0);
      });
      const active = vals.filter((v) => v > 0);
      const avg = active.length ? Math.round(active.reduce((a, b) => a + b, 0) / active.length) : 0;
      const trend = vals[2] - vals[0] || 0;
      return { cat, avg, dir: trend > 150 ? "up" : trend < -150 ? "down" : "stable" };
    }).filter((c) => c.avg > 0);

    const rawBudgetPct = budget > 0 ? Math.round((currTotal / budget) * 100) : 0;
    const budgetPct = budget > 0 ? rawBudgetPct : 0;
    const budgetPctBar = budget > 0 ? Math.min(100, Math.max(0, rawBudgetPct)) : 0;
    const remaining = budget - currTotal;

    const insights = [];

    if (budget > 0) {
      const remainingText = remaining >= 0 ? `${fmt(remaining)} remaining` : `${fmt(Math.abs(remaining))} over budget`;
      if (budgetPct >= 90)
        insights.push({ type: "alert", icon: "🚨", text: `Critical! You've used ${budgetPct}% of your ${fmt(budget)} budget. Only ${remainingText}.` });
      else if (budgetPct >= 70)
        insights.push({ type: "warning", icon: "⚠️", text: `Budget alert: ${budgetPct}% used. ${remainingText}.` });
      else if (budgetPct < 40 && curr.length > 3)
        insights.push({ type: "good", icon: "✅", text: `Excellent control! Only ${budgetPct}% used — you're on track to save ${remainingText}.` });
    }

    if (prevTotal > 0) {
      const chg = Number(((currTotal - prevTotal) / prevTotal) * 100).toFixed(1);
      insights.push({ type: chg > 0 ? "warning" : "good", icon: chg > 0 ? "📈" : "📉", text: `Spending ${chg > 0 ? "up" : "down"} ${Math.abs(chg)}% vs last month (${fmt(prevTotal)} → ${fmt(currTotal)}).` });
    }

    const topCat = Object.entries(currCat).sort((a, b) => b[1] - a[1])[0];
    if (topCat && topCat[1] > 0 && currTotal > 0) {
      const p = Math.round((topCat[1] / currTotal) * 100);
      insights.push({ type: p > 40 ? "warning" : "info", icon: ICONS[topCat[0]], text: `${topCat[0]} is your top expense — ${p}% of monthly spending (${fmt(topCat[1])}).` });
    }

    CATS.forEach((cat) => {
      if (currCat[cat] > 0 && prevCat[cat] > 0) {
        const chg = Number(((currCat[cat] - prevCat[cat]) / prevCat[cat]) * 100).toFixed(0);
        if (Math.abs(chg) >= 25) insights.push({ type: chg > 0 ? "warning" : "good", icon: chg > 0 ? "↑" : "↓", text: `${cat} ${chg > 0 ? "increased" : "decreased"} by ${Math.abs(chg)}% vs last month.` });
      }
    });

    const weTotal = sum(curr.filter((e) => isWE(e.date)));
    const wdTotal = currTotal - weTotal;
    const weDays = [...new Set(curr.filter((e) => isWE(e.date)).map((e) => e.date))].length || 1;
    const wdDays = [...new Set(curr.filter((e) => !isWE(e.date)).map((e) => e.date))].length || 1;

    if (weTotal / weDays > wdTotal / wdDays * 1.3 && curr.length > 5)
      insights.push({ type: "info", icon: "📅", text: `You spend ${Math.round((weTotal / weDays) / (wdTotal / wdDays || 1) * 100 - 100)}% more per day on weekends than weekdays.` });

    if (spike)
      insights.push({ type: "alert", icon: "⚡", text: `Spending spike on ${spike[0]}: ${fmt(spike[1])} — ${Math.round(spike[1] / (avgDaily || 1))}× your daily average.` });

    const smallTx = curr.filter((e) => Number(e.amount) < 300);
    if (smallTx.length > 6) insights.push({ type: "info", icon: "🔁", text: `${smallTx.length} small transactions under ₹300 totalling ${fmt(sum(smallTx))} — they add up!` });

    if (currCat.Food > 3000) insights.push({ type: "good", icon: "💡", text: `Cutting food by 20% could save ${fmt(Math.round(currCat.Food * 0.2))}/month = ${fmt(Math.round(currCat.Food * 0.2 * 12))}/year.` });

    if (predicted > 0 && budget > 0 && predicted > budget)
      insights.push({ type: "alert", icon: "🔮", text: `At current pace, next month is predicted at ${fmt(predicted)} — ${fmt(predicted - budget)} over budget.` });

    // Week-wise grouping for selected month
    const weekMap = {};
    curr.forEach((e) => {
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

    const weekwiseData = Object.values(weekMap).sort((a, b) => a.week - b.week);

    return {
      curr,
      currTotal,
      prevTotal,
      currCat,
      prevCat,
      dotw,
      last14,
      monthly6,
      predicted,
      catPred,
      insights,
      budgetPct,
      budgetPctBar,
      remaining,
      avgDaily,
      weekwiseData
    };
  }, [expenses, budget, selectedMonth, selectedYear]);
}
