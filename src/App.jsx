import React, { useState, useEffect, useRef } from "react";

const ACCENT = "#E8323A";
const ACCENT2 = "#F2C94C";
const GOOD = "#5FCB6B";
const BG = "#101012";
const CARD = "#19191C";
const CARD2 = "#212124";
const BORDER = "#2C2C30";
const TEXT = "#F3F2ED";
const MUTED = "#8B8B90";

const uid = () => Math.random().toString(36).slice(2, 10);
const round1 = (n) => Math.round(n * 10) / 10;

// Ridimensiona e comprime un'immagine caricata dall'utente in un base64 leggero,
// così da non riempire lo spazio di storage limitato del browser.
function compressImageFile(file, maxDim = 500, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Lettura file fallita"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Immagine non valida"));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

const TABS = [
  { id: "dashboard", label: "Home", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { id: "profilo", label: "Profilo", icon: "M12 12a5 5 0 100-10 5 5 0 000 10zM3 21c1.5-4 5-6 9-6s7.5 2 9 6" },
  { id: "composizione", label: "Corpo", icon: "M4 19V9m6 10V5m6 14v-7m6 7V3" },
  { id: "allenamenti", label: "Training", icon: "M4 6h16M4 12h16M4 18h10" },
  { id: "analisi", label: "Analisi", icon: "M13 2L3 14h7v8l10-12h-7z" },
  { id: "nutrizione", label: "Dieta", icon: "M6 2v20M6 2c0 4 4 4 4 8s-4 4-4 8M18 2v20" },
  { id: "integrazioni", label: "Connetti", icon: "M9 3v4M15 3v4M6 7h12l-1 13H7L6 7z" },
];

function Icon({ d, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function Card({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 18px", ...style }}>
      {children}
    </div>
  );
}

function Button({ children, onClick, variant = "primary", style, type = "button" }) {
  const base = { border: "none", borderRadius: 10, padding: "12px 18px", fontWeight: 700, fontSize: 14, letterSpacing: 0.3, cursor: "pointer", fontFamily: "inherit" };
  const variants = {
    primary: { background: ACCENT, color: "#fff" },
    secondary: { background: "transparent", color: TEXT, border: `1px solid ${BORDER}` },
    ghost: { background: CARD2, color: TEXT },
  };
  return (
    <button type={type} onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

function Input({ label, ...props }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: MUTED, fontWeight: 600 }}>
      {label}
      <input {...props} style={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px", color: TEXT, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: MUTED, fontWeight: 600 }}>
      {label}
      <select value={value} onChange={onChange} style={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px", color: TEXT, fontSize: 14 }}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

function SectionTitle({ children, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "22px 0 12px" }}>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 1, color: TEXT, margin: 0, textTransform: "uppercase" }}>{children}</h2>
      {action}
    </div>
  );
}

function EmptyHint({ text, onClick }) {
  return (
    <div onClick={onClick} style={{ border: `1px dashed ${BORDER}`, borderRadius: 14, padding: 18, textAlign: "center", color: MUTED, fontSize: 13, cursor: onClick ? "pointer" : "default" }}>
      {text}
    </div>
  );
}

function TagInput({ items, onChange, placeholder }) {
  const [val, setVal] = useState("");
  const add = () => {
    const v = val.trim();
    if (!v) return;
    onChange([...(items || []), v]);
    setVal("");
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: items?.length ? 8 : 0 }}>
        {(items || []).map((t, i) => (
          <span key={i} style={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "4px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
            {t}
            <button onClick={() => remove(i)} style={{ background: "none", border: "none", color: ACCENT, cursor: "pointer", padding: 0, display: "flex" }}>
              <Icon d="M6 6l12 12M6 18L18 6" size={11} />
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder={placeholder}
          style={{ flex: 1, background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 10px", color: TEXT, fontSize: 13 }}
        />
        <Button variant="ghost" onClick={add} style={{ padding: "8px 12px", fontSize: 12 }}>+ Aggiungi</Button>
      </div>
    </div>
  );
}

const iconBtnStyle = { background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 6, color: TEXT, cursor: "pointer", display: "flex" };
const miniInput = { background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "6px 8px", color: TEXT, fontSize: 12, width: "100%" };

// ---------------- DATI ----------------
const DEFAULT_DATA = {
  profile: { nome: "", eta: "", sesso: "M", altezza: "", obiettivo: "Ipertrofia", attivita: "1.375", allergie: [], intolleranze: [], preferenze: [], note: "", fotoProfilo: "" },
  measurements: [],
  workouts: [],
  nutrition: { kcalTarget: "", proteine: "", carboidrati: "", grassi: "", pasti: [], alimentiDaEvitare: [], listaSpesa: [], pianoGenerato: null },
};

// Adapter di persistenza basato su localStorage: i dati restano sul dispositivo/browser
// corrente. Per sincronizzare i dati tra più dispositivi/utenti serve un backend condiviso
// (es. Supabase) al posto di queste funzioni: l'interfaccia async è mantenuta identica
// apposta per rendere quel passaggio, in futuro, una semplice sostituzione di queste 4 funzioni.
const STORAGE_PREFIX = "ironlog:";

async function loadUsers() {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}users_registry`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
async function saveUsers(users) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}users_registry`, JSON.stringify(users));
  } catch (e) {
    console.error(e);
  }
}
async function loadAll(userId) {
  try {
    const keys = ["profile", "measurements", "workouts", "nutrition"];
    const data = { ...DEFAULT_DATA };
    keys.forEach((k) => {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${userId}:${k}`);
      if (raw) {
        try { data[k] = JSON.parse(raw); } catch {}
      }
    });
    return data;
  } catch {
    return DEFAULT_DATA;
  }
}
async function saveKey(userId, key, value) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userId}:${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
}

// ---------------- CALCOLI ----------------
function calcBMR(profile) {
  const peso = Number(profile.pesoAttuale);
  const altezza = Number(profile.altezza);
  const eta = Number(profile.eta);
  if (!peso || !altezza || !eta) return null;
  const base = 10 * peso + 6.25 * altezza - 5 * eta;
  return profile.sesso === "F" ? base - 161 : base + 5;
}
function calcTDEE(bmr, fattore) {
  if (!bmr) return null;
  return bmr * Number(fattore || 1.2);
}
function calcBMI(peso, altezza) {
  if (!peso || !altezza) return null;
  const h = Number(altezza) / 100;
  return Number(peso) / (h * h);
}
function bmiCategoria(bmi) {
  if (!bmi) return "—";
  if (bmi < 18.5) return "Sottopeso";
  if (bmi < 25) return "Normopeso";
  if (bmi < 30) return "Sovrappeso";
  return "Obesità";
}
const GRUPPI_MUSCOLARI = ["Petto", "Schiena", "Spalle", "Bicipiti", "Tricipiti", "Gambe", "Glutei", "Addome", "Cardio", "Full body"];

const ATTIVITA_OPTS = [
  { value: "1.2", label: "Sedentario (poco/nessun esercizio)" },
  { value: "1.375", label: "Leggero (1-3 giorni/sett.)" },
  { value: "1.55", label: "Moderato (3-5 giorni/sett.)" },
  { value: "1.725", label: "Intenso (6-7 giorni/sett.)" },
  { value: "1.9", label: "Molto intenso (atleta)" },
];

// Metodo US Navy: stima % massa grassa da circonferenze (cm), senza bisogno di plicometro/bioimpedenza.
// Nota: la formula si basa sulla differenza vita-collo; con misure sproporzionate (es. vita troppo
// stretta rispetto a peso/altezza) il risultato matematico diventa inattendibile, quindi lo scartiamo
// fuori da un intervallo fisiologicamente plausibile (3%-60%) piuttosto che mostrare un numero falso.
function calcBodyFatNavy({ sesso, vita, collo, altezza, fianchi }) {
  const w = Number(vita), n = Number(collo), h = Number(altezza), hip = Number(fianchi);
  if (!w || !n || !h) return null;
  if (sesso === "F") {
    if (!hip) return null;
    if (w + hip - n <= 0) return null;
    const bf = 495 / (1.29579 - 0.35004 * Math.log10(w + hip - n) + 0.221 * Math.log10(h)) - 450;
    return bf >= 3 && bf <= 60 ? bf : null;
  }
  if (w - n <= 0) return null;
  const bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
  return bf >= 3 && bf <= 60 ? bf : null;
}

// ---------------- APP ROOT ----------------
export default function App() {
  const [usersLoading, setUsersLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    (async () => {
      const list = await loadUsers();
      setUsers(list);
      setUsersLoading(false);
    })();
  }, []);

  const handleCreateUser = async (nome) => {
    const u = { id: uid(), nome };
    const next = [...users, u];
    setUsers(next);
    await saveUsers(next);
    setCurrentUser(u);
  };
  const handleDeleteUser = async (id) => {
    const next = users.filter((u) => u.id !== id);
    setUsers(next);
    await saveUsers(next);
  };

  const updateUserAvatar = async (userId, avatarDataUrl) => {
    setUsers((prev) => {
      const next = prev.map((u) => (u.id === userId ? { ...u, avatar: avatarDataUrl || "" } : u));
      saveUsers(next);
      return next;
    });
  };

  if (usersLoading) {
    return <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED, fontFamily: "'Inter', system-ui, sans-serif" }}>Caricamento…</div>;
  }
  if (!currentUser) {
    return <UserSelect users={users} onSelect={setCurrentUser} onCreate={handleCreateUser} onDelete={handleDeleteUser} />;
  }
  return <UserApp user={currentUser} onSwitchUser={() => setCurrentUser(null)} updateUserAvatar={updateUserAvatar} />;
}

function Avatar({ src, nome, size = 32 }) {
  const style = { width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 };
  if (src) return <img src={src} alt={nome || "avatar"} style={style} />;
  return (
    <div style={{ ...style, background: CARD2, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED, fontWeight: 800, fontSize: size * 0.4 }}>
      {(nome || "?").trim().charAt(0).toUpperCase()}
    </div>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      body { margin: 0; }
      input::placeholder, textarea::placeholder { color: ${MUTED}; }
      textarea { font-family: inherit; }
    `}</style>
  );
}

function UserSelect({ users, onSelect, onCreate, onDelete }) {
  const [name, setName] = useState("");
  const submit = () => {
    const n = name.trim();
    if (!n) return;
    onCreate(n);
    setName("");
  };
  return (
    <div style={{ minHeight: "100vh", background: BG, color: TEXT, fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <GlobalStyle />
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, letterSpacing: 2, color: ACCENT, marginBottom: 24 }}>
        IRON<span style={{ color: TEXT }}>LOG</span>
      </div>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ fontSize: 12, color: MUTED, fontWeight: 700, marginBottom: 10, letterSpacing: 0.5 }}>CHI SEI?</div>
        {users.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
            {users.map((u) => (
              <Card key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", cursor: "pointer" }}>
                <div onClick={() => onSelect(u)} style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar src={u.avatar} nome={u.nome} size={34} />
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{u.nome}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onDelete(u.id); }} style={{ ...iconBtnStyle, color: ACCENT }} aria-label="Rimuovi profilo">
                  <Icon d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" size={14} />
                </button>
              </Card>
            ))}
          </div>
        )}
        <div style={{ fontSize: 12, color: MUTED, fontWeight: 700, marginBottom: 10, letterSpacing: 0.5 }}>NUOVO PROFILO</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="Il tuo nome" style={{ flex: 1, background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px", color: TEXT, fontSize: 14 }} />
          <Button onClick={submit}>Crea</Button>
        </div>
      </div>
    </div>
  );
}

function UserApp({ user, onSwitchUser, updateUserAvatar }) {
  const [tab, setTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(DEFAULT_DATA.profile);
  const [measurements, setMeasurements] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [nutrition, setNutrition] = useState(DEFAULT_DATA.nutrition);

  useEffect(() => {
    (async () => {
      const d = await loadAll(user.id);
      setProfile(d.profile.nome ? d.profile : { ...d.profile, nome: user.nome });
      setMeasurements(d.measurements);
      setWorkouts(d.workouts);
      setNutrition(d.nutrition);
      setLoading(false);
    })();
  }, [user.id]);

  useEffect(() => { if (!loading) saveKey(user.id, "profile", profile); }, [profile, loading]);
  useEffect(() => { if (!loading) saveKey(user.id, "measurements", measurements); }, [measurements, loading]);
  useEffect(() => { if (!loading) saveKey(user.id, "workouts", workouts); }, [workouts, loading]);
  useEffect(() => { if (!loading) saveKey(user.id, "nutrition", nutrition); }, [nutrition, loading]);

  const lastM = measurements.length ? measurements[measurements.length - 1] : null;
  const enriched = { ...profile, pesoAttuale: lastM?.peso || profile.pesoAttuale };

  if (loading) {
    return <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED }}>Caricamento…</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TEXT, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <GlobalStyle />
      <Header profile={profile} onSwitchUser={onSwitchUser} />
      <main style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 100px" }}>
        {tab === "dashboard" && <Dashboard profile={enriched} measurements={measurements} workouts={workouts} nutrition={nutrition} goTo={setTab} />}
        {tab === "profilo" && <Profilo profile={profile} setProfile={setProfile} user={user} updateUserAvatar={updateUserAvatar} />}
        {tab === "composizione" && <Composizione measurements={measurements} setMeasurements={setMeasurements} profile={profile} />}
        {tab === "allenamenti" && <Allenamenti workouts={workouts} setWorkouts={setWorkouts} />}
        {tab === "analisi" && <Analisi profile={enriched} measurements={measurements} />}
        {tab === "nutrizione" && <Nutrizione nutrition={nutrition} setNutrition={setNutrition} profile={enriched} />}
        {tab === "integrazioni" && <Integrazioni />}
      </main>
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

function Header({ profile, onSwitchUser }) {
  return (
    <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "18px 16px", position: "sticky", top: 0, background: BG, zIndex: 5 }}>
      <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 2, color: ACCENT }}>
          IRON<span style={{ color: TEXT }}>LOG</span>
        </div>
        <button onClick={onSwitchUser} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: MUTED, fontSize: 12, fontWeight: 600 }}>
          <Avatar src={profile.fotoProfilo} nome={profile.nome} size={26} />
          {profile.nome ? `Ciao, ${profile.nome}` : "Benvenuto"}
          <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m0-5H5a2 2 0 00-2 2v10a2 2 0 002 2h2" size={14} />
        </button>
      </div>
    </div>
  );
}

function BottomNav({ tab, setTab }) {
  return (
    <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: CARD, borderTop: `1px solid ${BORDER}`, display: "flex", overflowX: "auto", padding: "8px 4px calc(8px + env(safe-area-inset-bottom))", zIndex: 10 }}>
      {TABS.map((t) => (
        <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: tab === t.id ? ACCENT : MUTED, fontSize: 9.5, fontWeight: 700, cursor: "pointer", padding: "4px 9px", flex: "1 0 auto", minWidth: 56 }}>
          <Icon d={t.icon} size={19} />
          {t.label}
        </button>
      ))}
    </nav>
  );
}

// ---------------- 1. PROFILO ----------------
function Profilo({ profile, setProfile, user, updateUserAvatar }) {
  const obiettivi = ["Ipertrofia", "Dimagrimento", "Forza", "Resistenza", "Ricomposizione", "Mantenimento"];
  const [draft, setDraft] = useState(profile);
  const [savedMsg, setSavedMsg] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const isDirty = JSON.stringify(draft) !== JSON.stringify(profile);

  const handleSave = () => {
    setProfile(draft);
    if (updateUserAvatar && user) updateUserAvatar(user.id, draft.fotoProfilo);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError("");
    try {
      const dataUrl = await compressImageFile(file, 400, 0.7);
      setDraft({ ...draft, fotoProfilo: dataUrl });
    } catch {
      setPhotoError("Non sono riuscito a caricare questa immagine, riprova con un'altra foto.");
    }
    e.target.value = "";
  };

  return (
    <div>
      <SectionTitle>Dati personali</SectionTitle>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <Avatar src={draft.fotoProfilo} nome={draft.nome} size={64} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ cursor: "pointer" }}>
              <span style={{ display: "inline-block", background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, color: TEXT }}>
                {draft.fotoProfilo ? "Cambia foto" : "Carica foto profilo"}
              </span>
              <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
            </label>
            {draft.fotoProfilo && (
              <button onClick={() => setDraft({ ...draft, fotoProfilo: "" })} style={{ background: "none", border: "none", color: ACCENT, fontSize: 11, fontWeight: 700, cursor: "pointer", textAlign: "left", padding: 0 }}>
                Rimuovi foto
              </button>
            )}
            {photoError && <div style={{ fontSize: 11, color: ACCENT }}>{photoError}</div>}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input label="Nome" value={draft.nome} onChange={(e) => setDraft({ ...draft, nome: e.target.value })} placeholder="Il tuo nome" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Input label="Età" type="number" value={draft.eta} onChange={(e) => setDraft({ ...draft, eta: e.target.value })} placeholder="30" />
            <Select label="Sesso" value={draft.sesso} onChange={(e) => setDraft({ ...draft, sesso: e.target.value })} options={[{ value: "M", label: "Maschio" }, { value: "F", label: "Femmina" }]} />
          </div>
          <Input label="Altezza (cm)" type="number" value={draft.altezza} onChange={(e) => setDraft({ ...draft, altezza: e.target.value })} placeholder="178" />
        </div>
      </Card>

      <SectionTitle>Obiettivi</SectionTitle>
      <Card>
        <Select label="Obiettivo principale" value={draft.obiettivo} onChange={(e) => setDraft({ ...draft, obiettivo: e.target.value })} options={obiettivi.map((o) => ({ value: o, label: o }))} />
        <div style={{ marginTop: 10 }}>
          <Select label="Livello di attività" value={draft.attivita} onChange={(e) => setDraft({ ...draft, attivita: e.target.value })} options={ATTIVITA_OPTS} />
        </div>
      </Card>

      <SectionTitle>Allergie e intolleranze</SectionTitle>
      <Card>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, marginBottom: 6 }}>Allergie</div>
          <TagInput items={draft.allergie} onChange={(v) => setDraft({ ...draft, allergie: v })} placeholder="Es. arachidi" />
        </div>
        <div>
          <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, marginBottom: 6 }}>Intolleranze</div>
          <TagInput items={draft.intolleranze} onChange={(v) => setDraft({ ...draft, intolleranze: v })} placeholder="Es. lattosio" />
        </div>
      </Card>

      <SectionTitle>Preferenze alimentari</SectionTitle>
      <Card>
        <TagInput items={draft.preferenze} onChange={(v) => setDraft({ ...draft, preferenze: v })} placeholder="Es. vegetariano, no pesce" />
      </Card>

      <SectionTitle>Note</SectionTitle>
      <Card>
        <textarea value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} placeholder="Infortuni, limitazioni, altro..." rows={3} style={{ width: "100%", background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px", color: TEXT, fontSize: 14, resize: "vertical" }} />
      </Card>

      <div style={{ marginTop: 24, marginBottom: 10, display: "flex", justifyContent: "center", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        {savedMsg && (
          <span style={{ fontSize: 12, color: GOOD, fontWeight: 700, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "8px 14px" }}>
            ✓ Salvato
          </span>
        )}
        <Button onClick={handleSave} style={{ padding: "13px 32px", boxShadow: "0 4px 14px rgba(232,50,58,0.35)", opacity: isDirty || savedMsg ? 1 : 0.6, width: "100%" }}>
          Salva profilo
        </Button>
      </div>
    </div>
  );
}

// ---------------- 2. COMPOSIZIONE CORPOREA ----------------
function Composizione({ measurements, setMeasurements, profile }) {
  const [form, setForm] = useState({ peso: "", altezza: "", vita: "", collo: "", fianchi: "", petto: "", braccio: "", coscia: "", massaGrassa: "", note: "", foto: [] });
  const [expandedId, setExpandedId] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [lightbox, setLightbox] = useState(null);

  const autoBodyFat = calcBodyFatNavy({ sesso: profile?.sesso, vita: form.vita, collo: form.collo, altezza: form.altezza, fianchi: form.fianchi });
  const hasEnoughInputForAuto = form.vita && form.collo && form.altezza && (profile?.sesso !== "F" || form.fianchi);
  const implausible = hasEnoughInputForAuto && !autoBodyFat;

  const addEntry = () => {
    if (!form.peso) return;
    const massaGrassa = autoBodyFat ? round1(autoBodyFat) : form.massaGrassa;
    const entry = { id: uid(), data: new Date().toISOString().slice(0, 10), ...form, massaGrassa };
    setMeasurements([...measurements, entry].sort((a, b) => a.data.localeCompare(b.data)));
    setForm({ peso: "", altezza: form.altezza, vita: "", collo: form.collo, fianchi: "", petto: "", braccio: "", coscia: "", massaGrassa: "", note: "", foto: [] });
  };
  const removeEntry = (id) => setMeasurements(measurements.filter((m) => m.id !== id));

  const handlePhotoAdd = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setPhotoError("");
    if (form.foto.length + files.length > 6) {
      setPhotoError("Massimo 6 foto per misurazione, per non riempire lo spazio del dispositivo.");
      e.target.value = "";
      return;
    }
    try {
      const compressed = await Promise.all(files.map((f) => compressImageFile(f, 700, 0.55)));
      setForm((f) => ({ ...f, foto: [...f.foto, ...compressed] }));
    } catch {
      setPhotoError("Non sono riuscito a caricare una delle foto, riprova.");
    }
    e.target.value = "";
  };
  const removePhoto = (idx) => setForm((f) => ({ ...f, foto: f.foto.filter((_, i) => i !== idx) }));

  const weights = measurements.map((m) => Number(m.peso)).filter((n) => !isNaN(n));
  const max = weights.length ? Math.max(...weights) : 0;
  const min = weights.length ? Math.min(...weights) : 0;
  const range = max - min || 1;
  const fatValues = measurements.map((m) => Number(m.massaGrassa)).filter((n) => !isNaN(n) && n > 0);

  return (
    <div>
      <SectionTitle>Nuova misurazione</SectionTitle>
      <div style={{ fontSize: 12, color: MUTED, marginBottom: 10, lineHeight: 1.5 }}>
        Inserendo vita, collo e altezza (più fianchi se donna), la massa grassa si calcola da sola con il metodo US Navy — non serve più scriverla a mano.
      </div>
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Input label="Peso (kg)" type="number" value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })} placeholder="75.5" />
          <Input label="Altezza (cm)" type="number" value={form.altezza} onChange={(e) => setForm({ ...form, altezza: e.target.value })} placeholder="178" />
          <Input label="Vita (cm)" type="number" value={form.vita} onChange={(e) => setForm({ ...form, vita: e.target.value })} placeholder="82" />
          <Input label="Collo (cm)" type="number" value={form.collo} onChange={(e) => setForm({ ...form, collo: e.target.value })} placeholder="38" />
          <Input label="Fianchi (cm)" type="number" value={form.fianchi} onChange={(e) => setForm({ ...form, fianchi: e.target.value })} placeholder="98" />
          <Input label="Petto (cm)" type="number" value={form.petto} onChange={(e) => setForm({ ...form, petto: e.target.value })} placeholder="100" />
          <Input label="Braccio (cm)" type="number" value={form.braccio} onChange={(e) => setForm({ ...form, braccio: e.target.value })} placeholder="36" />
          <Input label="Coscia (cm)" type="number" value={form.coscia} onChange={(e) => setForm({ ...form, coscia: e.target.value })} placeholder="56" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: MUTED, fontWeight: 600 }}>
            Massa grassa (%)
            {autoBodyFat ? (
              <div style={{ background: CARD2, border: `1px solid ${GOOD}`, borderRadius: 8, padding: "10px 12px", color: GOOD, fontSize: 14, fontWeight: 800 }}>
                {round1(autoBodyFat)}% <span style={{ color: MUTED, fontWeight: 500, fontSize: 11 }}>(calcolata)</span>
              </div>
            ) : implausible ? (
              <div>
                <Input type="number" value={form.massaGrassa} onChange={(e) => setForm({ ...form, massaGrassa: e.target.value })} placeholder="Inserisci manualmente" />
                <div style={{ fontSize: 11, color: ACCENT2, marginTop: 4 }}>
                  Vita e collo troppo vicine per un calcolo affidabile: controlla le misure o inserisci il valore a mano.
                </div>
              </div>
            ) : (
              <Input type="number" value={form.massaGrassa} onChange={(e) => setForm({ ...form, massaGrassa: e.target.value })} placeholder="Inserisci vita e collo per il calcolo auto" />
            )}
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <Input label="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Facoltativo" />
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, color: MUTED, fontWeight: 600, marginBottom: 6 }}>Foto progressi (facoltative)</div>
          {form.foto.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
              {form.foto.map((src, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={src} alt="" style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover", border: `1px solid ${BORDER}` }} />
                  <button onClick={() => removePhoto(i)} style={{ position: "absolute", top: -6, right: -6, background: ACCENT, border: `2px solid ${CARD}`, borderRadius: "50%", width: 20, height: 20, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Icon d="M6 6l12 12M6 18L18 6" size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <label style={{ cursor: "pointer" }}>
            <span style={{ display: "inline-block", background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, color: TEXT }}>
              + Aggiungi foto
            </span>
            <input type="file" accept="image/*" multiple onChange={handlePhotoAdd} style={{ display: "none" }} />
          </label>
          {photoError && <div style={{ fontSize: 11, color: ACCENT, marginTop: 6 }}>{photoError}</div>}
          <div style={{ fontSize: 11, color: MUTED, marginTop: 6 }}>Le foto restano solo su questo dispositivo/browser: usane poche per non riempire lo spazio disponibile.</div>
        </div>
        <Button onClick={addEntry} style={{ marginTop: 12, width: "100%" }}>Aggiungi misurazione</Button>
      </Card>

      <SectionTitle>Andamento peso</SectionTitle>
      {weights.length < 2 ? (
        <EmptyHint text="Aggiungi almeno due misurazioni per vedere il grafico." />
      ) : (
        <Card>
          <svg viewBox="0 0 300 100" width="100%" height="120" preserveAspectRatio="none">
            <polyline fill="none" stroke={ACCENT} strokeWidth="2" points={measurements.map((m, i) => { const x = (i / (measurements.length - 1)) * 290 + 5; const v = Number(m.peso); const y = 95 - ((v - min) / range) * 85; return `${x},${y}`; }).join(" ")} />
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: MUTED, marginTop: 4 }}>
            <span>{min} kg</span>
            <span>{max} kg</span>
          </div>
        </Card>
      )}

      {fatValues.length >= 2 && (
        <>
          <SectionTitle>Andamento massa grassa</SectionTitle>
          <Card>
            <svg viewBox="0 0 300 100" width="100%" height="100" preserveAspectRatio="none">
              <polyline fill="none" stroke={ACCENT2} strokeWidth="2" points={fatValues.map((v, i) => { const x = (i / (fatValues.length - 1)) * 290 + 5; const mx = Math.max(...fatValues), mn = Math.min(...fatValues), r = mx - mn || 1; const y = 90 - ((v - mn) / r) * 80; return `${x},${y}`; }).join(" ")} />
            </svg>
          </Card>
        </>
      )}

      <SectionTitle>Storico</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {measurements.length === 0 && <EmptyHint text="Nessuna misurazione registrata." />}
        {measurements.slice().reverse().map((m) => (
          <Card key={m.id} style={{ padding: "10px 14px", cursor: "pointer" }} onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{m.data}</div>
                <div style={{ fontSize: 12, color: MUTED }}>
                  {m.peso} kg{m.vita ? ` · vita ${m.vita}cm` : ""}{m.massaGrassa ? ` · MG ${m.massaGrassa}%` : ""}{m.note ? ` · ${m.note}` : ""}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: MUTED, transform: expandedId === m.id ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                  <Icon d="M6 9l6 6 6-6" size={16} />
                </span>
                <button onClick={(e) => { e.stopPropagation(); removeEntry(m.id); }} style={{ ...iconBtnStyle, color: ACCENT }}><Icon d="M6 6l12 12M6 18L18 6" size={14} /></button>
              </div>
            </div>
            {expandedId === m.id && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${BORDER}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
                {[
                  ["Peso", m.peso, "kg"], ["Altezza", m.altezza, "cm"], ["Vita", m.vita, "cm"], ["Collo", m.collo, "cm"],
                  ["Fianchi", m.fianchi, "cm"], ["Petto", m.petto, "cm"], ["Braccio", m.braccio, "cm"], ["Coscia", m.coscia, "cm"],
                  ["Massa grassa", m.massaGrassa, "%"],
                ].filter(([, v]) => v).map(([label, v, unit]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${BORDER}`, paddingBottom: 4 }}>
                    <span style={{ color: MUTED }}>{label}</span>
                    <span style={{ fontWeight: 700 }}>{v}{unit}</span>
                  </div>
                ))}
                {m.note && (
                  <div style={{ gridColumn: "1 / -1", marginTop: 4 }}>
                    <div style={{ color: MUTED, marginBottom: 2 }}>Note</div>
                    <div>{m.note}</div>
                  </div>
                )}
                {m.foto && m.foto.length > 0 && (
                  <div style={{ gridColumn: "1 / -1", marginTop: 4 }}>
                    <div style={{ color: MUTED, marginBottom: 6 }}>Foto</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {m.foto.map((src, i) => (
                        <img key={i} src={src} alt="" onClick={(e) => { e.stopPropagation(); setLightbox(src); }} style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover", border: `1px solid ${BORDER}`, cursor: "pointer" }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <img src={lightbox} alt="" style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: 10 }} />
        </div>
      )}
    </div>
  );
}

// ---------------- 3. ALLENAMENTI ----------------
function Allenamenti({ workouts, setWorkouts }) {
  const [editing, setEditing] = useState(null);
  const [openLog, setOpenLog] = useState(null);
  const [showPR, setShowPR] = useState(false);

  const addWorkout = () => {
    const w = { id: uid(), nome: "Nuova scheda", esercizi: [], log: [] };
    setWorkouts([...workouts, w]);
    setEditing(w.id);
  };
  const removeWorkout = (id) => setWorkouts(workouts.filter((w) => w.id !== id));
  const updateWorkout = (id, patch) => setWorkouts(workouts.map((w) => (w.id === id ? { ...w, ...patch } : w)));

  const prList = computePRs(workouts);

  return (
    <div>
      <SectionTitle action={<Button onClick={addWorkout}>+ Scheda</Button>}>Le mie schede</SectionTitle>
      {workouts.length === 0 && <EmptyHint text="Crea la tua prima scheda di allenamento." />}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {workouts.map((w) => (
          <WorkoutCard key={w.id} workout={w} editing={editing === w.id} onEdit={() => setEditing(editing === w.id ? null : w.id)} onRemove={() => removeWorkout(w.id)} onUpdate={(patch) => updateWorkout(w.id, patch)} openLog={openLog === w.id} onToggleLog={() => setOpenLog(openLog === w.id ? null : w.id)} />
        ))}
      </div>

      <SectionTitle action={<button onClick={() => setShowPR(!showPR)} style={{ ...iconBtnStyle }}><Icon d="M13 2L3 14h7v8l10-12h-7z" size={16} /></button>}>PR e progressi</SectionTitle>
      {prList.length === 0 ? (
        <EmptyHint text="Registra sessioni con carichi per vedere i tuoi record personali." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {prList.map((p) => (
            <Card key={p.nome} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px" }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>{p.nome}</span>
              <span style={{ color: ACCENT2, fontWeight: 800, fontSize: 13 }}>{p.max} kg</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function computePRs(workouts) {
  const map = {};
  workouts.forEach((w) => {
    (w.log || []).forEach((entry) => {
      (entry.performance || []).forEach((p) => {
        const c = Number(p.carico);
        if (!isNaN(c) && c > 0) {
          if (!map[p.nome] || c > map[p.nome]) map[p.nome] = c;
        }
      });
    });
  });
  return Object.entries(map).map(([nome, max]) => ({ nome, max })).sort((a, b) => b.max - a.max);
}

// Emette un breve bip usando l'audio nativo del browser. L'AudioContext va creato/sbloccato
// durante un vero tocco dell'utente (es. il click su "Avvia"), altrimenti i browser mobili
// bloccano l'audio se arriva da un timer automatico.
function playBeep(ctx) {
  try {
    if (!ctx) return;
    [0, 0.25, 0.5].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.2);
    });
  } catch (e) {
    console.error("beep failed", e);
  }
}

function clampTimer(v) {
  return Math.min(90, Math.max(10, v));
}

function RestTimer({ initialSeconds, onClose }) {
  const [duration, setDuration] = useState(clampTimer(Math.round((Number(initialSeconds) || 60) / 15) * 15));
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(false);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    if (!running) setRemaining(duration);
  }, [duration, running]);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      playBeep(audioCtxRef.current);
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [running, remaining]);

  const adjust = (delta) => setDuration((d) => clampTimer(d + delta));
  const pct = duration ? ((duration - remaining) / duration) * 100 : 0;

  const handleToggle = () => {
    if (!running) {
      // Sblocca/crea l'AudioContext PROPRIO ora, dentro il click: è l'unico momento
      // in cui i browser permettono di riprodurre audio in seguito senza altro tocco.
      if (!audioCtxRef.current) {
        try {
          audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
          console.error(e);
        }
      } else if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      if (remaining === 0) setRemaining(duration);
    }
    setRunning(!running);
  };

  return (
    <Card style={{ marginTop: 8, background: CARD2 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: MUTED, fontWeight: 700 }}>RECUPERO</span>
        <button onClick={onClose} style={{ ...iconBtnStyle, padding: 4 }}><Icon d="M6 6l12 12M6 18L18 6" size={13} /></button>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <button onClick={() => adjust(-15)} disabled={running} style={{ ...iconBtnStyle, opacity: running ? 0.3 : 1, padding: "10px 14px" }}>−15</button>
        <div style={{ textAlign: "center", minWidth: 80 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, letterSpacing: 1, color: remaining <= 3 && running ? ACCENT : TEXT }}>
            {remaining}s
          </div>
          <div style={{ height: 4, background: BORDER, borderRadius: 2, marginTop: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: ACCENT, transition: "width 1s linear" }} />
          </div>
        </div>
        <button onClick={() => adjust(15)} disabled={running} style={{ ...iconBtnStyle, opacity: running ? 0.3 : 1, padding: "10px 14px" }}>+15</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <Button onClick={handleToggle} style={{ flex: 1 }}>{running ? "Pausa" : remaining === 0 ? "Ricomincia" : "Avvia"}</Button>
        <Button variant="secondary" onClick={() => { setRunning(false); setRemaining(duration); }} style={{ flex: 1 }}>Reset</Button>
      </div>
    </Card>
  );
}

function WorkoutCard({ workout, editing, onEdit, onRemove, onUpdate, openLog, onToggleLog }) {
  const [timerFor, setTimerFor] = useState(null);
  const addExercise = () => onUpdate({ esercizi: [...workout.esercizi, { id: uid(), nome: "", gruppoMuscolare: "", serie: 3, ripetizioni: "10", carico: "", recupero: "90" }] });
  const updateExercise = (id, patch) => onUpdate({ esercizi: workout.esercizi.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  const removeExercise = (id) => onUpdate({ esercizi: workout.esercizi.filter((e) => e.id !== id) });

  const logSession = () => {
    const performance = workout.esercizi.map((e) => ({ nome: e.nome, carico: e.carico, ripetizioni: e.ripetizioni }));
    const entry = { id: uid(), data: new Date().toISOString().slice(0, 10), performance };
    onUpdate({ log: [...(workout.log || []), entry] });
  };

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        {editing ? (
          <input value={workout.nome} onChange={(e) => onUpdate({ nome: e.target.value })} style={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 10px", color: TEXT, fontWeight: 800, fontSize: 15, flex: 1, marginRight: 8 }} />
        ) : (
          <div style={{ fontWeight: 800, fontSize: 17 }}>{workout.nome}</div>
        )}
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={onEdit} style={iconBtnStyle}><Icon d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" size={16} /></button>
          <button onClick={onRemove} style={{ ...iconBtnStyle, color: ACCENT }}><Icon d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" size={16} /></button>
        </div>
      </div>

      <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{workout.esercizi.length} esercizi · {(workout.log || []).length} sessioni registrate</div>

      {(editing || workout.esercizi.length > 0) && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: editing ? 14 : 8 }}>
          {workout.esercizi.map((e) =>
            editing ? (
              <div key={e.id} style={{ borderBottom: `1px solid ${BORDER}`, paddingBottom: 12 }}>
                <div style={{ display: "flex", gap: 5, marginBottom: 6 }}>
                  <input placeholder="Esercizio" value={e.nome} onChange={(ev) => updateExercise(e.id, { nome: ev.target.value })} style={{ ...miniInput, flex: 1.4 }} />
                  <select value={e.gruppoMuscolare || ""} onChange={(ev) => updateExercise(e.id, { gruppoMuscolare: ev.target.value })} style={{ ...miniInput, flex: 1 }}>
                    <option value="">Gruppo muscolare</option>
                    {GRUPPI_MUSCOLARI.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "42px 42px 50px 50px 28px", gap: 5 }}>
                  <div style={{ fontSize: 9, color: MUTED, textAlign: "center" }}>N. serie</div>
                  <div style={{ fontSize: 9, color: MUTED, textAlign: "center" }}>Ripetizioni</div>
                  <div style={{ fontSize: 9, color: MUTED, textAlign: "center" }}>Kg</div>
                  <div style={{ fontSize: 9, color: MUTED, textAlign: "center" }}>Recupero</div>
                  <div />
                  <input value={e.serie} onChange={(ev) => updateExercise(e.id, { serie: ev.target.value })} style={miniInput} />
                  <input value={e.ripetizioni} onChange={(ev) => updateExercise(e.id, { ripetizioni: ev.target.value })} style={miniInput} />
                  <input value={e.carico} onChange={(ev) => updateExercise(e.id, { carico: ev.target.value })} style={miniInput} />
                  <input placeholder="sec." value={e.recupero} onChange={(ev) => updateExercise(e.id, { recupero: ev.target.value })} style={miniInput} />
                  <button onClick={() => removeExercise(e.id)} style={{ ...iconBtnStyle, color: ACCENT }}><Icon d="M6 6l12 12M6 18L18 6" size={14} /></button>
                </div>
              </div>
            ) : (
              <div key={e.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, borderBottom: `1px solid ${BORDER}`, paddingBottom: 6 }}>
                  <span>{e.nome || "—"}{e.gruppoMuscolare ? <span style={{ color: MUTED, fontSize: 11 }}> · {e.gruppoMuscolare}</span> : ""}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: MUTED }}>{e.serie}x{e.ripetizioni} {e.carico ? `· ${e.carico}kg` : ""} {e.recupero ? `· rec. ${e.recupero}s` : ""}</span>
                    <button onClick={() => setTimerFor(timerFor === e.id ? null : e.id)} style={{ ...iconBtnStyle, color: timerFor === e.id ? ACCENT : TEXT, padding: 5 }} aria-label="Timer di recupero">
                      <Icon d="M12 8v4l3 3M12 2a10 10 0 100 20 10 10 0 000-20z" size={14} />
                    </button>
                  </div>
                </div>
                {timerFor === e.id && <RestTimer initialSeconds={e.recupero} onClose={() => setTimerFor(null)} />}
              </div>
            )
          )}
          {editing && <Button variant="ghost" onClick={addExercise} style={{ fontSize: 12, padding: "8px 12px", alignSelf: "flex-start" }}>+ Esercizio</Button>}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <Button onClick={logSession} style={{ flex: 1 }}>Segna sessione fatta</Button>
        <Button variant="secondary" onClick={onToggleLog} style={{ flex: 1 }}>Storico</Button>
      </div>

      {openLog && (
        <div style={{ marginTop: 10, fontSize: 12, color: MUTED }}>
          {(workout.log || []).length === 0 ? "Nessuna sessione registrata." : workout.log.slice().reverse().map((l) => (
            <div key={l.id} style={{ padding: "4px 0", borderBottom: `1px solid ${BORDER}` }}>{l.data}</div>
          ))}
        </div>
      )}
    </Card>
  );
}

// ---------------- 4. ANALISI ----------------
function Analisi({ profile, measurements }) {
  const bmr = calcBMR(profile);
  const tdee = calcTDEE(bmr, profile.attivita);
  const bmi = calcBMI(profile.pesoAttuale, profile.altezza);
  const [pesoObiettivo, setPesoObiettivo] = useState("");

  const weights = measurements.map((m) => Number(m.peso)).filter((n) => !isNaN(n));
  const trend = weights.length >= 2 ? round1(weights[weights.length - 1] - weights[0]) : null;
  const trendPeriodo = measurements.length >= 2 ? `dal ${measurements[0].data}` : "";

  return (
    <div>
      <SectionTitle>Metabolismo</SectionTitle>
      {!bmr ? (
        <EmptyHint text="Inserisci età, altezza e almeno un peso (in Composizione corporea) per calcolare il metabolismo." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Card>
            <div style={{ fontSize: 11, color: MUTED, fontWeight: 700 }}>METABOLISMO BASALE</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>{Math.round(bmr)} <span style={{ fontSize: 13, color: MUTED }}>kcal</span></div>
          </Card>
          <Card>
            <div style={{ fontSize: 11, color: MUTED, fontWeight: 700 }}>FABBISOGNO (TDEE)</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>{Math.round(tdee)} <span style={{ fontSize: 13, color: MUTED }}>kcal</span></div>
          </Card>
        </div>
      )}

      <SectionTitle>BMI</SectionTitle>
      {!bmi ? (
        <EmptyHint text="Inserisci altezza e peso per calcolare il BMI." />
      ) : (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{round1(bmi)}</div>
              <div style={{ fontSize: 12, color: MUTED }}>{bmiCategoria(bmi)}</div>
            </div>
          </div>
        </Card>
      )}

      <SectionTitle>Obiettivo di peso</SectionTitle>
      <Card>
        <Input label="Peso obiettivo (kg)" type="number" value={pesoObiettivo} onChange={(e) => setPesoObiettivo(e.target.value)} placeholder="70" />
        {pesoObiettivo && profile.pesoAttuale && (
          <div style={{ marginTop: 10, fontSize: 13, color: MUTED }}>
            Mancano <span style={{ color: TEXT, fontWeight: 700 }}>{round1(Math.abs(Number(profile.pesoAttuale) - Number(pesoObiettivo)))} kg</span> all'obiettivo.
          </div>
        )}
      </Card>

      <SectionTitle>Andamento</SectionTitle>
      {trend === null ? (
        <EmptyHint text="Registra più misurazioni in Composizione corporea per vedere l'andamento." />
      ) : (
        <Card>
          <div style={{ fontSize: 20, fontWeight: 800, color: trend < 0 ? GOOD : trend > 0 ? ACCENT2 : MUTED }}>
            {trend > 0 ? "+" : ""}{trend} kg
          </div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{trendPeriodo}</div>
        </Card>
      )}
    </div>
  );
}

// ---------------- 5. NUTRIZIONE ----------------
// ---------------- Elaboratore piano alimentare ----------------
const GIORNI_SETTIMANA = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
const DURATA_PIANO_GIORNI = 35; // 5 settimane

// Database pasti: ogni voce ha un tempo di preparazione indicativo (minuti), tag dietetici
// e allergeni/intolleranze presenti, usati per filtrare in base al profilo dell'utente.
const MEAL_DB = {
  colazione: [
    { nome: "Yogurt greco, miele e frutta secca", porzione: "200g yogurt + 15g miele + 20g frutta secca", tempoMin: 5, tags: ["vegetariano", "senza glutine"], allergeni: ["lattosio", "frutta a guscio"] },
    { nome: "Porridge di avena con frutta fresca", porzione: "50g fiocchi d'avena + 150g frutta", tempoMin: 10, tags: ["vegetariano", "vegano"], allergeni: ["glutine"] },
    { nome: "Uova strapazzate e pane integrale", porzione: "2 uova + 60g pane integrale", tempoMin: 10, tags: ["vegetariano"], allergeni: ["uova", "glutine"] },
    { nome: "Smoothie proteico banana e avena", porzione: "1 banana + 30g avena + 200ml latte/bevanda", tempoMin: 5, tags: ["vegetariano"], allergeni: ["lattosio", "glutine"] },
    { nome: "Pancake proteici", porzione: "3 pancake (circa 150g) + frutta a piacere", tempoMin: 15, tags: ["vegetariano"], allergeni: ["uova", "glutine", "lattosio"] },
    { nome: "Fette biscottate con marmellata e spremuta", porzione: "4 fette + 20g marmellata + 1 spremuta", tempoMin: 5, tags: ["vegetariano", "vegano"], allergeni: ["glutine"] },
    { nome: "Skyr con granola senza glutine", porzione: "200g skyr + 30g granola", tempoMin: 5, tags: ["vegetariano", "senza glutine"], allergeni: ["lattosio"] },
    { nome: "Toast avocado e uovo in camicia", porzione: "2 fette pane + 1/2 avocado + 1 uovo", tempoMin: 15, tags: ["vegetariano"], allergeni: ["uova", "glutine"] },
  ],
  spuntino: [
    { nome: "Mela e una manciata di mandorle", porzione: "1 mela (150g) + 20g mandorle", tempoMin: 2, tags: ["vegetariano", "vegano", "senza glutine"], allergeni: ["frutta a guscio"] },
    { nome: "Yogurt magro", porzione: "125g", tempoMin: 2, tags: ["vegetariano", "senza glutine"], allergeni: ["lattosio"] },
    { nome: "Barretta proteica", porzione: "1 barretta (30-40g)", tempoMin: 1, tags: ["vegetariano"], allergeni: ["frutta a guscio", "lattosio"] },
    { nome: "Frutta fresca di stagione", porzione: "150-200g", tempoMin: 2, tags: ["vegetariano", "vegano", "senza glutine"], allergeni: [] },
    { nome: "Bresaola e grissini", porzione: "50g bresaola + 30g grissini", tempoMin: 3, tags: [], allergeni: ["glutine"] },
    { nome: "Hummus di ceci con carote", porzione: "50g hummus + 100g carote", tempoMin: 5, tags: ["vegetariano", "vegano", "senza glutine"], allergeni: [] },
  ],
  pranzo: [
    { nome: "Pasta integrale al pomodoro e basilico", porzione: "80g pasta + 150g pomodoro", tempoMin: 20, tags: ["vegetariano", "vegano"], allergeni: ["glutine"] },
    { nome: "Petto di pollo grigliato con riso e verdure", porzione: "150g pollo + 70g riso + 150g verdure", tempoMin: 25, tags: ["senza glutine"], allergeni: [] },
    { nome: "Insalatona con tonno, uova e legumi", porzione: "150g insalata + 80g tonno + 1 uovo + 50g legumi", tempoMin: 10, tags: ["senza glutine"], allergeni: ["uova", "pesce"] },
    { nome: "Riso basmati con salmone e broccoli", porzione: "70g riso + 130g salmone + 150g broccoli", tempoMin: 25, tags: ["senza glutine"], allergeni: ["pesce"] },
    { nome: "Ceci in umido con verdure e pane", porzione: "150g ceci + 100g verdure + 40g pane", tempoMin: 20, tags: ["vegetariano", "vegano"], allergeni: ["glutine"] },
    { nome: "Bowl di quinoa, ceci e verdure grigliate", porzione: "70g quinoa + 100g ceci + 150g verdure", tempoMin: 20, tags: ["vegetariano", "vegano", "senza glutine"], allergeni: [] },
    { nome: "Filetto di merluzzo al forno con patate", porzione: "150g merluzzo + 200g patate", tempoMin: 30, tags: ["senza glutine"], allergeni: ["pesce"] },
    { nome: "Frittata di verdure con contorno", porzione: "2-3 uova + 100g verdure + contorno 100g", tempoMin: 15, tags: ["vegetariano", "senza glutine"], allergeni: ["uova"] },
    { nome: "Pasta al pesto con pinoli", porzione: "80g pasta + 30g pesto", tempoMin: 15, tags: ["vegetariano"], allergeni: ["glutine", "frutta a guscio", "lattosio"] },
    { nome: "Tacchino alla piastra con verdure grigliate", porzione: "150g tacchino + 200g verdure", tempoMin: 25, tags: ["senza glutine"], allergeni: [] },
  ],
  merenda: [
    { nome: "Frutto di stagione", porzione: "150-200g", tempoMin: 2, tags: ["vegetariano", "vegano", "senza glutine"], allergeni: [] },
    { nome: "Cracker integrali e formaggio spalmabile", porzione: "30g cracker + 30g formaggio", tempoMin: 3, tags: ["vegetariano"], allergeni: ["glutine", "lattosio"] },
    { nome: "Frullato di frutta fresca", porzione: "200-250ml", tempoMin: 5, tags: ["vegetariano", "vegano", "senza glutine"], allergeni: [] },
    { nome: "Noci e frutta secca mista", porzione: "25-30g", tempoMin: 1, tags: ["vegetariano", "vegano", "senza glutine"], allergeni: ["frutta a guscio"] },
    { nome: "Yogurt vegetale e cioccolato fondente", porzione: "150g yogurt + 10g cioccolato", tempoMin: 2, tags: ["vegetariano", "vegano"], allergeni: [] },
  ],
  cena: [
    { nome: "Zuppa di legumi e verdure", porzione: "300ml zuppa (circa 150g legumi)", tempoMin: 25, tags: ["vegetariano", "vegano", "senza glutine"], allergeni: [] },
    { nome: "Petto di pollo al forno con insalata", porzione: "150g pollo + 100g insalata", tempoMin: 25, tags: ["senza glutine"], allergeni: [] },
    { nome: "Orata al cartoccio con verdure", porzione: "180g orata + 150g verdure", tempoMin: 30, tags: ["senza glutine"], allergeni: ["pesce"] },
    { nome: "Tofu saltato con verdure e riso", porzione: "150g tofu + 150g verdure + 60g riso", tempoMin: 20, tags: ["vegetariano", "vegano", "senza glutine"], allergeni: ["soia"] },
    { nome: "Frittata con verdure e insalata", porzione: "2-3 uova + 100g verdure + insalata 80g", tempoMin: 15, tags: ["vegetariano", "senza glutine"], allergeni: ["uova"] },
    { nome: "Hamburger di manzo magro con contorno", porzione: "150g hamburger + 150g contorno", tempoMin: 20, tags: ["senza glutine"], allergeni: [] },
    { nome: "Minestrone di verdure con crostini", porzione: "300ml minestrone + 30g crostini", tempoMin: 30, tags: ["vegetariano", "vegano"], allergeni: ["glutine"] },
    { nome: "Gamberi saltati con verdure", porzione: "150g gamberi + 150g verdure", tempoMin: 15, tags: ["senza glutine"], allergeni: ["crostacei"] },
  ],
};

function normalizeTag(s) {
  return (s || "").toLowerCase().trim();
}

// Determina, dal profilo, quali allergeni/intolleranze evitare e quali tag dietetici richiedere.
function buildDietFilters(profile) {
  const escludi = new Set();
  (profile?.allergie || []).forEach((a) => escludi.add(normalizeTag(a)));
  (profile?.intolleranze || []).forEach((a) => escludi.add(normalizeTag(a)));
  const richiedi = new Set();
  (profile?.preferenze || []).forEach((p) => {
    const n = normalizeTag(p);
    if (n.includes("vegan")) richiedi.add("vegano");
    else if (n.includes("vegetarian")) richiedi.add("vegetariano");
    else if (n.includes("senza glutine") || n.includes("celiac")) richiedi.add("senza glutine");
    if (n.includes("no pesce") || n.includes("niente pesce")) escludi.add("pesce");
    if (n.includes("no carne")) richiedi.add("vegetariano");
  });
  return { escludi, richiedi };
}

function filterMeals(list, { escludi, richiedi }, tempoMax) {
  return list.filter((m) => {
    if (m.tempoMin > tempoMax) return false;
    if (m.allergeni.some((a) => escludi.has(a))) return false;
    if (richiedi.size > 0 && ![...richiedi].every((r) => m.tags.includes(r))) return false;
    return true;
  });
}

const TEMPO_MAX_MINUTI = { poco: 12, medio: 22, tanto: 45 };

function generateMealPlan(profile, tempoDisponibile) {
  const filters = buildDietFilters(profile);
  const tempoMax = TEMPO_MAX_MINUTI[tempoDisponibile] || 22;

  const pools = {};
  Object.keys(MEAL_DB).forEach((slot) => {
    let filtered = filterMeals(MEAL_DB[slot], filters, tempoMax);
    if (filtered.length === 0) filtered = filterMeals(MEAL_DB[slot], filters, 999); // fallback: ignora il tempo se troppo restrittivo
    if (filtered.length === 0) filtered = MEAL_DB[slot]; // fallback estremo: mostra tutto, meglio di niente
    pools[slot] = filtered;
  });

  // Rotazione con mescolamento ad ogni ciclo completo, per variare senza ripetere troppo vicino.
  const cursors = {};
  const shuffled = {};
  Object.keys(pools).forEach((slot) => {
    shuffled[slot] = [...pools[slot]].sort(() => Math.random() - 0.5);
    cursors[slot] = 0;
  });
  const pick = (slot) => {
    if (cursors[slot] >= shuffled[slot].length) {
      shuffled[slot] = [...pools[slot]].sort(() => Math.random() - 0.5);
      cursors[slot] = 0;
    }
    const item = shuffled[slot][cursors[slot]];
    cursors[slot] += 1;
    return item;
  };

  const settimane = [];
  for (let w = 0; w < 5; w++) {
    const giorni = [];
    for (let d = 0; d < 7; d++) {
      giorni.push({
        giorno: GIORNI_SETTIMANA[d],
        pasti: {
          colazione: pick("colazione"),
          spuntino: pick("spuntino"),
          pranzo: pick("pranzo"),
          merenda: pick("merenda"),
          cena: pick("cena"),
        },
      });
    }
    settimane.push(giorni);
  }

  return { generatedAt: new Date().toISOString().slice(0, 10), tempoDisponibile, settimane };
}

function planIsExpired(piano) {
  if (!piano) return false;
  const start = new Date(piano.generatedAt);
  const now = new Date();
  const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return days >= DURATA_PIANO_GIORNI;
}

function Nutrizione({ nutrition, setNutrition, profile }) {
  const bmr = calcBMR(profile);
  const tdee = calcTDEE(bmr, profile.attivita);
  const suggested = tdee ? Math.round(tdee) : null;


  const addSpesa = (nome) => setNutrition({ ...nutrition, listaSpesa: [...nutrition.listaSpesa, { id: uid(), nome, fatto: false }] });
  const toggleSpesa = (id) => setNutrition({ ...nutrition, listaSpesa: nutrition.listaSpesa.map((s) => (s.id === id ? { ...s, fatto: !s.fatto } : s)) });
  const removeSpesa = (id) => setNutrition({ ...nutrition, listaSpesa: nutrition.listaSpesa.filter((s) => s.id !== id) });

  const [showGenForm, setShowGenForm] = useState(false);
  const [tempoScelto, setTempoScelto] = useState("medio");
  const [weekTab, setWeekTab] = useState(0);
  const [dayOpen, setDayOpen] = useState(null);

  const piano = nutrition.pianoGenerato;
  const scaduto = planIsExpired(piano);

  const handleGenera = () => {
    const nuovoPiano = generateMealPlan(profile, tempoScelto);
    setNutrition({ ...nutrition, pianoGenerato: nuovoPiano });
    setShowGenForm(false);
    setWeekTab(0);
    setDayOpen(null);
  };

  const scadenza = piano ? new Date(new Date(piano.generatedAt).getTime() + DURATA_PIANO_GIORNI * 86400000).toLocaleDateString("it-IT") : null;

  return (
    <div>
      <SectionTitle>Fabbisogno calorico</SectionTitle>
      <Card>
        {suggested && <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>Fabbisogno stimato: <span style={{ color: TEXT, fontWeight: 700 }}>{suggested} kcal/giorno</span></div>}
        <Input label="Obiettivo kcal/giorno" type="number" value={nutrition.kcalTarget} onChange={(e) => setNutrition({ ...nutrition, kcalTarget: e.target.value })} placeholder={suggested ? String(suggested) : "2200"} />
      </Card>

      <SectionTitle>Macronutrienti</SectionTitle>
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <Input label="Proteine (g)" type="number" value={nutrition.proteine} onChange={(e) => setNutrition({ ...nutrition, proteine: e.target.value })} placeholder="150" />
          <Input label="Carboidrati (g)" type="number" value={nutrition.carboidrati} onChange={(e) => setNutrition({ ...nutrition, carboidrati: e.target.value })} placeholder="220" />
          <Input label="Grassi (g)" type="number" value={nutrition.grassi} onChange={(e) => setNutrition({ ...nutrition, grassi: e.target.value })} placeholder="70" />
        </div>
      </Card>

      <SectionTitle>Piano alimentare</SectionTitle>
      {!piano && (
        <div>
          {!showGenForm ? (
            <Card style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, color: MUTED, marginBottom: 14, lineHeight: 1.5 }}>
                Genero per te un piano di 5 pasti al giorno (colazione, spuntino, pranzo, merenda, cena) da lunedì a domenica, valido 5 settimane — basato su allergie, intolleranze e preferenze già in Profilo.
              </div>
              <Button onClick={() => setShowGenForm(true)}>Genera il mio piano</Button>
            </Card>
          ) : (
            <Card>
              <div style={{ fontSize: 12, color: MUTED, fontWeight: 700, marginBottom: 10 }}>QUANTO TEMPO HAI PER PREPARARE I PASTI?</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                {[
                  { value: "poco", label: "Poco", desc: "Solo ricette veloci, entro 10-15 minuti" },
                  { value: "medio", label: "Medio", desc: "Ricette normali, fino a 20-25 minuti" },
                  { value: "tanto", label: "Tanto", desc: "Anche ricette più elaborate" },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setTempoScelto(opt.value)}
                    style={{ border: `1px solid ${tempoScelto === opt.value ? ACCENT : BORDER}`, background: tempoScelto === opt.value ? "rgba(232,50,58,0.08)" : CARD2, borderRadius: 10, padding: "10px 12px", cursor: "pointer" }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>{opt.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 14 }}>
                Userò le allergie ({(profile.allergie || []).join(", ") || "nessuna"}), intolleranze ({(profile.intolleranze || []).join(", ") || "nessuna"}) e preferenze ({(profile.preferenze || []).join(", ") || "nessuna"}) già impostate in Profilo. Puoi aggiornarle lì prima di generare.
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Button variant="secondary" onClick={() => setShowGenForm(false)} style={{ flex: 1 }}>Annulla</Button>
                <Button onClick={handleGenera} style={{ flex: 1 }}>Genera piano</Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {piano && scaduto && (
        <Card style={{ borderColor: ACCENT2 }}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>Il tuo piano di 5 settimane è terminato</div>
          <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>Era iniziato il {new Date(piano.generatedAt).toLocaleDateString("it-IT")}. Richiedine uno nuovo quando vuoi.</div>
          {!showGenForm ? (
            <Button onClick={() => setShowGenForm(true)}>Richiedi un nuovo piano</Button>
          ) : (
            <div>
              <div style={{ fontSize: 12, color: MUTED, fontWeight: 700, marginBottom: 10 }}>QUANTO TEMPO HAI PER PREPARARE I PASTI?</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                {[
                  { value: "poco", label: "Poco", desc: "Solo ricette veloci, entro 10-15 minuti" },
                  { value: "medio", label: "Medio", desc: "Ricette normali, fino a 20-25 minuti" },
                  { value: "tanto", label: "Tanto", desc: "Anche ricette più elaborate" },
                ].map((opt) => (
                  <div key={opt.value} onClick={() => setTempoScelto(opt.value)} style={{ border: `1px solid ${tempoScelto === opt.value ? ACCENT : BORDER}`, background: tempoScelto === opt.value ? "rgba(232,50,58,0.08)" : CARD2, borderRadius: 10, padding: "10px 12px", cursor: "pointer" }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>{opt.desc}</div>
                  </div>
                ))}
              </div>
              <Button onClick={handleGenera} style={{ width: "100%" }}>Genera nuovo piano</Button>
            </div>
          )}
        </Card>
      )}

      {piano && !scaduto && (
        <div>
          <div style={{ fontSize: 11, color: MUTED, marginBottom: 10 }}>
            Piano valido fino al <span style={{ color: TEXT, fontWeight: 700 }}>{scadenza}</span> · tempo di preparazione: {tempoScelto === "poco" ? "poco" : piano.tempoDisponibile}
          </div>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 12, paddingBottom: 4 }}>
            {piano.settimane.map((_, i) => (
              <button key={i} onClick={() => { setWeekTab(i); setDayOpen(null); }} style={{ flexShrink: 0, background: weekTab === i ? ACCENT : CARD2, color: weekTab === i ? "#fff" : TEXT, border: "none", borderRadius: 20, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                Sett. {i + 1}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {piano.settimane[weekTab].map((giorno, i) => (
              <Card key={i} style={{ padding: "12px 14px", cursor: "pointer" }} onClick={() => setDayOpen(dayOpen === i ? null : i)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, fontSize: 14 }}>{giorno.giorno}</span>
                  <span style={{ color: MUTED, transform: dayOpen === i ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                    <Icon d="M6 9l6 6 6-6" size={16} />
                  </span>
                </div>
                {dayOpen === i && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      ["Colazione", giorno.pasti.colazione],
                      ["Spuntino", giorno.pasti.spuntino],
                      ["Pranzo", giorno.pasti.pranzo],
                      ["Merenda", giorno.pasti.merenda],
                      ["Cena", giorno.pasti.cena],
                    ].map(([label, item]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, gap: 10 }}>
                        <span style={{ color: MUTED, fontWeight: 700, flexShrink: 0, width: 70 }}>{label}</span>
                        <span style={{ textAlign: "right" }}>
                          {item?.nome || "—"}
                          {item?.porzione && <div style={{ color: MUTED, fontSize: 11, marginTop: 1 }}>{item.porzione}</div>}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
          <Button variant="secondary" onClick={() => setShowGenForm(true)} style={{ marginTop: 14, width: "100%" }}>Rigenera piano</Button>
          {showGenForm && (
            <Card style={{ marginTop: 10 }}>
              <div style={{ fontSize: 12, color: MUTED, fontWeight: 700, marginBottom: 10 }}>QUANTO TEMPO HAI PER PREPARARE I PASTI?</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                {[
                  { value: "poco", label: "Poco", desc: "Solo ricette veloci, entro 10-15 minuti" },
                  { value: "medio", label: "Medio", desc: "Ricette normali, fino a 20-25 minuti" },
                  { value: "tanto", label: "Tanto", desc: "Anche ricette più elaborate" },
                ].map((opt) => (
                  <div key={opt.value} onClick={() => setTempoScelto(opt.value)} style={{ border: `1px solid ${tempoScelto === opt.value ? ACCENT : BORDER}`, background: tempoScelto === opt.value ? "rgba(232,50,58,0.08)" : CARD2, borderRadius: 10, padding: "10px 12px", cursor: "pointer" }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>{opt.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Button variant="secondary" onClick={() => setShowGenForm(false)} style={{ flex: 1 }}>Annulla</Button>
                <Button onClick={handleGenera} style={{ flex: 1 }}>Conferma rigenerazione</Button>
              </div>
            </Card>
          )}
        </div>
      )}

      <SectionTitle>Alimenti da evitare</SectionTitle>
      <Card>
        <TagInput items={nutrition.alimentiDaEvitare} onChange={(v) => setNutrition({ ...nutrition, alimentiDaEvitare: v })} placeholder="Es. zuccheri raffinati" />
      </Card>

      <SectionTitle>Lista della spesa</SectionTitle>
      <ShoppingList items={nutrition.listaSpesa} onAdd={addSpesa} onToggle={toggleSpesa} onRemove={removeSpesa} />
    </div>
  );
}

function ShoppingList({ items, onAdd, onToggle, onRemove }) {
  const [val, setVal] = useState("");
  const submit = () => { const v = val.trim(); if (!v) return; onAdd(v); setVal(""); };
  return (
    <Card>
      <div style={{ display: "flex", gap: 6, marginBottom: items.length ? 10 : 0 }}>
        <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="Aggiungi alimento" style={{ flex: 1, ...miniInput }} />
        <Button variant="ghost" onClick={submit} style={{ fontSize: 12, padding: "8px 12px" }}>+ Aggiungi</Button>
      </div>
      {items.length === 0 && <div style={{ fontSize: 12, color: MUTED }}>Lista vuota.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((it) => (
          <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, borderBottom: `1px solid ${BORDER}`, paddingBottom: 6 }}>
            <input type="checkbox" checked={it.fatto} onChange={() => onToggle(it.id)} />
            <span style={{ flex: 1, textDecoration: it.fatto ? "line-through" : "none", color: it.fatto ? MUTED : TEXT }}>{it.nome}</span>
            <button onClick={() => onRemove(it.id)} style={{ background: "none", border: "none", color: ACCENT, cursor: "pointer", display: "flex" }}><Icon d="M6 6l12 12M6 18L18 6" size={13} /></button>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ---------------- 6. DASHBOARD ----------------
function Dashboard({ profile, measurements, workouts, nutrition, goTo }) {
  const lastWeight = measurements.length ? measurements[measurements.length - 1].peso : "";
  const firstWeight = measurements.length ? measurements[0].peso : "";
  const delta = lastWeight && firstWeight ? round1(Number(lastWeight) - Number(firstWeight)) : null;
  const totalSessions = workouts.reduce((acc, w) => acc + (w.log?.length || 0), 0);
  const nextWorkout = workouts[0];
  const bmr = calcBMR(profile);
  const tdee = calcTDEE(bmr, profile.attivita);
  const prList = computePRs(workouts).slice(0, 3);

  return (
    <div>
      <SectionTitle>Riepilogo</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Card>
          <div style={{ fontSize: 11, color: MUTED, fontWeight: 700 }}>PESO ATTUALE</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>{lastWeight || "—"} <span style={{ fontSize: 13, color: MUTED }}>kg</span></div>
          {delta !== null && <div style={{ fontSize: 12, marginTop: 4, color: delta < 0 ? GOOD : delta > 0 ? ACCENT2 : MUTED, fontWeight: 700 }}>{delta > 0 ? "+" : ""}{delta} kg totali</div>}
        </Card>
        <Card>
          <div style={{ fontSize: 11, color: MUTED, fontWeight: 700 }}>SESSIONI FATTE</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>{totalSessions}</div>
          <div style={{ fontSize: 12, marginTop: 4, color: MUTED, fontWeight: 700 }}>{workouts.length} schede attive</div>
        </Card>
        <Card>
          <div style={{ fontSize: 11, color: MUTED, fontWeight: 700 }}>FABBISOGNO</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>{tdee ? Math.round(tdee) : "—"} <span style={{ fontSize: 13, color: MUTED }}>kcal</span></div>
        </Card>
        <Card>
          <div style={{ fontSize: 11, color: MUTED, fontWeight: 700 }}>TARGET KCAL</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>{nutrition.kcalTarget || "—"}</div>
        </Card>
      </div>

      {(nutrition.proteine || nutrition.carboidrati || nutrition.grassi) && (
        <>
          <SectionTitle>Macro target</SectionTitle>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
              <div><div style={{ fontSize: 18, fontWeight: 800 }}>{nutrition.proteine || 0}g</div><div style={{ fontSize: 11, color: MUTED }}>Proteine</div></div>
              <div><div style={{ fontSize: 18, fontWeight: 800 }}>{nutrition.carboidrati || 0}g</div><div style={{ fontSize: 11, color: MUTED }}>Carboidrati</div></div>
              <div><div style={{ fontSize: 18, fontWeight: 800 }}>{nutrition.grassi || 0}g</div><div style={{ fontSize: 11, color: MUTED }}>Grassi</div></div>
            </div>
          </Card>
        </>
      )}

      <SectionTitle>Prossimo allenamento</SectionTitle>
      {nextWorkout ? (
        <Card style={{ cursor: "pointer" }} onClick={() => goTo("allenamenti")}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{nextWorkout.nome}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{nextWorkout.esercizi.length} esercizi</div>
            </div>
            <span style={{ color: ACCENT }}><Icon d="M9 18l6-6-6-6" size={20} /></span>
          </div>
        </Card>
      ) : (
        <EmptyHint text="Nessuna scheda ancora. Creane una nella sezione Allenamenti." onClick={() => goTo("allenamenti")} />
      )}

      {prList.length > 0 && (
        <>
          <SectionTitle>Ultimi PR</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {prList.map((p) => (
              <Card key={p.nome} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px" }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{p.nome}</span>
                <span style={{ color: ACCENT2, fontWeight: 800, fontSize: 13 }}>{p.max} kg</span>
              </Card>
            ))}
          </div>
        </>
      )}

      <SectionTitle>Obiettivo</SectionTitle>
      <Card>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{profile.obiettivo}</div>
      </Card>
    </div>
  );
}

// ---------------- 7. INTEGRAZIONI ----------------
function Integrazioni() {
  const items = [
    { nome: "Feelfit", desc: "Sincronizza allenamenti e misurazioni." },
    { nome: "Apple Health", desc: "Importa dati salute da iOS." },
    { nome: "Health Connect", desc: "Importa dati salute da Android." },
    { nome: "Smartwatch", desc: "Frequenza cardiaca e calorie durante l'allenamento." },
    { nome: "Altre app", desc: "Nuove integrazioni in valutazione." },
  ];
  return (
    <div>
      <SectionTitle>Integrazioni</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((it) => (
          <Card key={it.nome} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{it.nome}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{it.desc}</div>
            </div>
            <span style={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "4px 10px", fontSize: 11, color: MUTED, fontWeight: 700 }}>In arrivo</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
