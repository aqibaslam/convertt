import { useState, useCallback, useMemo } from "react";

const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().slice(0, 10);
const fmtN = n => Number(n || 0).toLocaleString();
const fmtPKR = n => "₨" + Number(n || 0).toLocaleString();
const weeksAgo = d => Math.floor((Date.now() - new Date(d)) / 604800000);

function useStore(key, init) {
  const [data, setData] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; }
  });
  const save = useCallback(val => {
    const next = typeof val === "function" ? val(data) : val;
    setData(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch (_) {}
    return next;
  }, [data, key]);
  return [data, save];
}

const S = {
  flocks: [
    { id: "fa1", name: "FLOCK-Ab", house: "House 1", breed: "Hy-Line Brown", birdsPlaced: 5000, liveBirds: 4850, placedDate: "2024-09-10", ageWeeks: 17, source: "Star Hatchery", costPerBird: 650, notes: "" },
    { id: "fb2", name: "FLOCK-B", house: "House 2", breed: "Lohmann Brown", birdsPlaced: 4500, liveBirds: 4380, placedDate: "2024-11-08", ageWeeks: 17, source: "Gold Hatchery", costPerBird: 680, notes: "" },
    { id: "fc3", name: "FLOCK-C", house: "House 3", breed: "ISA Brown", birdsPlaced: 6000, liveBirds: 5920, placedDate: "2025-01-08", ageWeeks: 18, source: "Prime Hatchery", costPerBird: 700, notes: "New flock" },
  ],
  mortality: [{ id: "m1", date: today(), flockId: "fa1", flockName: "FLOCK-A", house: "House 1", count: 5, cause: "Disease", disposal: "Buried", by: "Ahmed", notes: "Respiratory" }],
  eggs: [
    { id: "e1", date: today(), flockId: "fa1", flockName: "FLOCK-A", shift: "Morning", total: 4200, broken: 35, floor: 12, collector: "Saleem" },
    { id: "e2", date: today(), flockId: "fb2", flockName: "FLOCK-B", shift: "Morning", total: 3900, broken: 28, floor: 9, collector: "Usman" },
  ],
  sales: [{ id: "s1", date: today(), buyer: "Market A", gradeA: 8000, gradeB: 2000, gradeC: 500, pricePerCrate: 820, status: "Paid" }],
  feed: [
    { id: "fd1", type: "Layer Feed Phase 1", supplier: "Habib Feeds", batch: "HF-089", qty: 3500, minQty: 500, costPerKg: 88, expiry: "2025-12-01", location: "Warehouse A" },
    { id: "fd2", type: "Layer Feed Phase 2", supplier: "Al-Khair Mills", batch: "AK-445", qty: 280, minQty: 400, costPerKg: 92, expiry: "2026-01-01", location: "Warehouse A" },
    { id: "fd3", type: "Limestone/Shell Grit", supplier: "Local Supplier", batch: "LS-22", qty: 900, minQty: 200, costPerKg: 15, expiry: "2026-06-01", location: "Warehouse B" },
  ],
  feedUsage: [{ id: "fu1", date: today(), flockId: "fa1", flockName: "FLOCK-A", feedId: "fd1", feedType: "Layer Feed Phase 1", qty: 420, by: "Saleem", notes: "" }],
  medicine: [
    { id: "med1", name: "Newcastle B1 Vaccine", type: "Vaccine", batch: "NB-2024", qty: 50000, unit: "Dose", costPerUnit: 0.5, expiry: "2025-08-01", mfg: "Intervet" },
    { id: "med2", name: "Oxytetracycline", type: "Antibiotic", batch: "OTC-22", qty: 5, unit: "kg", costPerUnit: 1200, expiry: "2025-12-01", mfg: "Fauji Pharma" },
    { id: "med3", name: "ADE Vitamins", type: "Vitamin", batch: "ADE-88", qty: 20, unit: "litre", costPerUnit: 350, expiry: "2025-09-01", mfg: "Agri Pharma" },
  ],
  medUsage: [],
  equipment: [
    { id: "eq1", name: "Auto Nipple Drinker System", cat: "Watering System", qty: 3, location: "All Houses", purchaseDate: "2022-01-01", lastMaint: "2024-12-01", nextMaint: "2025-06-01", condition: "Good" },
    { id: "eq2", name: "Chain Feeder System", cat: "Feeding System", qty: 3, location: "All Houses", purchaseDate: "2022-01-01", lastMaint: "2024-12-10", nextMaint: "2025-06-10", condition: "Good" },
    { id: "eq3", name: "Exhaust Fans (36\")", cat: "Ventilation", qty: 12, location: "All Houses", purchaseDate: "2021-06-01", lastMaint: "2024-11-01", nextMaint: "2025-02-01", condition: "Fair" },
  ],
  expenses: [
    { id: "ex1", date: today(), cat: "Labour/Wages", desc: "Monthly wages", amount: 85000, payee: "Staff", pay: "Bank Transfer" },
    { id: "ex2", date: today(), cat: "Feed Purchase", desc: "Layer Feed 2000kg", amount: 176000, payee: "Habib Feeds", pay: "Bank Transfer" },
    { id: "ex3", date: today(), cat: "Utilities", desc: "Electricity bill", amount: 42000, payee: "KESC", pay: "Cash" },
  ],
  activity: [],
};

function getPhase(ageWeeks, placedDate) {
  const a = ageWeeks + weeksAgo(placedDate);
  if (a < 18) return { label: "Pre-Lay", col: "#58a6ff" };
  if (a <= 42) return { label: "Phase 1 Peak", col: "#3fb950" };
  if (a <= 72) return { label: "Phase 2", col: "#f0b429" };
  return { label: "End of Lay", col: "#f85149" };
}

const C = { bg: "#0d1117", surface: "#161b22", border: "#30363d", text: "#e6edf3", muted: "#8b949e", accent: "#f0b429", green: "#3fb950", red: "#f85149", blue: "#58a6ff" };
const inputSt = { background: "#21262d", border: "1px solid #30363d", borderRadius: 8, padding: "9px 12px", color: "#e6edf3", fontSize: 13, outline: "none", width: "100%", fontFamily: "inherit" };

const Inp = (p) => <input style={inputSt} {...p} />;
const Sel = ({ children, ...p }) => <select style={{ ...inputSt, cursor: "pointer" }} {...p}>{children}</select>;
const Txt = (p) => <textarea style={{ ...inputSt, resize: "vertical", minHeight: 64 }} {...p} />;

const FG = ({ label, children, half }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: half ? "0 0 calc(50% - 7px)" : 1 }}>
    <label style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600 }}>{label}</label>
    {children}
  </div>
);
const Row = ({ children }) => <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>{children}</div>;

const Btn = ({ children, variant = "primary", sm, ...p }) => {
  const st = {
    primary: { background: C.accent, color: "#0d1117", border: "none" },
    ghost: { background: "#21262d", color: C.text, border: "1px solid #30363d" },
    danger: { background: "rgba(248,81,73,.12)", color: C.red, border: "1px solid rgba(248,81,73,.3)" },
  }[variant];
  return <button {...p} style={{ ...st, borderRadius: 7, padding: sm ? "4px 10px" : "8px 16px", fontSize: sm ? 11 : 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap", ...(p.style || {}) }}>{children}</button>;
};

const Badge = ({ children, color = "gray" }) => {
  const m = { green: C.green, yellow: C.accent, red: C.red, blue: C.blue, purple: "#bc8cff", gray: C.muted };
  const c = m[color] || m.gray;
  return <span style={{ background: c + "22", color: c, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{children}</span>;
};

const StatCard = ({ icon, value, label, sub, subColor }) => (
  <div style={{ background: C.surface, border: "1px solid #30363d", borderRadius: 14, padding: 18 }}>
    <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontFamily: "Syne,sans-serif", fontSize: 24, fontWeight: 800 }}>{value}</div>
    <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: subColor || C.green, marginTop: 5 }}>{sub}</div>}
  </div>
);

const Card = ({ title, subtitle, action, children }) => (
  <div style={{ background: C.surface, border: "1px solid #30363d", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
    {(title || action) && (
      <div style={{ padding: "13px 18px", borderBottom: "1px solid #30363d", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div>
          <div style={{ fontFamily: "Syne,sans-serif", fontSize: 14, fontWeight: 700 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{subtitle}</div>}
        </div>
        {action && <div style={{ display: "flex", gap: 8 }}>{action}</div>}
      </div>
    )}
    {children}
  </div>
);

const TH = ({ c }) => <th style={{ textAlign: "left", fontSize: 10, textTransform: "uppercase", letterSpacing: "1.5px", color: C.muted, padding: "9px 13px", borderBottom: "1px solid #30363d", fontWeight: 600, whiteSpace: "nowrap" }}>{c}</th>;
const TD = ({ children, bold, red, green, muted, style: s }) => (
  <td style={{ padding: "9px 13px", fontSize: 13, borderBottom: "1px solid rgba(48,54,61,.4)", color: red ? C.red : green ? C.green : muted ? C.muted : C.text, fontWeight: bold ? 700 : 400, verticalAlign: "middle", ...(s || {}) }}>{children}</td>
);

function DataTable({ heads, rows, empty = "No records yet." }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr>{heads.map((h, i) => <TH key={i} c={h} />)}</tr></thead>
        <tbody>{rows}</tbody>
      </table>
      {(!rows || rows.filter(Boolean).length === 0) && (
        <div style={{ textAlign: "center", padding: "32px", color: C.muted }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📭</div>
          <div style={{ fontSize: 13 }}>{empty}</div>
        </div>
      )}
    </div>
  );
}

function Modal({ open, onClose, title, children, onSave, saveLabel = "Save" }) {
  if (!open) return null;
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.78)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(5px)", animation: "fadeIn .18s ease" }}>
      <div style={{ background: C.surface, border: "1px solid #30363d", borderRadius: 18, width: "min(600px,94vw)", maxHeight: "91vh", overflow: "hidden", display: "flex", flexDirection: "column", animation: "slideUp .22s ease" }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid #30363d", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <span style={{ fontFamily: "Syne,sans-serif", fontSize: 16, fontWeight: 700 }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: 22, overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 13 }}>{children}</div>
        <div style={{ padding: "13px 22px", borderTop: "1px solid #30363d", display: "flex", gap: 9, justifyContent: "flex-end", flexShrink: 0 }}>
          <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={onSave}>{saveLabel}</Btn>
        </div>
      </div>
    </div>
  );
}

function ConfirmDlg({ open, msg, onYes, onNo }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.82)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(5px)" }}>
      <div style={{ background: C.surface, border: "1px solid #30363d", borderRadius: 14, padding: 28, width: "min(360px,90vw)", textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
        <div style={{ fontSize: 14, marginBottom: 20, color: C.text }}>{msg}</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Btn variant="ghost" onClick={onNo}>Cancel</Btn>
          <Btn variant="danger" onClick={onYes}>Delete</Btn>
        </div>
      </div>
    </div>
  );
}

export default function PoultryApp() {
  const [page, setPage] = useState("dashboard");
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const [flocks, setFlocks] = useStore("pf_flocks", S.flocks);
  const [mortality, setMortality] = useStore("pf_mortality", S.mortality);
  const [eggs, setEggs] = useStore("pf_eggs", S.eggs);
  const [sales, setSales] = useStore("pf_sales", S.sales);
  const [feed, setFeed] = useStore("pf_feed", S.feed);
  const [feedUsage, setFeedUsage] = useStore("pf_feedUsage", S.feedUsage);
  const [medicine, setMedicine] = useStore("pf_medicine", S.medicine);
  const [medUsage, setMedUsage] = useStore("pf_medUsage", S.medUsage);
  const [equipment, setEquipment] = useStore("pf_equipment", S.equipment);
  const [expenses, setExpenses] = useStore("pf_expenses", S.expenses);
  const [activity, setActivity] = useStore("pf_activity", S.activity);

  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toast = (msg, type = "info") => {
    const id = uid(); setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };
  const logAct = (icon, text) => setActivity(a => [{ id: uid(), time: new Date().toLocaleTimeString(), icon, text }, ...a].slice(0, 40));
  const openAdd = (type) => { setForm({ date: today() }); setModal({ type, mode: "add" }); };
  const openEdit = (type, data) => { setForm({ ...data }); setModal({ type, mode: "edit" }); };
  const closeModal = () => setModal(null);
  const askDel = (msg, fn) => setConfirm({ msg, onYes: () => { fn(); setConfirm(null); } });
  const upsert = (list, setList, item) => setList(l => l.find(x => x.id === item.id) ? l.map(x => x.id === item.id ? item : x) : [...l, item]);
  const remove = (setList, id) => setList(l => l.filter(x => x.id !== id));

  const totalBirds = useMemo(() => flocks.reduce((s, f) => s + (f.liveBirds || 0), 0), [flocks]);
  const todayEggs = useMemo(() => eggs.filter(e => e.date === today()).reduce((s, e) => s + (e.total || 0), 0), [eggs]);
  const totalFeedKg = useMemo(() => feed.reduce((s, f) => s + (f.qty || 0), 0), [feed]);
  const totalRevenue = useMemo(() => sales.reduce((s, g) => s + Math.floor((g.gradeA + g.gradeB + g.gradeC) / 30) * g.pricePerCrate, 0), [sales]);
  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + (e.amount || 0), 0), [expenses]);
  const hdp = totalBirds > 0 ? (todayEggs / totalBirds * 100).toFixed(1) : "0.0";
  const lowFeed = feed.filter(f => f.qty <= f.minQty).length;

  // SAVE HANDLERS
  const saveFlock = () => {
    if (!form.name || !form.birdsPlaced) { toast("Name and birds placed are required", "warn"); return; }
    const isNew = modal.mode === "add";
    const item = { id: form.id || uid(), name: form.name, house: form.house || "", breed: form.breed || "Hy-Line Brown", birdsPlaced: +form.birdsPlaced, liveBirds: isNew ? +form.birdsPlaced : +form.liveBirds, placedDate: form.placedDate || today(), ageWeeks: +(form.ageWeeks || 17), source: form.source || "", costPerBird: +(form.costPerBird || 0), notes: form.notes || "" };
    upsert(flocks, setFlocks, item);
    logAct("🐣", `${isNew ? "Added" : "Updated"} flock: ${item.name}`);
    closeModal(); toast(`Flock ${isNew ? "added" : "updated"}!`, "success");
  };
  const saveMortality = () => {
    if (!form.flockId || !form.count) { toast("Select flock and enter count", "warn"); return; }
    const flock = flocks.find(f => f.id === form.flockId);
    const isNew = modal.mode === "add";
    const item = { id: form.id || uid(), date: form.date || today(), flockId: form.flockId, flockName: flock?.name || "", house: flock?.house || "", count: +form.count, cause: form.cause || "Unknown", disposal: form.disposal || "Buried", by: form.by || "", notes: form.notes || "" };
    if (isNew) setFlocks(fl => fl.map(f => f.id === form.flockId ? { ...f, liveBirds: Math.max(0, f.liveBirds - +form.count) } : f));
    upsert(mortality, setMortality, item);
    logAct("☠️", `Mortality: ${flock?.name} — ${form.count} birds`);
    closeModal(); toast("Mortality logged", "warn");
  };
  const saveEgg = () => {
    if (!form.flockId || !form.total) { toast("Select flock and enter count", "warn"); return; }
    const flock = flocks.find(f => f.id === form.flockId);
    const item = { id: form.id || uid(), date: form.date || today(), flockId: form.flockId, flockName: flock?.name || "", shift: form.shift || "Morning", total: +form.total, broken: +(form.broken || 0), floor: +(form.floor || 0), collector: form.collector || "" };
    upsert(eggs, setEggs, item);
    logAct("🥚", `Eggs: ${flock?.name} — ${fmtN(form.total)}`);
    closeModal(); toast("Collection saved!", "success");
  };
  const saveSale = () => {
    if (!form.buyer || !form.pricePerCrate) { toast("Buyer and price required", "warn"); return; }
    const item = { id: form.id || uid(), date: form.date || today(), buyer: form.buyer, gradeA: +(form.gradeA || 0), gradeB: +(form.gradeB || 0), gradeC: +(form.gradeC || 0), pricePerCrate: +form.pricePerCrate, status: form.status || "Paid" };
    upsert(sales, setSales, item);
    logAct("💰", `Sale: ${form.buyer}`);
    closeModal(); toast("Sale recorded!", "success");
  };
  const saveFeedStock = () => {
    if (!form.type || !form.qty) { toast("Type and quantity required", "warn"); return; }
    const isNew = modal.mode === "add";
    const item = { id: form.id || uid(), type: form.type, supplier: form.supplier || "", batch: form.batch || "", qty: +form.qty, minQty: +(form.minQty || 500), costPerKg: +(form.costPerKg || 0), expiry: form.expiry || "", location: form.location || "" };
    upsert(feed, setFeed, item);
    if (isNew) setExpenses(ex => [...ex, { id: uid(), date: form.date || today(), cat: "Feed Purchase", desc: `${form.type} ${fmtN(form.qty)}kg`, amount: +form.qty * +(form.costPerKg || 0), payee: form.supplier || "", pay: "Cash" }]);
    logAct("🌾", `Feed: ${form.type} ${fmtN(form.qty)}kg`);
    closeModal(); toast(`Feed ${isNew ? "added" : "updated"}!`, "success");
  };
  const saveFeedUsage = () => {
    if (!form.flockId || !form.feedId || !form.qty) { toast("Flock, feed, and qty required", "warn"); return; }
    const fd = feed.find(f => f.id === form.feedId);
    if (!fd || fd.qty < +form.qty) { toast("Insufficient stock!", "error"); return; }
    const flock = flocks.find(f => f.id === form.flockId);
    const isNew = modal.mode === "add";
    const item = { id: form.id || uid(), date: form.date || today(), flockId: form.flockId, flockName: flock?.name || "", feedId: form.feedId, feedType: fd.type, qty: +form.qty, by: form.by || "", notes: form.notes || "" };
    if (isNew) setFeed(fds => fds.map(f => f.id === form.feedId ? { ...f, qty: f.qty - +form.qty } : f));
    upsert(feedUsage, setFeedUsage, item);
    logAct("🌾", `Used: ${fmtN(form.qty)}kg ${fd.type}`);
    closeModal(); toast("Usage recorded!", "success");
  };
  const saveMed = () => {
    if (!form.name) { toast("Name required", "warn"); return; }
    const item = { id: form.id || uid(), name: form.name, type: form.type || "Vaccine", batch: form.batch || "", qty: +(form.qty || 0), unit: form.unit || "Dose", costPerUnit: +(form.costPerUnit || 0), expiry: form.expiry || "", mfg: form.mfg || "" };
    upsert(medicine, setMedicine, item);
    logAct("💊", `Medicine: ${form.name}`);
    closeModal(); toast("Medicine saved!", "success");
  };
  const saveMedUsage = () => {
    if (!form.flockId || !form.medId) { toast("Flock and medicine required", "warn"); return; }
    const med = medicine.find(m => m.id === form.medId);
    const flock = flocks.find(f => f.id === form.flockId);
    const item = { id: form.id || uid(), date: form.date || today(), flockId: form.flockId, flockName: flock?.name || "", medId: form.medId, medName: med?.name || "", dose: form.dose || "", route: form.route || "Drinking Water", by: form.by || "", wd: +(form.wd || 0) };
    upsert(medUsage, setMedUsage, item);
    logAct("💉", `Treatment: ${med?.name} → ${flock?.name}`);
    closeModal(); toast("Treatment recorded!", "success");
  };
  const saveEquip = () => {
    if (!form.name) { toast("Name required", "warn"); return; }
    const item = { id: form.id || uid(), name: form.name, cat: form.cat || "Other", qty: +(form.qty || 1), location: form.location || "", purchaseDate: form.purchaseDate || today(), lastMaint: form.lastMaint || "", nextMaint: form.nextMaint || "", condition: form.condition || "Good" };
    upsert(equipment, setEquipment, item);
    logAct("🔧", `Equipment: ${form.name}`);
    closeModal(); toast("Equipment saved!", "success");
  };
  const saveExpense = () => {
    if (!form.amount) { toast("Amount required", "warn"); return; }
    const item = { id: form.id || uid(), date: form.date || today(), cat: form.cat || "Miscellaneous", desc: form.desc || "", amount: +form.amount, payee: form.payee || "", pay: form.pay || "Cash" };
    upsert(expenses, setExpenses, item);
    logAct("💸", `Expense: ${fmtPKR(form.amount)} — ${form.cat}`);
    closeModal(); toast("Expense saved!", "success");
  };

  const navItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard", group: "Overview" },
    { id: "flocks", icon: "🐣", label: "Flocks", group: "Flock" },
    { id: "mortality", icon: "📋", label: "Mortality Log", group: "Flock" },
    { id: "eggs", icon: "🥚", label: "Egg Collection", group: "Production" },
    { id: "sales", icon: "⚖️", label: "Egg Sales", group: "Production" },
    { id: "feed", icon: "🌾", label: "Feed Inventory", group: "Inventory" },
    { id: "medicine", icon: "💊", label: "Medicine", group: "Inventory" },
    { id: "equipment", icon: "🔧", label: "Equipment", group: "Inventory" },
    { id: "expenses", icon: "💸", label: "Expenses", group: "Finance" },
    { id: "revenue", icon: "💰", label: "Revenue & P&L", group: "Finance" },
    { id: "reports", icon: "📈", label: "Reports", group: "Reports" },
  ];
  const groups = [...new Set(navItems.map(n => n.group))];

  // ── PAGES ──
  const PageDashboard = () => {
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      const ds = d.toISOString().slice(0, 10);
      return { day: d.toLocaleDateString("en", { weekday: "short" }), total: eggs.filter(e => e.date === ds).reduce((s, e) => s + e.total, 0) };
    });
    const maxEgg = Math.max(...last7.map(d => d.total), 1);
    const dailyUse = feedUsage.filter(f => f.date === today()).reduce((s, f) => s + f.qty, 0) || 850;
    const feedDays = totalFeedKg > 0 ? Math.floor(totalFeedKg / dailyUse) : 0;
    return (
      <div>
        {lowFeed > 0 && <div style={{ background: "rgba(248,81,73,.1)", border: "1px solid rgba(248,81,73,.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: C.red }}>⚠️ <b>{lowFeed} feed item(s)</b> below minimum stock — go to Feed Inventory.</div>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
          <StatCard icon="🐔" value={fmtN(totalBirds)} label="Live Birds" sub={`${flocks.length} flocks`} />
          <StatCard icon="🥚" value={fmtN(todayEggs)} label="Eggs Today" sub={`${hdp}% HDP`} subColor={+hdp >= 80 ? C.green : C.accent} />
          <StatCard icon="🌾" value={fmtN(totalFeedKg) + " kg"} label="Feed Stock" sub={`~${feedDays} days`} subColor={feedDays > 10 ? C.green : C.red} />
          <StatCard icon="💰" value={fmtPKR(totalRevenue)} label="Revenue" sub={`Net: ${fmtPKR(totalRevenue - totalExpenses)}`} subColor={totalRevenue - totalExpenses >= 0 ? C.green : C.red} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <Card title="🥚 7-Day Egg Production">
            <div style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100 }}>
                {last7.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <div style={{ width: "100%", borderRadius: "3px 3px 0 0", height: Math.round((d.total / maxEgg) * 85) + 8, background: "linear-gradient(to top,#e07b39,#f0b429)", minHeight: 8 }} title={fmtN(d.total)} />
                    <div style={{ fontSize: 10, color: C.muted }}>{d.day}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card title="🐔 Flock Health">
            <div style={{ padding: 16 }}>
              {flocks.map(f => {
                const p = getPhase(f.ageWeeks, f.placedDate);
                const surv = (f.liveBirds / f.birdsPlaced * 100).toFixed(1);
                return (
                  <div key={f.id} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                      <span style={{ fontWeight: 700 }}>{f.name} <span style={{ background: p.col + "22", color: p.col, borderRadius: 20, padding: "1px 8px", fontSize: 10, fontWeight: 700 }}>{p.label}</span></span>
                      <span style={{ color: C.muted }}>{fmtN(f.liveBirds)}</span>
                    </div>
                    <div style={{ background: "#21262d", borderRadius: 4, height: 5 }}>
                      <div style={{ height: "100%", borderRadius: 4, width: surv + "%", background: +surv > 95 ? C.green : +surv > 90 ? C.accent : C.red }} />
                    </div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{surv}% survival · Age wk {f.ageWeeks + weeksAgo(f.placedDate)}</div>
                  </div>
                );
              })}
              {flocks.length === 0 && <div style={{ color: C.muted, fontSize: 13 }}>No flocks added yet.</div>}
            </div>
          </Card>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Card title="⚠️ Active Alerts">
            <div style={{ padding: 16 }}>
              {feed.filter(f => f.qty <= f.minQty).map(f => <div key={f.id} style={{ background: "rgba(248,81,73,.1)", border: "1px solid rgba(248,81,73,.2)", borderRadius: 8, padding: "9px 12px", marginBottom: 8, fontSize: 13, color: C.red }}>⚠️ <b>{f.type}</b> — only {fmtN(f.qty)}kg</div>)}
              {equipment.filter(e => e.nextMaint && e.nextMaint <= today()).map(e => <div key={e.id} style={{ background: "rgba(240,180,41,.1)", border: "1px solid rgba(240,180,41,.2)", borderRadius: 8, padding: "9px 12px", marginBottom: 8, fontSize: 13, color: C.accent }}>🔧 <b>{e.name}</b> maintenance overdue!</div>)}
              {lowFeed === 0 && equipment.filter(e => e.nextMaint && e.nextMaint <= today()).length === 0 && <div style={{ color: C.green, fontSize: 13 }}>✅ No active alerts</div>}
            </div>
          </Card>
          <Card title="📋 Recent Activity">
            <div style={{ padding: 16 }}>
              {activity.length === 0 ? <div style={{ color: C.muted, fontSize: 13 }}>No activity yet.</div> :
                activity.slice(0, 7).map(a => (
                  <div key={a.id} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid rgba(48,54,61,.4)" }}>
                    <span style={{ fontSize: 16 }}>{a.icon}</span>
                    <div><div style={{ fontSize: 13 }}>{a.text}</div><div style={{ fontSize: 10, color: C.muted }}>{a.time}</div></div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const PageFlocks = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}><Btn onClick={() => openAdd("flock")}>+ Add Flock</Btn></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {flocks.map(f => {
          const p = getPhase(f.ageWeeks, f.placedDate);
          const surv = (f.liveBirds / f.birdsPlaced * 100).toFixed(1);
          const mPct = ((f.birdsPlaced - f.liveBirds) / f.birdsPlaced * 100).toFixed(1);
          return (
            <div key={f.id} style={{ background: C.surface, border: "1px solid #30363d", borderRadius: 14, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 15 }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{f.house} · {f.breed}</div>
                </div>
                <span style={{ background: p.col + "22", color: p.col, borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 700, alignSelf: "flex-start" }}>{p.label}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                {[["Live Birds", fmtN(f.liveBirds), C.green], ["Mortality%", mPct + "%", +mPct > 5 ? C.red : C.muted], ["Age (wks)", f.ageWeeks + weeksAgo(f.placedDate), C.text], ["Cost/Bird", fmtPKR(f.costPerBird), C.muted]].map(([l, v, c]) => (
                  <div key={l}><div style={{ fontSize: 10, color: C.muted }}>{l}</div><div style={{ fontSize: 15, fontWeight: 700, color: c }}>{v}</div></div>
                ))}
              </div>
              <div style={{ background: "#21262d", borderRadius: 4, height: 5, marginBottom: 10 }}>
                <div style={{ height: "100%", width: surv + "%", borderRadius: 4, background: +surv > 95 ? C.green : C.accent }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: C.muted }}>{surv}% survival</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn sm variant="ghost" onClick={() => openEdit("flock", f)}>✏️ Edit</Btn>
                  <Btn sm variant="danger" onClick={() => askDel(`Delete ${f.name}?`, () => remove(setFlocks, f.id))}>🗑️</Btn>
                </div>
              </div>
            </div>
          );
        })}
        {flocks.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: C.muted }}>No flocks yet. Click "+ Add Flock" to start.</div>}
      </div>
    </div>
  );

  const PageMortality = () => {
    const mToday = mortality.filter(m => m.date === today()).reduce((s, m) => s + m.count, 0);
    const mWeek = mortality.filter(m => new Date(m.date) >= new Date(Date.now() - 7 * 86400000)).reduce((s, m) => s + m.count, 0);
    const total = flocks.reduce((s, f) => s + f.birdsPlaced, 0);
    const mAll = mortality.reduce((s, m) => s + m.count, 0);
    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 18 }}>
          <StatCard icon="☠️" value={mToday} label="Deaths Today" subColor={C.red} />
          <StatCard icon="📅" value={mWeek} label="This Week" subColor={C.accent} />
          <StatCard icon="📊" value={total > 0 ? (mAll / total * 100).toFixed(2) + "%" : "0%"} label="Overall Mortality" subColor={C.red} />
        </div>
        <Card title="Mortality Log" action={<Btn onClick={() => openAdd("mortality")}>+ Log Mortality</Btn>}>
          <DataTable heads={["Date", "Flock", "Deaths", "Cause", "Disposal", "By", "Notes", ""]}
            rows={[...mortality].reverse().map(m => (
              <tr key={m.id}>
                <TD>{m.date}</TD><TD bold>{m.flockName}</TD><TD bold red>{m.count}</TD>
                <TD><Badge color={m.cause === "Disease" ? "red" : m.cause === "Heat Stress" ? "yellow" : "purple"}>{m.cause}</Badge></TD>
                <TD muted>{m.disposal}</TD><TD muted>{m.by}</TD><TD muted>{m.notes || "—"}</TD>
                <TD><div style={{ display: "flex", gap: 5 }}>
                  <Btn sm variant="ghost" onClick={() => openEdit("mortality", m)}>✏️</Btn>
                  <Btn sm variant="danger" onClick={() => askDel("Delete mortality record?", () => remove(setMortality, m.id))}>🗑️</Btn>
                </div></TD>
              </tr>
            ))} />
        </Card>
      </div>
    );
  };

  const PageEggs = () => {
    const tBroken = eggs.filter(e => e.date === today()).reduce((s, e) => s + e.broken, 0);
    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 18 }}>
          <StatCard icon="🥚" value={fmtN(todayEggs)} label="Today's Eggs" />
          <StatCard icon="📦" value={fmtN(Math.floor(todayEggs / 30))} label="Crates Today" />
          <StatCard icon="❌" value={fmtN(tBroken)} label="Broken" subColor={C.red} />
          <StatCard icon="📈" value={hdp + "%"} label="HDP%" subColor={+hdp >= 80 ? C.green : C.accent} />
        </div>
        <Card title="Egg Collection Log" action={<Btn onClick={() => openAdd("egg")}>+ Record Collection</Btn>}>
          <DataTable heads={["Date", "Flock", "Shift", "Total", "Crates", "Broken", "Floor", "HDP%", "Collector", ""]}
            rows={[...eggs].reverse().map(e => {
              const flock = flocks.find(f => f.id === e.flockId);
              const h = flock ? (e.total / flock.liveBirds * 100).toFixed(1) : "—";
              return (
                <tr key={e.id}>
                  <TD>{e.date}</TD><TD bold>{e.flockName || flock?.name}</TD><TD>{e.shift}</TD>
                  <TD bold>{fmtN(e.total)}</TD><TD>{Math.floor(e.total / 30)}</TD>
                  <TD red>{e.broken}</TD><TD>{e.floor}</TD>
                  <TD style={{ color: +h >= 80 ? C.green : +h >= 60 ? C.accent : C.red }}>{h}%</TD>
                  <TD muted>{e.collector}</TD>
                  <TD><div style={{ display: "flex", gap: 5 }}>
                    <Btn sm variant="ghost" onClick={() => openEdit("egg", e)}>✏️</Btn>
                    <Btn sm variant="danger" onClick={() => askDel("Delete record?", () => remove(setEggs, e.id))}>🗑️</Btn>
                  </div></TD>
                </tr>
              );
            })} />
        </Card>
      </div>
    );
  };

  const PageSales = () => {
    const totalSold = sales.reduce((s, g) => s + g.gradeA + g.gradeB + g.gradeC, 0);
    const gradeA = sales.reduce((s, g) => s + g.gradeA, 0);
    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 18 }}>
          <StatCard icon="📦" value={fmtN(Math.max(0, eggs.reduce((s, e) => s + e.total, 0) - totalSold))} label="Eggs in Stock" />
          <StatCard icon="🏆" value={totalSold > 0 ? (gradeA / totalSold * 100).toFixed(1) + "%" : "0%"} label="Grade A Ratio" subColor={C.green} />
          <StatCard icon="💵" value={fmtPKR(totalRevenue)} label="Total Revenue" subColor={C.green} />
        </div>
        <Card title="Sales Records" action={<Btn onClick={() => openAdd("sale")}>+ Record Sale</Btn>}>
          <DataTable heads={["Date", "Buyer", "Grade A", "Grade B", "Grade C", "Crates", "₨/Crate", "Total", "Status", ""]}
            rows={[...sales].reverse().map(g => {
              const total = g.gradeA + g.gradeB + g.gradeC;
              const rev = Math.floor(total / 30) * g.pricePerCrate;
              return (
                <tr key={g.id}>
                  <TD>{g.date}</TD><TD bold>{g.buyer}</TD>
                  <TD green>{fmtN(g.gradeA)}</TD>
                  <TD style={{ color: C.accent }}>{fmtN(g.gradeB)}</TD>
                  <TD muted>{fmtN(g.gradeC)}</TD>
                  <TD>{Math.floor(total / 30)}</TD><TD>{fmtPKR(g.pricePerCrate)}</TD>
                  <TD bold green>{fmtPKR(rev)}</TD>
                  <TD><Badge color={g.status === "Paid" ? "green" : g.status === "Pending" ? "red" : "yellow"}>{g.status}</Badge></TD>
                  <TD><div style={{ display: "flex", gap: 5 }}>
                    <Btn sm variant="ghost" onClick={() => openEdit("sale", g)}>✏️</Btn>
                    <Btn sm variant="danger" onClick={() => askDel("Delete sale?", () => remove(setSales, g.id))}>🗑️</Btn>
                  </div></TD>
                </tr>
              );
            })} />
        </Card>
      </div>
    );
  };

  const PageFeed = () => (
    <div>
      {feed.filter(f => f.qty <= f.minQty).map(f => <div key={f.id} style={{ background: "rgba(248,81,73,.1)", border: "1px solid rgba(248,81,73,.3)", borderRadius: 10, padding: "11px 16px", marginBottom: 10, fontSize: 13, color: C.red }}>🚨 LOW STOCK: <b>{f.type}</b> — {fmtN(f.qty)}kg (min: {fmtN(f.minQty)}kg)</div>)}
      <Card title="Feed Inventory" action={<><Btn variant="ghost" onClick={() => openAdd("feedUsage")}>− Record Usage</Btn><Btn onClick={() => openAdd("feed")}>+ Add Stock</Btn></>}>
        <DataTable heads={["Feed Type", "Supplier", "Batch", "Stock (kg)", "Min Level", "Level", "₨/kg", "Expiry", "Status", ""]}
          rows={feed.map(f => {
            const pct = Math.min(100, f.qty / Math.max(f.qty, f.minQty * 2) * 100);
            const [col, st] = f.qty <= f.minQty ? [C.red, "Critical"] : f.qty <= f.minQty * 1.5 ? [C.accent, "Low"] : [C.green, "OK"];
            return (
              <tr key={f.id}>
                <TD bold>{f.type}</TD><TD>{f.supplier}</TD><TD muted>{f.batch}</TD>
                <TD bold style={{ color: col }}>{fmtN(f.qty)} kg</TD>
                <TD muted>{fmtN(f.minQty)} kg</TD>
                <TD style={{ minWidth: 80 }}><div style={{ background: "#21262d", borderRadius: 4, height: 6 }}><div style={{ height: "100%", borderRadius: 4, width: pct + "%", background: col }} /></div></TD>
                <TD>{fmtPKR(f.costPerKg)}</TD><TD>{f.expiry}</TD>
                <TD><Badge color={col === C.red ? "red" : col === C.accent ? "yellow" : "green"}>{st}</Badge></TD>
                <TD><div style={{ display: "flex", gap: 5 }}>
                  <Btn sm variant="ghost" onClick={() => openEdit("feed", f)}>✏️</Btn>
                  <Btn sm variant="danger" onClick={() => askDel("Delete feed record?", () => remove(setFeed, f.id))}>🗑️</Btn>
                </div></TD>
              </tr>
            );
          })} />
      </Card>
      <Card title="Feed Usage Log">
        <DataTable heads={["Date", "Flock", "Feed Type", "Qty (kg)", "By", "Notes", ""]}
          rows={[...feedUsage].reverse().map(f => (
            <tr key={f.id}>
              <TD>{f.date}</TD><TD bold>{f.flockName}</TD><TD>{f.feedType}</TD>
              <TD bold>{fmtN(f.qty)} kg</TD><TD>{f.by}</TD><TD muted>{f.notes || "—"}</TD>
              <TD><Btn sm variant="danger" onClick={() => askDel("Delete usage record?", () => remove(setFeedUsage, f.id))}>🗑️</Btn></TD>
            </tr>
          ))} />
      </Card>
    </div>
  );

  const PageMedicine = () => (
    <div>
      <Card title="Medicine & Vaccines" action={<><Btn variant="ghost" onClick={() => openAdd("medUsage")}>+ Treatment</Btn><Btn onClick={() => openAdd("med")}>+ Add Medicine</Btn></>}>
        <DataTable heads={["Name", "Type", "Batch", "Qty", "Unit", "Expiry", "₨/Unit", "Status", ""]}
          rows={medicine.map(m => {
            const exp = m.expiry && m.expiry < today();
            const soon = !exp && m.expiry && m.expiry < new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
            return (
              <tr key={m.id}>
                <TD bold>{m.name}</TD><TD><Badge color="blue">{m.type}</Badge></TD>
                <TD muted>{m.batch}</TD><TD bold>{fmtN(m.qty)}</TD><TD>{m.unit}</TD>
                <TD style={{ color: exp ? C.red : soon ? C.accent : C.text }}>{m.expiry}</TD>
                <TD>{fmtPKR(m.costPerUnit)}</TD>
                <TD><Badge color={exp ? "red" : soon ? "yellow" : "green"}>{exp ? "Expired" : soon ? "Exp. Soon" : "In Stock"}</Badge></TD>
                <TD><div style={{ display: "flex", gap: 5 }}>
                  <Btn sm variant="ghost" onClick={() => openEdit("med", m)}>✏️</Btn>
                  <Btn sm variant="danger" onClick={() => askDel("Delete medicine?", () => remove(setMedicine, m.id))}>🗑️</Btn>
                </div></TD>
              </tr>
            );
          })} />
      </Card>
      <Card title="Treatment Log">
        <DataTable heads={["Date", "Flock", "Medicine", "Dose", "Route", "By", "Withdrawal", ""]}
          rows={[...medUsage].reverse().map(m => (
            <tr key={m.id}>
              <TD>{m.date}</TD><TD bold>{m.flockName}</TD><TD>{m.medName}</TD>
              <TD>{m.dose}</TD><TD>{m.route}</TD><TD>{m.by}</TD>
              <TD>{m.wd > 0 ? <Badge color="yellow">{m.wd} days</Badge> : "None"}</TD>
              <TD><div style={{ display: "flex", gap: 5 }}>
                <Btn sm variant="ghost" onClick={() => openEdit("medUsage", m)}>✏️</Btn>
                <Btn sm variant="danger" onClick={() => askDel("Delete treatment record?", () => remove(setMedUsage, m.id))}>🗑️</Btn>
              </div></TD>
            </tr>
          ))} />
      </Card>
    </div>
  );

  const PageEquipment = () => (
    <Card title="Equipment" action={<Btn onClick={() => openAdd("equip")}>+ Add Equipment</Btn>}>
      <DataTable heads={["Name", "Category", "Qty", "Location", "Purchase", "Last Maint.", "Next Due", "Condition", ""]}
        rows={equipment.map(e => {
          const overdue = e.nextMaint && e.nextMaint <= today();
          return (
            <tr key={e.id}>
              <TD bold>{e.name}</TD><TD><Badge color="purple">{e.cat}</Badge></TD>
              <TD>{e.qty}</TD><TD>{e.location}</TD>
              <TD muted>{e.purchaseDate}</TD><TD muted>{e.lastMaint || "—"}</TD>
              <TD style={{ color: overdue ? C.red : C.text, fontWeight: overdue ? 700 : 400 }}>{e.nextMaint || "—"} {overdue && "⚠️"}</TD>
              <TD><Badge color={e.condition === "Excellent" ? "green" : e.condition === "Good" ? "blue" : e.condition === "Fair" ? "yellow" : "red"}>{e.condition}</Badge></TD>
              <TD><div style={{ display: "flex", gap: 5 }}>
                <Btn sm variant="ghost" onClick={() => openEdit("equip", e)}>✏️</Btn>
                <Btn sm variant="danger" onClick={() => askDel("Delete equipment?", () => remove(setEquipment, e.id))}>🗑️</Btn>
              </div></TD>
            </tr>
          );
        })} />
    </Card>
  );

  const PageExpenses = () => {
    const catTotals = {};
    expenses.forEach(e => { catTotals[e.cat] = (catTotals[e.cat] || 0) + e.amount; });
    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 18 }}>
          <StatCard icon="💸" value={fmtPKR(totalExpenses)} label="Total Expenses" subColor={C.red} />
          <StatCard icon="🌾" value={fmtPKR(catTotals["Feed Purchase"] || 0)} label="Feed Costs" subColor={C.accent} />
          <StatCard icon="👷" value={fmtPKR(catTotals["Labour/Wages"] || 0)} label="Labour" subColor={C.blue} />
        </div>
        <Card title="Expenses" action={<Btn onClick={() => openAdd("expense")}>+ Add Expense</Btn>}>
          <DataTable heads={["Date", "Category", "Description", "Amount", "Paid To", "Method", ""]}
            rows={[...expenses].reverse().map(e => (
              <tr key={e.id}>
                <TD>{e.date}</TD><TD><Badge color="yellow">{e.cat}</Badge></TD>
                <TD>{e.desc}</TD><TD bold red>{fmtPKR(e.amount)}</TD>
                <TD>{e.payee}</TD><TD muted>{e.pay}</TD>
                <TD><div style={{ display: "flex", gap: 5 }}>
                  <Btn sm variant="ghost" onClick={() => openEdit("expense", e)}>✏️</Btn>
                  <Btn sm variant="danger" onClick={() => askDel("Delete expense?", () => remove(setExpenses, e.id))}>🗑️</Btn>
                </div></TD>
              </tr>
            ))} />
        </Card>
      </div>
    );
  };

  const PageRevenue = () => {
    const profit = totalRevenue - totalExpenses;
    const margin = totalRevenue > 0 ? (profit / totalRevenue * 100).toFixed(1) : 0;
    const catTotals = {};
    expenses.forEach(e => { catTotals[e.cat] = (catTotals[e.cat] || 0) + e.amount; });
    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 18 }}>
          <StatCard icon="💰" value={fmtPKR(totalRevenue)} label="Total Revenue" subColor={C.green} />
          <StatCard icon="📈" value={fmtPKR(Math.abs(profit))} label={profit >= 0 ? "Net Profit" : "Net Loss"} subColor={profit >= 0 ? C.green : C.red} />
          <StatCard icon="🎯" value={margin + "%"} label="Profit Margin" subColor={profit >= 0 ? C.green : C.red} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Card title="Revenue Sources">
            <div style={{ padding: 16 }}>
              {sales.map(g => { const rev = Math.floor((g.gradeA + g.gradeB + g.gradeC) / 30) * g.pricePerCrate; return <div key={g.id} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid rgba(48,54,61,.4)", fontSize: 13 }}><span>{g.date} — {g.buyer}</span><span style={{ color: C.green, fontWeight: 700 }}>{fmtPKR(rev)}</span></div>; })}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontSize: 14, fontWeight: 700 }}><span>Total</span><span style={{ color: C.green }}>{fmtPKR(totalRevenue)}</span></div>
            </div>
          </Card>
          <Card title="Expense Breakdown">
            <div style={{ padding: 16 }}>
              {Object.entries(catTotals).map(([cat, amt]) => <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid rgba(48,54,61,.4)", fontSize: 13 }}><span>{cat}</span><span style={{ color: C.red, fontWeight: 700 }}>{fmtPKR(amt)}</span></div>)}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontSize: 14, fontWeight: 700 }}><span>Total</span><span style={{ color: C.red }}>{fmtPKR(totalExpenses)}</span></div>
              <div style={{ background: profit >= 0 ? "rgba(63,185,80,.1)" : "rgba(248,81,73,.1)", border: `1px solid ${profit >= 0 ? "rgba(63,185,80,.3)" : "rgba(248,81,73,.3)"}`, borderRadius: 10, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700 }}>Net {profit >= 0 ? "Profit" : "Loss"}</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: profit >= 0 ? C.green : C.red }}>{fmtPKR(Math.abs(profit))}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const PageReports = () => {
    const totalEggs = eggs.reduce((s, e) => s + e.total, 0);
    const totalSold = sales.reduce((s, g) => s + g.gradeA + g.gradeB + g.gradeC, 0);
    const days = [...new Set(eggs.map(e => e.date))].length || 1;
    const mort = mortality.reduce((s, m) => s + m.count, 0);
    const profit = totalRevenue - totalExpenses;
    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 18 }}>
          {[
            ["🥚 Production", [["Total Eggs", fmtN(totalEggs)], ["Total Crates", fmtN(Math.floor(totalEggs / 30))], ["Avg Daily", fmtN(Math.round(totalEggs / days))], ["Eggs Sold", fmtN(totalSold)]]],
            ["💰 Financial", [["Revenue", fmtPKR(totalRevenue)], ["Expenses", fmtPKR(totalExpenses)], ["Profit/Loss", fmtPKR(profit)], ["Margin", totalRevenue > 0 ? (profit / totalRevenue * 100).toFixed(1) + "%" : "0%"]]],
            ["🐔 Flock", [["Birds Placed", fmtN(flocks.reduce((s, f) => s + f.birdsPlaced, 0))], ["Live Birds", fmtN(totalBirds)], ["Total Deaths", fmtN(mort)], ["HDP Today", hdp + "%"]]],
          ].map(([title, rows]) => (
            <Card key={title} title={title}>
              <div style={{ padding: 16 }}>
                {rows.map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(48,54,61,.4)", fontSize: 13 }}><span style={{ color: C.muted }}>{l}</span><span style={{ fontWeight: 700 }}>{v}</span></div>)}
              </div>
            </Card>
          ))}
        </div>
        <Card title="Flock Performance Table">
          <DataTable heads={["Flock", "House", "Breed", "Placed", "Live", "Deaths", "Mortality%", "Age (wks)", "Phase"]}
            rows={flocks.map(f => {
              const deaths = mortality.filter(m => m.flockId === f.id).reduce((s, m) => s + m.count, 0);
              const mPct = ((f.birdsPlaced - f.liveBirds) / f.birdsPlaced * 100).toFixed(2);
              const p = getPhase(f.ageWeeks, f.placedDate);
              return (
                <tr key={f.id}>
                  <TD bold>{f.name}</TD><TD>{f.house}</TD><TD>{f.breed}</TD>
                  <TD>{fmtN(f.birdsPlaced)}</TD><TD green bold>{fmtN(f.liveBirds)}</TD>
                  <TD red>{deaths}</TD>
                  <TD style={{ color: +mPct > 5 ? C.red : +mPct > 2 ? C.accent : C.green }}>{mPct}%</TD>
                  <TD>{f.ageWeeks + weeksAgo(f.placedDate)}</TD>
                  <TD><span style={{ background: p.col + "22", color: p.col, borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>{p.label}</span></TD>
                </tr>
              );
            })} />
        </Card>
      </div>
    );
  };

  const Pages = { dashboard: PageDashboard, flocks: PageFlocks, mortality: PageMortality, eggs: PageEggs, sales: PageSales, feed: PageFeed, medicine: PageMedicine, equipment: PageEquipment, expenses: PageExpenses, revenue: PageRevenue, reports: PageReports };
  const CurrentPage = Pages[page] || PageDashboard;

  // ── MODAL FORMS ──
  const MODALS = modal && {
    flock: { title: modal.mode === "add" ? "🐣 Add New Flock" : "✏️ Edit Flock", onSave: saveFlock, body: (<>
      <Row><FG label="Flock Name *" half><Inp placeholder="FLOCK-2025-A" value={form.name || ""} onChange={e => sf("name", e.target.value)} /></FG><FG label="House / Shed" half><Inp placeholder="House 1" value={form.house || ""} onChange={e => sf("house", e.target.value)} /></FG></Row>
      <Row><FG label="Breed" half><Sel value={form.breed || "Hy-Line Brown"} onChange={e => sf("breed", e.target.value)}>{["Hy-Line Brown","Lohmann Brown","ISA Brown","Bovans Brown","Novogen Brown","Shaver White","Other"].map(b=><option key={b}>{b}</option>)}</Sel></FG><FG label="Birds Placed *" half><Inp type="number" value={form.birdsPlaced||""} onChange={e=>sf("birdsPlaced",e.target.value)}/></FG></Row>
      {modal.mode==="edit" && <Row><FG label="Current Live Birds" half><Inp type="number" value={form.liveBirds||""} onChange={e=>sf("liveBirds",e.target.value)}/></FG></Row>}
      <Row><FG label="Date Placed" half><Inp type="date" value={form.placedDate||today()} onChange={e=>sf("placedDate",e.target.value)}/></FG><FG label="Age at Placement (wks)" half><Inp type="number" value={form.ageWeeks||""} onChange={e=>sf("ageWeeks",e.target.value)}/></FG></Row>
      <Row><FG label="Source / Hatchery" half><Inp value={form.source||""} onChange={e=>sf("source",e.target.value)}/></FG><FG label="Cost per Bird (₨)" half><Inp type="number" value={form.costPerBird||""} onChange={e=>sf("costPerBird",e.target.value)}/></FG></Row>
      <FG label="Notes"><Txt value={form.notes||""} onChange={e=>sf("notes",e.target.value)}/></FG>
    </>) },
    mortality: { title: modal.mode === "add" ? "☠️ Log Mortality" : "✏️ Edit Mortality", onSave: saveMortality, body: (<>
      <Row><FG label="Date" half><Inp type="date" value={form.date||today()} onChange={e=>sf("date",e.target.value)}/></FG><FG label="Flock *" half><Sel value={form.flockId||""} onChange={e=>sf("flockId",e.target.value)}><option value="">— Select —</option>{flocks.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</Sel></FG></Row>
      <Row><FG label="Deaths *" half><Inp type="number" value={form.count||""} onChange={e=>sf("count",e.target.value)}/></FG><FG label="Cause" half><Sel value={form.cause||"Unknown"} onChange={e=>sf("cause",e.target.value)}>{["Disease","Heat Stress","Trauma/Injury","Prolapse","Pecking","Unknown","Other"].map(c=><option key={c}>{c}</option>)}</Sel></FG></Row>
      <Row><FG label="Disposal" half><Sel value={form.disposal||"Buried"} onChange={e=>sf("disposal",e.target.value)}>{["Buried","Incinerated","Composted","Vendor Collected"].map(c=><option key={c}>{c}</option>)}</Sel></FG><FG label="Reported By" half><Inp value={form.by||""} onChange={e=>sf("by",e.target.value)}/></FG></Row>
      <FG label="Notes"><Txt value={form.notes||""} onChange={e=>sf("notes",e.target.value)}/></FG>
    </>) },
    egg: { title: modal.mode === "add" ? "🥚 Record Egg Collection" : "✏️ Edit Collection", onSave: saveEgg, body: (<>
      <Row><FG label="Date" half><Inp type="date" value={form.date||today()} onChange={e=>sf("date",e.target.value)}/></FG><FG label="Flock *" half><Sel value={form.flockId||""} onChange={e=>sf("flockId",e.target.value)}><option value="">— Select —</option>{flocks.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</Sel></FG></Row>
      <Row><FG label="Shift" half><Sel value={form.shift||"Morning"} onChange={e=>sf("shift",e.target.value)}>{["Morning","Afternoon","Evening"].map(s=><option key={s}>{s}</option>)}</Sel></FG><FG label="Total Eggs *" half><Inp type="number" value={form.total||""} onChange={e=>sf("total",e.target.value)}/></FG></Row>
      <Row><FG label="Broken" half><Inp type="number" value={form.broken||0} onChange={e=>sf("broken",e.target.value)}/></FG><FG label="Floor Eggs" half><Inp type="number" value={form.floor||0} onChange={e=>sf("floor",e.target.value)}/></FG></Row>
      <FG label="Collector"><Inp value={form.collector||""} onChange={e=>sf("collector",e.target.value)}/></FG>
    </>) },
    sale: { title: modal.mode === "add" ? "⚖️ Record Sale" : "✏️ Edit Sale", onSave: saveSale, body: (<>
      <Row><FG label="Date" half><Inp type="date" value={form.date||today()} onChange={e=>sf("date",e.target.value)}/></FG><FG label="Buyer *" half><Inp value={form.buyer||""} onChange={e=>sf("buyer",e.target.value)}/></FG></Row>
      <Row><FG label="Grade A (eggs)" half><Inp type="number" value={form.gradeA||0} onChange={e=>sf("gradeA",e.target.value)}/></FG><FG label="Grade B" half><Inp type="number" value={form.gradeB||0} onChange={e=>sf("gradeB",e.target.value)}/></FG></Row>
      <Row><FG label="Grade C" half><Inp type="number" value={form.gradeC||0} onChange={e=>sf("gradeC",e.target.value)}/></FG><FG label="Price / Crate (₨) *" half><Inp type="number" value={form.pricePerCrate||""} onChange={e=>sf("pricePerCrate",e.target.value)}/></FG></Row>
      <FG label="Payment Status"><Sel value={form.status||"Paid"} onChange={e=>sf("status",e.target.value)}>{["Paid","Pending","Partial"].map(s=><option key={s}>{s}</option>)}</Sel></FG>
    </>) },
    feed: { title: modal.mode === "add" ? "🌾 Add Feed Stock" : "✏️ Edit Feed", onSave: saveFeedStock, body: (<>
      <Row><FG label="Feed Type *" half><Sel value={form.type||""} onChange={e=>sf("type",e.target.value)}><option value="">— Select —</option>{["Chick Starter","Grower Feed","Developer Feed","Layer Feed Phase 1","Layer Feed Phase 2","Limestone/Shell Grit","Vitamin Supplement","Custom"].map(t=><option key={t}>{t}</option>)}</Sel></FG><FG label="Supplier" half><Inp value={form.supplier||""} onChange={e=>sf("supplier",e.target.value)}/></FG></Row>
      <Row><FG label="Batch No." half><Inp value={form.batch||""} onChange={e=>sf("batch",e.target.value)}/></FG><FG label="Quantity (kg) *" half><Inp type="number" value={form.qty||""} onChange={e=>sf("qty",e.target.value)}/></FG></Row>
      <Row><FG label="Cost/kg (₨)" half><Inp type="number" value={form.costPerKg||""} onChange={e=>sf("costPerKg",e.target.value)}/></FG><FG label="Min Stock (kg)" half><Inp type="number" value={form.minQty||500} onChange={e=>sf("minQty",e.target.value)}/></FG></Row>
      <Row><FG label="Expiry Date" half><Inp type="date" value={form.expiry||""} onChange={e=>sf("expiry",e.target.value)}/></FG><FG label="Storage Location" half><Inp value={form.location||""} onChange={e=>sf("location",e.target.value)}/></FG></Row>
    </>) },
    feedUsage: { title: "🌾 Record Feed Usage", onSave: saveFeedUsage, body: (<>
      <Row><FG label="Date" half><Inp type="date" value={form.date||today()} onChange={e=>sf("date",e.target.value)}/></FG><FG label="Flock *" half><Sel value={form.flockId||""} onChange={e=>sf("flockId",e.target.value)}><option value="">— Select —</option>{flocks.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</Sel></FG></Row>
      <Row><FG label="Feed *" half><Sel value={form.feedId||""} onChange={e=>sf("feedId",e.target.value)}><option value="">— Select —</option>{feed.map(f=><option key={f.id} value={f.id}>{f.type} ({fmtN(f.qty)}kg)</option>)}</Sel></FG><FG label="Qty Used (kg) *" half><Inp type="number" value={form.qty||""} onChange={e=>sf("qty",e.target.value)}/></FG></Row>
      <Row><FG label="Fed By" half><Inp value={form.by||""} onChange={e=>sf("by",e.target.value)}/></FG><FG label="Notes" half><Inp value={form.notes||""} onChange={e=>sf("notes",e.target.value)}/></FG></Row>
    </>) },
    med: { title: modal.mode === "add" ? "💊 Add Medicine" : "✏️ Edit Medicine", onSave: saveMed, body: (<>
      <Row><FG label="Name *" half><Inp value={form.name||""} onChange={e=>sf("name",e.target.value)}/></FG><FG label="Type" half><Sel value={form.type||"Vaccine"} onChange={e=>sf("type",e.target.value)}>{["Vaccine","Antibiotic","Vitamin","Dewormer","Disinfectant","Other"].map(t=><option key={t}>{t}</option>)}</Sel></FG></Row>
      <Row><FG label="Batch No." half><Inp value={form.batch||""} onChange={e=>sf("batch",e.target.value)}/></FG><FG label="Quantity" half><Inp type="number" value={form.qty||""} onChange={e=>sf("qty",e.target.value)}/></FG></Row>
      <Row><FG label="Unit" half><Sel value={form.unit||"Dose"} onChange={e=>sf("unit",e.target.value)}>{["Dose","ml","litre","tablet","sachet","kg"].map(u=><option key={u}>{u}</option>)}</Sel></FG><FG label="Cost/Unit (₨)" half><Inp type="number" value={form.costPerUnit||""} onChange={e=>sf("costPerUnit",e.target.value)}/></FG></Row>
      <Row><FG label="Expiry Date" half><Inp type="date" value={form.expiry||""} onChange={e=>sf("expiry",e.target.value)}/></FG><FG label="Manufacturer" half><Inp value={form.mfg||""} onChange={e=>sf("mfg",e.target.value)}/></FG></Row>
    </>) },
    medUsage: { title: modal.mode === "add" ? "💉 Record Treatment" : "✏️ Edit Treatment", onSave: saveMedUsage, body: (<>
      <Row><FG label="Date" half><Inp type="date" value={form.date||today()} onChange={e=>sf("date",e.target.value)}/></FG><FG label="Flock *" half><Sel value={form.flockId||""} onChange={e=>sf("flockId",e.target.value)}><option value="">— Select —</option>{flocks.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</Sel></FG></Row>
      <Row><FG label="Medicine *" half><Sel value={form.medId||""} onChange={e=>sf("medId",e.target.value)}><option value="">— Select —</option>{medicine.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</Sel></FG><FG label="Dose / Qty" half><Inp value={form.dose||""} onChange={e=>sf("dose",e.target.value)}/></FG></Row>
      <Row><FG label="Route" half><Sel value={form.route||"Drinking Water"} onChange={e=>sf("route",e.target.value)}>{["Drinking Water","Eye Drop","Injection","Spray","Feed"].map(r=><option key={r}>{r}</option>)}</Sel></FG><FG label="Administered By" half><Inp value={form.by||""} onChange={e=>sf("by",e.target.value)}/></FG></Row>
      <FG label="Withdrawal Period (days)"><Inp type="number" value={form.wd||0} onChange={e=>sf("wd",e.target.value)}/></FG>
    </>) },
    equip: { title: modal.mode === "add" ? "🔧 Add Equipment" : "✏️ Edit Equipment", onSave: saveEquip, body: (<>
      <Row><FG label="Name *" half><Inp value={form.name||""} onChange={e=>sf("name",e.target.value)}/></FG><FG label="Category" half><Sel value={form.cat||"Other"} onChange={e=>sf("cat",e.target.value)}>{["Feeding System","Watering System","Egg Collection","Ventilation","Lighting","Heating/Cooling","Caging","Transport","Other"].map(c=><option key={c}>{c}</option>)}</Sel></FG></Row>
      <Row><FG label="Quantity" half><Inp type="number" value={form.qty||1} onChange={e=>sf("qty",e.target.value)}/></FG><FG label="Location" half><Inp value={form.location||""} onChange={e=>sf("location",e.target.value)}/></FG></Row>
      <Row><FG label="Purchase Date" half><Inp type="date" value={form.purchaseDate||today()} onChange={e=>sf("purchaseDate",e.target.value)}/></FG><FG label="Last Maintenance" half><Inp type="date" value={form.lastMaint||""} onChange={e=>sf("lastMaint",e.target.value)}/></FG></Row>
      <Row><FG label="Next Maintenance" half><Inp type="date" value={form.nextMaint||""} onChange={e=>sf("nextMaint",e.target.value)}/></FG><FG label="Condition" half><Sel value={form.condition||"Good"} onChange={e=>sf("condition",e.target.value)}>{["Excellent","Good","Fair","Needs Repair"].map(c=><option key={c}>{c}</option>)}</Sel></FG></Row>
    </>) },
    expense: { title: modal.mode === "add" ? "💸 Add Expense" : "✏️ Edit Expense", onSave: saveExpense, body: (<>
      <Row><FG label="Date" half><Inp type="date" value={form.date||today()} onChange={e=>sf("date",e.target.value)}/></FG><FG label="Category" half><Sel value={form.cat||"Miscellaneous"} onChange={e=>sf("cat",e.target.value)}>{["Feed Purchase","Medicine/Vaccine","Labour/Wages","Utilities","Equipment Maintenance","Bird Purchase","Transport","Miscellaneous"].map(c=><option key={c}>{c}</option>)}</Sel></FG></Row>
      <Row><FG label="Description" half><Inp value={form.desc||""} onChange={e=>sf("desc",e.target.value)}/></FG><FG label="Amount (₨) *" half><Inp type="number" value={form.amount||""} onChange={e=>sf("amount",e.target.value)}/></FG></Row>
      <Row><FG label="Paid To" half><Inp value={form.payee||""} onChange={e=>sf("payee",e.target.value)}/></FG><FG label="Payment Method" half><Sel value={form.pay||"Cash"} onChange={e=>sf("pay",e.target.value)}>{["Cash","Bank Transfer","Cheque","Credit"].map(p=><option key={p}>{p}</option>)}</Sel></FG></Row>
    </>) },
  }[modal?.type];

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: C.bg, color: C.text, minHeight: "100vh", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#484f58;border-radius:4px}
        @keyframes slideIn{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:none}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}}
        select option{background:#21262d}
        tbody tr:hover td{background:rgba(48,54,61,.25)}
      `}</style>

      <aside style={{ width: 218, background: C.surface, borderRight: "1px solid #30363d", display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0, left: 0, overflowY: "auto", zIndex: 100 }}>
        <div style={{ padding: "20px 16px 15px", borderBottom: "1px solid #30363d" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#f0b429,#e07b39)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>🐔</div>
            <div>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 16 }}>LayerPro</div>
              <div style={{ fontSize: 9, color: C.muted, letterSpacing: "2px", textTransform: "uppercase" }}>Farm Management</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "10px 8px" }}>
          {groups.map(group => (
            <div key={group}>
              <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "2px", color: "#484f58", padding: "10px 8px 4px", fontWeight: 700 }}>{group}</div>
              {navItems.filter(n => n.group === group).map(n => (
                <div key={n.id} onClick={() => setPage(n.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 9px", borderRadius: 7, cursor: "pointer", marginBottom: 1, fontSize: 13, fontWeight: 500, background: page === n.id ? "rgba(240,180,41,.1)" : "transparent", color: page === n.id ? C.accent : C.muted, border: page === n.id ? "1px solid rgba(240,180,41,.2)" : "1px solid transparent", transition: "all .12s" }}>
                  <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{n.icon}</span>{n.label}
                  {n.id === "feed" && lowFeed > 0 && <span style={{ marginLeft: "auto", background: C.red, color: "#fff", borderRadius: 10, fontSize: 10, padding: "1px 6px", fontWeight: 700 }}>{lowFeed}</span>}
                </div>
              ))}
            </div>
          ))}
        </nav>
        <div style={{ padding: "12px 10px", borderTop: "1px solid #30363d" }}>
          <div style={{ background: "#21262d", borderRadius: 10, padding: 11, border: "1px solid #30363d" }}>
            <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>Farm Status</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4, fontSize: 12, fontWeight: 700, color: C.green }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green }} /> Operational
            </div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 5 }}>{flocks.length} Flocks · {fmtN(totalBirds)} Birds</div>
          </div>
        </div>
      </aside>

      <main style={{ marginLeft: 218, flex: 1, minHeight: "100vh" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(13,17,23,.93)", backdropFilter: "blur(12px)", borderBottom: "1px solid #30363d", padding: "11px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 18 }}>{navItems.find(n => n.id === page)?.label || "Dashboard"}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>LayerPro · {new Date().toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
          </div>
        </div>
        <div style={{ padding: 22 }}><CurrentPage /></div>
      </main>

      {modal && MODALS && (
        <Modal open title={MODALS.title} onClose={closeModal} onSave={MODALS.onSave} saveLabel={modal.mode === "edit" ? "Update" : "Save"}>
          {MODALS.body}
        </Modal>
      )}

      <ConfirmDlg open={!!confirm} msg={confirm?.msg} onYes={confirm?.onYes} onNo={() => setConfirm(null)} />

      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background: "#21262d", border: "1px solid #30363d", borderRadius: 10, padding: "11px 16px", fontSize: 13, display: "flex", alignItems: "center", gap: 10, minWidth: 230, boxShadow: "0 8px 32px rgba(0,0,0,.5)", animation: "slideIn .2s ease", borderLeft: `3px solid ${t.type === "success" ? C.green : t.type === "warn" ? C.accent : t.type === "error" ? C.red : C.blue}` }}>
            {t.type === "success" ? "✅" : t.type === "warn" ? "⚠️" : t.type === "error" ? "❌" : "ℹ️"} {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
