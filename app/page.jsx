"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const G = "#00ff41";
const G2 = "#00cc33";
const G3 = "#004d14";
const BG = "#020a02";
const BG2 = "#050f05";
const BG3 = "#0a1a0a";
const BORDER = "#00ff4130";
const BORDER2 = "#00ff4160";

const glowStyle = { textShadow: `0 0 10px ${G}, 0 0 20px ${G}` };

// ── Auth Page ─────────────────────────────────────────────────────────────────
function AuthPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 500);
    return () => clearInterval(t);
  }, []);

  const handleAuth = async () => {
    setLoading(true); setError(""); setMessage("");
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage("// check your email to verify account");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        @keyframes flicker { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.8} 95%{opacity:1} 97%{opacity:0.9} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .auth-card { animation: fadeIn 0.4s ease; }
        .snap-input:focus { border-color: ${G} !important; box-shadow: 0 0 0 1px ${G}, 0 0 12px ${G}30 !important; outline: none; }
        .snap-input { transition: all 0.2s; }
        .snap-btn:hover { background: ${G} !important; color: ${BG} !important; box-shadow: 0 0 20px ${G}60 !important; }
        .snap-btn { transition: all 0.2s; }
        .snap-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      {/* Scanline effect */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.015) 2px, rgba(0,255,65,0.015) 4px)`, pointerEvents: "none", zIndex: 0 }} />

      {/* Grid background */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `linear-gradient(${BORDER} 1px, transparent 1px), linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />

      <div className="auth-card" style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440, border: `1px solid ${BORDER2}`, background: BG2, padding: "clamp(24px,5vw,40px)" }}>
        {/* Terminal header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
          <span style={{ marginLeft: 8, fontSize: 11, color: G2, opacity: 0.7 }}>snaplink — terminal</span>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: "clamp(22px,5vw,32px)", fontWeight: 800, color: G, letterSpacing: "-1px", ...glowStyle }}>
            SNAP<span style={{ color: "#fff" }}>LINK</span>
            <span style={{ color: G, opacity: blink ? 1 : 0 }}>_</span>
          </div>
          <div style={{ fontSize: 12, color: G2, opacity: 0.7, marginTop: 6 }}>
            {mode === "login" ? "// authenticate to access your links" : "// initialize new user account"}
          </div>
        </div>

        {error && <div style={{ background: "#ff000015", border: "1px solid #ff000040", color: "#ff6b6b", padding: "10px 14px", fontSize: 12, marginBottom: 16, fontFamily: "inherit" }}>{">> ERROR: "}{error}</div>}
        {message && <div style={{ background: "#00ff4115", border: `1px solid ${BORDER2}`, color: G, padding: "10px 14px", fontSize: 12, marginBottom: 16 }}>{message}</div>}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 10, color: G2, letterSpacing: 3, marginBottom: 8, opacity: 0.8 }}>// EMAIL</label>
          <input className="snap-input" style={{ width: "100%", background: BG, border: `1px solid ${BORDER}`, padding: "12px 14px", color: G, fontSize: 13, fontFamily: "inherit" }}
            type="email" placeholder="user@domain.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 10, color: G2, letterSpacing: 3, marginBottom: 8, opacity: 0.8 }}>// PASSWORD</label>
          <input className="snap-input" style={{ width: "100%", background: BG, border: `1px solid ${BORDER}`, padding: "12px 14px", color: G, fontSize: 13, fontFamily: "inherit" }}
            type="password" placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAuth()} />
        </div>

        <button className="snap-btn" style={{ width: "100%", padding: "13px", background: "transparent", color: G, border: `1px solid ${G}`, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: 2 }}
          onClick={handleAuth} disabled={loading}>
          {loading ? "// AUTHENTICATING..." : mode === "login" ? "> SIGN_IN" : "> CREATE_ACCOUNT"}
        </button>

        <p style={{ fontSize: 12, color: G2, opacity: 0.6, textAlign: "center", marginTop: 20 }}>
          {mode === "login" ? "// no account? " : "// have account? "}
          <span style={{ color: G, cursor: "pointer", textDecoration: "underline" }} onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setMessage(""); }}>
            {mode === "login" ? "register" : "login"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ user }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);
  const [clicks, setClicks] = useState({});
  const [chartData, setChartData] = useState([]);
  const [copied, setCopied] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [blink, setBlink] = useState(true);

  const host = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    fetchLinks();
    const t = setInterval(() => setBlink(b => !b), 500);
    return () => clearInterval(t);
  }, []);

  const fetchLinks = async () => {
    setFetching(true);
    const { data } = await supabase.from("links").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) { setLinks(data); await fetchClickCounts(data); }
    setFetching(false);
  };

  const fetchClickCounts = async (list) => {
    const counts = {};
    for (const link of list) {
      const { count } = await supabase.from("clicks").select("*", { count: "exact", head: true }).eq("short_code", link.short_code);
      counts[link.short_code] = count || 0;
    }
    setClicks(counts);
  };

  const fetchChartData = async (short_code) => {
    const { data } = await supabase.from("clicks").select("clicked_at").eq("short_code", short_code).order("clicked_at", { ascending: true });
    if (!data) return;
    const grouped = {};
    data.forEach(({ clicked_at }) => {
      const date = new Date(clicked_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      grouped[date] = (grouped[date] || 0) + 1;
    });
    setChartData(Object.entries(grouped).map(([date, clicks]) => ({ date, clicks })));
  };

  const shorten = async () => {
    if (!url.trim()) return;
    setLoading(true);
    const short_code = Math.random().toString(36).substring(2, 8);
    const { error } = await supabase.from("links").insert({ original_url: url, short_code, user_id: user.id });
    if (error) alert("Error: " + error.message);
    else { setUrl(""); await fetchLinks(); }
    setLoading(false);
  };

  const copyLink = (code) => {
    navigator.clipboard.writeText(`${host}/${code}`);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const deleteLink = async (id) => {
    await supabase.from("links").delete().eq("id", id);
    await fetchLinks();
    if (selectedLink?.id === id) setSelectedLink(null);
  };

  const openAnalytics = async (link) => {
    setSelectedLink(link);
    await fetchChartData(link.short_code);
  };

  const totalClicks = Object.values(clicks).reduce((a, b) => a + b, 0);

  return (
    <div style={{ minHeight: "100vh", background: BG, color: G, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .snap-row { animation: fadeIn 0.3s ease; }
        .snap-input:focus { border-color: ${G} !important; box-shadow: 0 0 12px ${G}30 !important; outline: none; }
        .snap-input { transition: border-color 0.2s; }
        .snap-btn:hover:not(:disabled) { background: ${G} !important; color: ${BG} !important; box-shadow: 0 0 20px ${G}50 !important; }
        .snap-btn { transition: all 0.15s; }
        .snap-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .ghost-btn:hover { color: ${G} !important; border-color: ${BORDER2} !important; }
        .del-btn:hover { color: #ff4444 !important; }
        .link-row:hover { background: ${BG3} !important; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: ${G3}; }
      `}</style>

      {/* Scanline */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.01) 2px, rgba(0,255,65,0.01) 4px)`, pointerEvents: "none", zIndex: 0 }} />

      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px clamp(16px,4vw,32px)", borderBottom: `1px solid ${BORDER}`, background: BG2, position: "sticky", top: 0, zIndex: 10, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: G, letterSpacing: "-0.5px", ...glowStyle }}>
            SNAP<span style={{ color: "#fff" }}>LINK</span>
            <span style={{ opacity: blink ? 1 : 0 }}>_</span>
          </div>
          <div style={{ fontSize: 10, color: G2, opacity: 0.5, display: "flex", gap: 16 }}>
            <span>{links.length} LINKS</span>
            <span>{totalClicks} CLICKS</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: G2, opacity: 0.5 }}>{user.email}</span>
          <button className="ghost-btn" style={{ padding: "6px 14px", background: "transparent", color: G2, border: `1px solid ${BORDER}`, fontSize: 11, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1 }}
            onClick={() => supabase.auth.signOut()}>LOGOUT</button>
        </div>
      </header>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "28px clamp(16px,4vw,32px)", position: "relative", zIndex: 1 }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 10, marginBottom: 20 }}>
          {[
            { label: "TOTAL_LINKS", value: links.length },
            { label: "TOTAL_CLICKS", value: totalClicks },
            { label: "TOP_LINK", value: links.length ? Math.max(...Object.values(clicks)) : 0 },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: BG2, border: `1px solid ${BORDER}`, padding: "16px 18px" }}>
              <div style={{ fontSize: 9, color: G2, letterSpacing: 2, opacity: 0.6, marginBottom: 8 }}>// {label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: G, ...glowStyle }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Shorten input */}
        <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: "20px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: G2, letterSpacing: 2, opacity: 0.6, marginBottom: 12 }}>// SHORTEN_URL</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", background: BG, border: `1px solid ${BORDER}`, padding: "0 12px" }}>
              <span style={{ color: G, opacity: 0.5, marginRight: 8, fontSize: 13 }}>$</span>
              <input className="snap-input" style={{ flex: 1, background: "transparent", border: "none", padding: "12px 0", color: G, fontSize: 13, fontFamily: "inherit", outline: "none" }}
                placeholder="https://your-long-url.com" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && shorten()} />
            </div>
            <button className="snap-btn" style={{ padding: "12px 24px", background: "transparent", color: G, border: `1px solid ${G}`, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: 2, whiteSpace: "nowrap" }}
              onClick={shorten} disabled={loading}>
              {loading ? "SNIPPING..." : "> SNIP"}
            </button>
          </div>
        </div>

        {/* Links list */}
        <div style={{ background: BG2, border: `1px solid ${BORDER}` }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, color: G2, letterSpacing: 2, opacity: 0.6 }}>// LINKS_TABLE</span>
            <span style={{ fontSize: 10, color: G, opacity: 0.4 }}>({links.length} records)</span>
          </div>

          {fetching ? (
            <div style={{ padding: "40px", textAlign: "center", color: G2, opacity: 0.5, fontSize: 12 }}>// loading data...</div>
          ) : links.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: G2, opacity: 0.5, fontSize: 12 }}>// no records found — snip your first url</div>
          ) : (
            <div>
              {/* Table header */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, padding: "8px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 9, color: G2, opacity: 0.5, letterSpacing: 2 }}>
                <span>SHORT_URL / ORIGINAL</span>
                <span>ACTIONS</span>
              </div>
              {links.map(link => (
                <div className="link-row" key={link.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, flexWrap: "wrap", transition: "background 0.15s" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: G, ...glowStyle }}>{host}/{link.short_code}</span>
                      <span style={{ fontSize: 10, color: G, background: G3, border: `1px solid ${BORDER2}`, padding: "2px 8px", letterSpacing: 1 }}>
                        {clicks[link.short_code] || 0} CLICKS
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: G2, opacity: 0.5, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "min(400px,55vw)" }}>
                      {link.original_url}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    {[
                      { label: copied === link.short_code ? "COPIED!" : "COPY", onClick: () => copyLink(link.short_code), color: G },
                      { label: "STATS", onClick: () => openAnalytics(link), color: "#00aaff" },
                      { label: "DEL", onClick: () => deleteLink(link.id), color: "#ff4444", cls: "del-btn" },
                    ].map(({ label, onClick, color, cls }) => (
                      <button key={label} className={`snap-btn ${cls || ""}`} style={{ padding: "5px 10px", background: "transparent", color: color + "99", border: `1px solid ${color}30`, fontSize: 10, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1 }}
                        onClick={onClick}>{label}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analytics panel */}
        {selectedLink && (
          <div style={{ background: BG2, border: `1px solid ${BORDER}`, marginTop: 16 }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: G2, letterSpacing: 2, opacity: 0.6 }}>// CLICK_ANALYTICS</div>
                <div style={{ fontSize: 12, color: G, marginTop: 4 }}>{host}/{selectedLink.short_code}</div>
              </div>
              <button className="ghost-btn" style={{ padding: "5px 12px", background: "transparent", color: G2, border: `1px solid ${BORDER}`, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}
                onClick={() => setSelectedLink(null)}>CLOSE</button>
            </div>
            <div style={{ padding: 20 }}>
              {chartData.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px", color: G2, opacity: 0.5, fontSize: 12 }}>// no click data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                    <XAxis dataKey="date" tick={{ fill: G2, fontSize: 10, fontFamily: "inherit" }} />
                    <YAxis tick={{ fill: G2, fontSize: 10, fontFamily: "inherit" }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: BG, border: `1px solid ${BORDER2}`, borderRadius: 0, fontSize: 12, fontFamily: "inherit", color: G }} />
                    <Bar dataKey="clicks" fill={G} radius={0} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function Home() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (checking) return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}>
      <div style={{ color: G, fontSize: 13 }}>// booting snaplink...</div>
    </div>
  );

  return user ? <Dashboard user={user} /> : <AuthPage />;
}