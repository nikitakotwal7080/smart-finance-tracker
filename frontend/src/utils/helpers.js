import { KW } from "../constants/constants";

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);

export const fmt = (n) =>
  "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export const todayS = () =>
  new Date().toISOString().split("T")[0];

export const hashPw = (s) => btoa(encodeURIComponent(s));

export const ls = (k, fb) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fb;
  } catch {
    return fb;
  }
};

export const lsSet = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

export const CATS = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Health",
  "Other"
];

export const COLORS = {
  Food: "#f59e0b",
  Travel: "#3b82f6",
  Shopping: "#8b5cf6",
  Bills: "#ef4444",
  Health: "#10b981",
  Other: "#6b7280"
};

export const ICONS = {
  Food: "🍔",
  Travel: "✈️",
  Shopping: "🛍️",
  Bills: "💡",
  Health: "🏥",
  Other: "📦"
};

export const CAT_BG = {
  Food: "rgba(245,158,11,0.15)",
  Travel: "rgba(59,130,246,0.15)",
  Shopping: "rgba(139,92,246,0.15)",
  Bills: "rgba(239,68,68,0.15)",
  Health: "rgba(16,185,129,0.15)",
  Other: "rgba(107,114,128,0.15)"
};

export function autoCat(notes) {
  if (!notes) return null;
  const lo = notes.toLowerCase();

  for (const [cat, words] of Object.entries(KW)) {
    if (words.some((w) => lo.includes(w))) return cat;
  }
  return null;
}

// ✅ added only missing function
export const isWE = (date) => {
  const day = new Date(date).getDay();
  return day === 0 || day === 6;
};