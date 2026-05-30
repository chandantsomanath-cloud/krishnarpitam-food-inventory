import { useState, useMemo } from "react";

// ── Seed Data ──────────────────────────────────────────────────────────────
const CATEGORIES = ["Groceries", "Vessels", "Serving Items", "Vegetables"];

const initInventory = [
  { id: 1, name: "Rice", qty: 50, unit: "kg", category: "Groceries", purchaseDate: "2026-05-20", supplier: "AK Traders", ratePerUnit: 42, lowStockQty: 10 },
  { id: 2, name: "Dal", qty: 8, unit: "kg", category: "Groceries", purchaseDate: "2026-05-18", supplier: "AK Traders", ratePerUnit: 110, lowStockQty: 10 },
  { id: 3, name: "Cooking Oil", qty: 6, unit: "L", category: "Groceries", purchaseDate: "2026-05-15", supplier: "Sun Foods", ratePerUnit: 140, lowStockQty: 10 },
  { id: 4, name: "Tomatoes", qty: 4, unit: "kg", category: "Vegetables", purchaseDate: "2026-05-29", supplier: "Local Market", ratePerUnit: 30, lowStockQty: 5 },
  { id: 5, name: "Onions", qty: 12, unit: "kg", category: "Vegetables", purchaseDate: "2026-05-28", supplier: "Local Market", ratePerUnit: 25, lowStockQty: 5 },
  { id: 6, name: "Steel Plates", qty: 40, unit: "pcs", category: "Vessels", purchaseDate: "2026-04-10", supplier: "Kitchenware Co", ratePerUnit: 85, lowStockQty: 10 },
  { id: 7, name: "Serving Spoons", qty: 3, unit: "pcs", category: "Serving Items", purchaseDate: "2026-04-10", supplier: "Kitchenware Co", ratePerUnit: 60, lowStockQty: 5 },
];

const initPurchaseHistory = [
  { id: 1, date: "2026-05-20", item: "Rice", qty: 50, unit: "kg", supplier: "AK Traders", amount: 2100 },
  { id: 2, date: "2026-05-18", item: "Dal", qty: 20, unit: "kg", supplier: "AK Traders", amount: 2200 },
  { id: 3, date: "2026-05-15", item: "Cooking Oil", qty: 10, unit: "L", supplier: "Sun Foods", amount: 1400 },
];

const initMovements = [
  { id: 1, date: "2026-05-25", item: "Rice", type: "Deducted", qty: 5, unit: "kg", purpose: "Lunch service" },
  { id: 2, date: "2026-05-26", item: "Dal", type: "Deducted", qty: 2, unit: "kg", purpose: "Dinner service" },
  { id: 3, date: "2026-05-20", item: "Rice", type: "Added", qty: 50, unit: "kg", purpose: "Purchase" },
];

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const today = () => new Date().toISOString().split("T")[0];

// ── Colour tokens ──────────────────────────────────────────────────────────
const C = {
  bg: "#FFF8F0",
  card: "#FFFFFF",
  primary: "#B5451B",
  primaryLight: "#F2E0D8",
  accent: "#E8871A",
  accentLight: "#FFF0D6",
  text: "#1C1008",
  muted: "#7A5C44",
  border: "#EAD9CC",
  low: "#DC2626",
  lowBg: "#FEF2F2",
  added: "#16A34A",
  addedBg: "#F0FDF4",
  tagBg: "#F5EDE6",
};

// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("home");
  const [inventory, setInventory] = useState(initInventory);
  const [purchases, setPurchases] = useState(initPurchaseHistory);
  const [movements, setMovements] = useState(initMovements);

  const lowStock = inventory.filter((i) => i.qty <= i.lowStockQty);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: C.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      {tab === "welcome" ? (
        <WelcomePage onEnter={() => setTab("home")} />
      ) : (
        <>
          <Header />
          <TabBar tab={tab} setTab={setTab} />
          <div style={{ flex: 1, overflowY: "auto", paddingBottom: 16 }}>
            {tab === "home" && <HomePage lowStock={lowStock} inventory={inventory} setTab={setTab} />}
            {tab === "inventory" && <InventoryTab inventory={inventory} />}
            {tab === "addStock" && <AddStockTab inventory={inventory} setInventory={setInventory} setPurchases={setPurchases} setMovements={setMovements} />}
            {tab === "useStock" && <UseStockTab inventory={inventory} setInventory={setInventory} setMovements={setMovements} />}
            {tab === "purchaseHistory" && <PurchaseHistoryTab purchases={purchases} />}
            {tab === "stockMovement" && <StockMovementTab movements={movements} />}
          </div>
        </>
      )}
    </div>
  );
}

// ── Welcome Page ───────────────────────────────────────────────────────────
function WelcomePage({ onEnter }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 32, background: `linear-gradient(160deg, ${C.primary} 0%, #7A2510 100%)` }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🍛</div>
      <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 800, textAlign: "center", margin: 0 }}>Krishnarpitham Foods</h1>
      <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 6, marginBottom: 40, textAlign: "center", fontSize: 14 }}>Inventory Management System</p>
      <button onClick={onEnter} style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 12, padding: "14px 40px", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
        Open App →
      </button>
    </div>
  );
}

// ── Header ─────────────────────────────────────────────────────────────────
function Header() {
  return (
    <div style={{ background: C.primary, padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 22 }}>🍛</span>
      <div>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, lineHeight: 1.2 }}>Krishnarpitham Foods</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11 }}>Inventory App</div>
      </div>
    </div>
  );
}

// ── Tab Bar ────────────────────────────────────────────────────────────────
const TABS = [
  { key: "home", label: "Home", icon: "🏠" },
  { key: "inventory", label: "Inventory", icon: "📦" },
  { key: "addStock", label: "Add Stock", icon: "➕" },
  { key: "useStock", label: "Use Stock", icon: "📤" },
  { key: "purchaseHistory", label: "Purchases", icon: "🧾" },
  { key: "stockMovement", label: "Movement", icon: "🔄" },
];

function TabBar({ tab, setTab }) {
  return (
    <div style={{ display: "flex", overflowX: "auto", background: "#fff", borderBottom: `2px solid ${C.border}`, scrollbarWidth: "none" }}>
      {TABS.map((t) => (
        <button key={t.key} onClick={() => setTab(t.key)}
          style={{ flex: "0 0 auto", padding: "10px 14px", border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, borderBottom: tab === t.key ? `3px solid ${C.primary}` : "3px solid transparent", color: tab === t.key ? C.primary : C.muted, fontWeight: tab === t.key ? 700 : 400, fontSize: 10, transition: "all 0.15s" }}>
          <span style={{ fontSize: 16 }}>{t.icon}</span>{t.label}
        </button>
      ))}
    </div>
  );
}

// ── Home Page ──────────────────────────────────────────────────────────────
function HomePage({ lowStock, inventory, setTab }) {
  const totalValue = inventory.reduce((s, i) => s + i.qty * i.ratePerUnit, 0);
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <SummaryCard icon="📦" label="Total Items" value={inventory.length} color={C.primary} />
        <SummaryCard icon="⚠️" label="Low Stock" value={lowStock.length} color={C.low} />
        <SummaryCard icon="💰" label="Total Value" value={fmt(totalValue)} color={C.accent} span={2} />
      </div>

      {/* Low stock alerts */}
      {lowStock.length > 0 && (
        <Section title="⚠️ Low Stock Alerts" titleColor={C.low} bg={C.lowBg} border="#FCA5A5">
          {lowStock.map((i) => (
            <div key={i.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid #FEE2E2` }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{i.name}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{i.category}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, color: C.low, fontSize: 15 }}>{i.qty} {i.unit}</div>
                <div style={{ fontSize: 11, color: C.muted }}>min: {i.lowStockQty}</div>
              </div>
            </div>
          ))}
          <button onClick={() => setTab("addStock")} style={btnStyle(C.low)}>Add Stock Now</button>
        </Section>
      )}

      {/* Quick inventory overview */}
      <Section title="📋 Inventory Overview">
        {inventory.slice(0, 5).map((i) => (
          <div key={i.id} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 13, color: C.text }}>{i.name}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: i.qty <= i.lowStockQty ? C.low : C.added }}>{i.qty} {i.unit}</span>
          </div>
        ))}
        <button onClick={() => setTab("inventory")} style={{ ...btnStyle(C.primary), marginTop: 8 }}>View All Inventory</button>
      </Section>
    </div>
  );
}

function SummaryCard({ icon, label, value, color, span }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", border: `1px solid ${C.border}`, gridColumn: span === 2 ? "span 2" : undefined, display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
      </div>
    </div>
  );
}

function Section({ title, children, titleColor, bg, border }) {
  return (
    <div style={{ background: bg || C.card, borderRadius: 12, padding: 16, border: `1px solid ${border || C.border}` }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: titleColor || C.text, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

// ── Inventory Tab ──────────────────────────────────────────────────────────
function InventoryTab({ inventory }) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  const filtered = useMemo(() => {
    let list = inventory.filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterCat === "All" || i.category === filterCat)
    );
    if (sortBy === "qty") list = [...list].sort((a, b) => a.qty - b.qty);
    else if (sortBy === "value") list = [...list].sort((a, b) => b.qty * b.ratePerUnit - a.qty * a.ratePerUnit);
    else list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [inventory, search, filterCat, sortBy]);

  const exportCSV = () => {
    const header = "Item,Qty,Unit,Category,Purchase Date,Supplier,Rate/Unit,Total Value\n";
    const rows = filtered.map((i) => `${i.name},${i.qty},${i.unit},${i.category},${i.purchaseDate},${i.supplier},${i.ratePerUnit},${i.qty * i.ratePerUnit}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "inventory.csv"; a.click();
  };

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <input placeholder="🔍  Search items…" value={search} onChange={(e) => setSearch(e.target.value)} style={inputStyle} />

      <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
        {["All", ...CATEGORIES].map((c) => (
          <button key={c} onClick={() => setFilterCat(c)} style={{ flex: "0 0 auto", padding: "5px 12px", borderRadius: 20, border: `1px solid ${filterCat === c ? C.primary : C.border}`, background: filterCat === c ? C.primary : "#fff", color: filterCat === c ? "#fff" : C.muted, fontSize: 12, cursor: "pointer", fontWeight: filterCat === c ? 700 : 400 }}>{c}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 12, color: C.muted }}>Sort:</span>
        {[["name", "Name"], ["qty", "Qty"], ["value", "Value"]].map(([v, l]) => (
          <button key={v} onClick={() => setSortBy(v)} style={{ padding: "4px 10px", borderRadius: 8, border: `1px solid ${sortBy === v ? C.accent : C.border}`, background: sortBy === v ? C.accentLight : "#fff", color: sortBy === v ? C.accent : C.muted, fontSize: 12, cursor: "pointer", fontWeight: sortBy === v ? 700 : 400 }}>{l}</button>
        ))}
        <button onClick={exportCSV} style={{ marginLeft: "auto", padding: "5px 12px", background: C.addedBg, border: `1px solid #86EFAC`, color: C.added, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>📊 Export</button>
      </div>

      {filtered.length === 0 ? <Empty text="No items found" /> : filtered.map((item) => <InventoryCard key={item.id} item={item} />)}
    </div>
  );
}

function InventoryCard({ item }) {
  const isLow = item.qty <= item.lowStockQty;
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 14, border: `1px solid ${isLow ? "#FCA5A5" : C.border}`, background: isLow ? C.lowBg : "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{item.name}</div>
          <span style={{ fontSize: 11, background: C.tagBg, color: C.primary, padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>{item.category}</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: isLow ? C.low : C.primary }}>{item.qty} <span style={{ fontSize: 12 }}>{item.unit}</span></div>
          {isLow && <div style={{ fontSize: 10, color: C.low, fontWeight: 600 }}>LOW STOCK</div>}
        </div>
      </div>
      <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
        {[["Supplier", item.supplier], ["Purchased", item.purchaseDate], ["Rate/unit", fmt(item.ratePerUnit)], ["Total Value", fmt(item.qty * item.ratePerUnit)]].map(([k, v]) => (
          <div key={k} style={{ fontSize: 12 }}>
            <span style={{ color: C.muted }}>{k}: </span>
            <span style={{ color: C.text, fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Add Stock Tab ──────────────────────────────────────────────────────────
function AddStockTab({ inventory, setInventory, setPurchases, setMovements }) {
  const [form, setForm] = useState({ name: "", qty: "", unit: "kg", category: "Groceries", purchaseDate: today(), supplier: "", ratePerUnit: "", lowStockQty: "10" });
  const [success, setSuccess] = useState(null);
  const [isNew, setIsNew] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQ, setSearchQ] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const selectExisting = (item) => {
    setSelectedItem(item);
    setIsNew(false);
    setForm({ ...item, qty: "", purchaseDate: today() });
    setSearchQ(item.name);
  };

  const handleSubmit = () => {
    if (!form.name || !form.qty || !form.ratePerUnit) return alert("Please fill all required fields");
    const qty = parseFloat(form.qty);
    const rate = parseFloat(form.ratePerUnit);

    if (isNew) {
      const newItem = { ...form, id: Date.now(), qty, ratePerUnit: rate, lowStockQty: parseFloat(form.lowStockQty) || 10 };
      setInventory((prev) => [...prev, newItem]);
      setSuccess({ prev: 0, added: qty, current: qty, name: form.name });
    } else {
      const prev = selectedItem.qty;
      setInventory((inv) => inv.map((i) => i.id === selectedItem.id ? { ...i, qty: i.qty + qty, ratePerUnit: rate, purchaseDate: form.purchaseDate, supplier: form.supplier } : i));
      setSuccess({ prev, added: qty, current: prev + qty, name: form.name });
    }

    setPurchases((p) => [...p, { id: Date.now(), date: form.purchaseDate, item: form.name, qty, unit: form.unit, supplier: form.supplier, amount: qty * rate }]);
    setMovements((m) => [...m, { id: Date.now(), date: form.purchaseDate, item: form.name, type: "Added", qty, unit: form.unit, purpose: "Purchase" }]);
    setForm({ name: "", qty: "", unit: "kg", category: "Groceries", purchaseDate: today(), supplier: "", ratePerUnit: "", lowStockQty: "10" });
    setSelectedItem(null); setIsNew(true); setSearchQ("");
  };

  const matches = searchQ ? inventory.filter((i) => i.name.toLowerCase().includes(searchQ.toLowerCase())) : [];

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      {success && (
        <div style={{ background: C.addedBg, border: `1px solid #86EFAC`, borderRadius: 12, padding: 14 }}>
          <div style={{ fontWeight: 700, color: C.added, marginBottom: 6 }}>✅ Stock Added Successfully!</div>
          <div style={{ fontSize: 13, color: C.text }}><b>{success.name}</b></div>
          <div style={{ fontSize: 13, color: C.muted }}>Previous: {success.prev} → Added: +{success.added} → <b style={{ color: C.added }}>Current: {success.current}</b></div>
          <button onClick={() => setSuccess(null)} style={{ ...btnStyle(C.added), marginTop: 8 }}>Add Another</button>
        </div>
      )}

      {!success && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>➕ Add Stock</div>

          <div style={{ display: "flex", gap: 8 }}>
            {["Existing Item", "New Item"].map((l, i) => (
              <button key={l} onClick={() => { setIsNew(i === 1); setSelectedItem(null); setSearchQ(""); }} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1px solid ${(!isNew && i === 0) || (isNew && i === 1) ? C.primary : C.border}`, background: (!isNew && i === 0) || (isNew && i === 1) ? C.primaryLight : "#fff", color: (!isNew && i === 0) || (isNew && i === 1) ? C.primary : C.muted, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>{l}</button>
            ))}
          </div>

          {!isNew && (
            <div style={{ position: "relative" }}>
              <input placeholder="Search existing item…" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} style={inputStyle} />
              {matches.length > 0 && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                  {matches.map((m) => <div key={m.id} onClick={() => selectExisting(m)} style={{ padding: "10px 14px", cursor: "pointer", fontSize: 13, borderBottom: `1px solid ${C.border}` }}>{m.name} <span style={{ color: C.muted }}>({m.qty} {m.unit})</span></div>)}
                </div>
              )}
            </div>
          )}

          {(isNew || selectedItem) && (
            <>
              {isNew && <Field label="Item Name *" value={form.name} onChange={(v) => set("name", v)} />}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Quantity *" value={form.qty} onChange={(v) => set("qty", v)} type="number" />
                <Field label="Unit" value={form.unit} onChange={(v) => set("unit", v)} />
              </div>
              {isNew && (
                <div>
                  <label style={labelStyle}>Category</label>
                  <select value={form.category} onChange={(e) => set("category", e.target.value)} style={inputStyle}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              )}
              <Field label="Purchase Date" value={form.purchaseDate} onChange={(v) => set("purchaseDate", v)} type="date" />
              <Field label="Purchased From (Supplier)" value={form.supplier} onChange={(v) => set("supplier", v)} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Rate / Unit (₹) *" value={form.ratePerUnit} onChange={(v) => set("ratePerUnit", v)} type="number" />
                {isNew && <Field label="Low Stock Alert Qty" value={form.lowStockQty} onChange={(v) => set("lowStockQty", v)} type="number" />}
              </div>
              {form.qty && form.ratePerUnit && (
                <div style={{ background: C.accentLight, borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
                  <span style={{ color: C.muted }}>Total Rate: </span>
                  <span style={{ fontWeight: 700, color: C.accent }}>{fmt(form.qty * form.ratePerUnit)}</span>
                </div>
              )}
              <button onClick={handleSubmit} style={btnStyle(C.primary)}>Add Stock</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Use Stock Tab ──────────────────────────────────────────────────────────
function UseStockTab({ inventory, setInventory, setMovements }) {
  const [searchQ, setSearchQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState("");
  const [purpose, setPurpose] = useState("");
  const [result, setResult] = useState(null);

  const matches = searchQ ? inventory.filter((i) => i.name.toLowerCase().includes(searchQ.toLowerCase())) : [];

  const handleDeduct = () => {
    if (!selected || !qty) return alert("Select item and enter quantity");
    const q = parseFloat(qty);
    if (q > selected.qty) return alert("Quantity exceeds available stock!");
    const prev = selected.qty;
    setInventory((inv) => inv.map((i) => i.id === selected.id ? { ...i, qty: i.qty - q } : i));
    setMovements((m) => [...m, { id: Date.now(), date: today(), item: selected.name, type: "Deducted", qty: q, unit: selected.unit, purpose }]);
    setResult({ name: selected.name, prev, used: q, remaining: prev - q });
    setSelected(null); setQty(""); setPurpose(""); setSearchQ("");
  };

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      {result && (
        <div style={{ background: C.accentLight, border: `1px solid ${C.accent}`, borderRadius: 12, padding: 14 }}>
          <div style={{ fontWeight: 700, color: C.accent, marginBottom: 6 }}>📤 Stock Deducted</div>
          <div style={{ fontSize: 13, color: C.text }}><b>{result.name}</b></div>
          <div style={{ fontSize: 13, color: C.muted }}>Previous: {result.prev} → Used: -{result.used} → <b style={{ color: C.primary }}>Remaining: {result.remaining}</b></div>
          <button onClick={() => setResult(null)} style={{ ...btnStyle(C.accent), marginTop: 8 }}>Use Another</button>
        </div>
      )}

      {!result && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>📤 Use Stock</div>

          <div style={{ position: "relative" }}>
            <input placeholder="🔍  Search item to use…" value={searchQ} onChange={(e) => { setSearchQ(e.target.value); setSelected(null); }} style={inputStyle} />
            {matches.length > 0 && !selected && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                {matches.map((m) => (
                  <div key={m.id} onClick={() => { setSelected(m); setSearchQ(m.name); }} style={{ padding: "10px 14px", cursor: "pointer", fontSize: 13, borderBottom: `1px solid ${C.border}` }}>
                    {m.name} <span style={{ color: C.muted }}>({m.qty} {m.unit} available)</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selected && (
            <>
              <div style={{ background: C.primaryLight, borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
                <b>{selected.name}</b> — <span style={{ color: C.primary, fontWeight: 700 }}>{selected.qty} {selected.unit} available</span>
              </div>
              <Field label="Quantity to Use *" value={qty} onChange={setQty} type="number" placeholder={`max ${selected.qty}`} />
              <Field label="Purpose (e.g. Lunch service)" value={purpose} onChange={setPurpose} />
              <button onClick={handleDeduct} style={btnStyle(C.primary)}>Deduct Stock</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Purchase History Tab ───────────────────────────────────────────────────
function PurchaseHistoryTab({ purchases }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date");

  const list = useMemo(() => {
    let l = purchases.filter((p) => p.item.toLowerCase().includes(search.toLowerCase()) || p.supplier.toLowerCase().includes(search.toLowerCase()));
    if (sort === "date") l = [...l].sort((a, b) => b.date.localeCompare(a.date));
    else if (sort === "amount") l = [...l].sort((a, b) => b.amount - a.amount);
    else l = [...l].sort((a, b) => a.item.localeCompare(b.item));
    return l;
  }, [purchases, search, sort]);

  const total = list.reduce((s, p) => s + p.amount, 0);

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ background: C.primaryLight, borderRadius: 12, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: C.muted, fontSize: 13 }}>Total Purchases</span>
        <span style={{ fontWeight: 800, fontSize: 18, color: C.primary }}>{fmt(total)}</span>
      </div>
      <input placeholder="🔍  Search by item or supplier…" value={search} onChange={(e) => setSearch(e.target.value)} style={inputStyle} />
      <div style={{ display: "flex", gap: 8 }}>
        {[["date", "Date"], ["amount", "Amount"], ["item", "Item"]].map(([v, l]) => (
          <button key={v} onClick={() => setSort(v)} style={{ padding: "4px 12px", borderRadius: 8, border: `1px solid ${sort === v ? C.accent : C.border}`, background: sort === v ? C.accentLight : "#fff", color: sort === v ? C.accent : C.muted, fontSize: 12, cursor: "pointer", fontWeight: sort === v ? 700 : 400 }}>{l}</button>
        ))}
      </div>
      {list.length === 0 ? <Empty text="No purchase records" /> : list.map((p) => (
        <div key={p.id} style={{ background: "#fff", borderRadius: 12, padding: 14, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{p.item}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{p.supplier} · {p.date}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, color: C.primary }}>{fmt(p.amount)}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{p.qty} {p.unit}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Stock Movement Tab ─────────────────────────────────────────────────────
function StockMovementTab({ movements }) {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("date");
  const [search, setSearch] = useState("");

  const list = useMemo(() => {
    let l = movements.filter((m) =>
      (filter === "All" || m.type === filter) &&
      m.item.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "date") l = [...l].sort((a, b) => b.date.localeCompare(a.date));
    else if (sort === "qty") l = [...l].sort((a, b) => b.qty - a.qty);
    return l;
  }, [movements, filter, sort, search]);

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <input placeholder="🔍  Search by item…" value={search} onChange={(e) => setSearch(e.target.value)} style={inputStyle} />
      <div style={{ display: "flex", gap: 8 }}>
        {["All", "Added", "Deducted"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ flex: 1, padding: "6px", borderRadius: 8, border: `1px solid ${filter === f ? C.primary : C.border}`, background: filter === f ? C.primaryLight : "#fff", color: filter === f ? C.primary : C.muted, fontSize: 12, fontWeight: filter === f ? 700 : 400, cursor: "pointer" }}>{f}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <span style={{ fontSize: 12, color: C.muted, alignSelf: "center" }}>Sort:</span>
        {[["date", "Date"], ["qty", "Qty"]].map(([v, l]) => (
          <button key={v} onClick={() => setSort(v)} style={{ padding: "4px 10px", borderRadius: 8, border: `1px solid ${sort === v ? C.accent : C.border}`, background: sort === v ? C.accentLight : "#fff", color: sort === v ? C.accent : C.muted, fontSize: 12, cursor: "pointer", fontWeight: sort === v ? 700 : 400 }}>{l}</button>
        ))}
      </div>
      {list.length === 0 ? <Empty text="No movements found" /> : list.map((m) => {
        const isAdd = m.type === "Added";
        return (
          <div key={m.id} style={{ background: isAdd ? C.addedBg : C.lowBg, borderRadius: 12, padding: 14, border: `1px solid ${isAdd ? "#86EFAC" : "#FCA5A5"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{m.item}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{m.purpose} · {m.date}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: isAdd ? C.added : C.low }}>{isAdd ? "+" : "-"}{m.qty} {m.unit}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: isAdd ? C.added : C.low }}>{m.type}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Reusable helpers ───────────────────────────────────────────────────────
const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, color: C.text, outline: "none", background: "#fff", boxSizing: "border-box" };
const labelStyle = { fontSize: 12, color: C.muted, fontWeight: 600, display: "block", marginBottom: 4 };
const btnStyle = (color) => ({ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: color, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" });

function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
    </div>
  );
}

function Empty({ text }) {
  return <div style={{ textAlign: "center", padding: 32, color: C.muted, fontSize: 14 }}>🗂️ {text}</div>;
}
