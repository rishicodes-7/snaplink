"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ── Auth Page ─────────────────────────────────────────────────────────────────
function AuthPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleAuth = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage("Check your email to confirm your account!");
    }
    setLoading(false);
  };

  return (
    <div style={s.authWrap}>
      <div style={s.authCard}>
        <div style={s.logo}>Snap<span style={{ color: "#6366f1" }}>Link</span></div>
        <p style={s.authSub}>
          {mode === "login" ? "Sign in to manage your links" : "Create your free account"}
        </p>

        {error && <div style={s.errorBox}>{error}</div>}
        {message && <div style={s.successBox}>{message}</div>}

        <div style={s.field}>
          <label style={s.label}>EMAIL</label>
          <input
            style={s.input}
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>PASSWORD</label>
          <input
            style={s.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAuth()}
          />
        </div>

        <button style={s.btnPrimary} onClick={handleAuth} disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
        </button>

        <p style={s.switchText}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span style={s.switchLink} onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setMessage(""); }}>
            {mode === "login" ? "Sign Up" : "Sign In"}
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

  const host = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => { fetchLinks(); }, []);

  const fetchLinks = async () => {
    setFetching(true);
    const { data } = await supabase
      .from("links")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setLinks(data);
      await fetchClickCounts(data);
    }
    setFetching(false);
  };

  const fetchClickCounts = async (linksList) => {
    const counts = {};
    for (const link of linksList) {
      const { count } = await supabase
        .from("clicks")
        .select("*", { count: "exact", head: true })
        .eq("short_code", link.short_code);
      counts[link.short_code] = count || 0;
    }
    setClicks(counts);
  };

  const fetchChartData = async (short_code) => {
    const { data } = await supabase
      .from("clicks")
      .select("clicked_at")
      .eq("short_code", short_code)
      .order("clicked_at", { ascending: true });

    if (!data) return;

    // Group by date
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

  const { error } = await supabase
    .from("links")
    .insert({
      original_url: url,
      short_code,
      user_id: user.id,
    });

  if (error) {
    alert("Error: " + error.message);
  } else {
    setUrl("");
    await fetchLinks();
  }
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

  return (
    <div style={s.dashWrap}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.logo}>Snap<span style={{ color: "#6366f1" }}>Link</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#64748b" }}>{user.email}</span>
          <button style={s.btnGhost} onClick={() => supabase.auth.signOut()}>Sign Out</button>
        </div>
      </header>

      <main style={s.main}>
        {/* Shorten Box */}
        <div style={s.card}>
          <div style={s.cardTitle}>✂️ Shorten a URL</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              style={{ ...s.input, flex: 1, minWidth: 200 }}
              placeholder="https://your-long-url.com/goes/here"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && shorten()}
            />
            <button style={{ ...s.btnPrimary, width: "auto", padding: "12px 24px" }} onClick={shorten} disabled={loading}>
              {loading ? "..." : "Shorten →"}
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div style={s.statsRow}>
          {[
            { label: "Total Links", value: links.length },
            { label: "Total Clicks", value: Object.values(clicks).reduce((a, b) => a + b, 0) },
            { label: "Top Link Clicks", value: links.length ? Math.max(...Object.values(clicks)) : 0 },
          ].map(({ label, value }) => (
            <div key={label} style={s.statCard}>
              <div style={s.statNum}>{value}</div>
              <div style={s.statLabel}>{label}</div>
            </div>
          ))}
        </div>

        {/* Links List */}
        <div style={s.card}>
          <div style={s.cardTitle}>🔗 Your Links</div>
          {fetching ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b" }}>Loading...</div>
          ) : links.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b", fontSize: 14 }}>
              No links yet — shorten your first URL above!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {links.map(link => (
                <div key={link.id} style={s.linkRow}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={s.shortUrl}>{host}/{link.short_code}</span>
                      <span style={s.clickBadge}>{clicks[link.short_code] || 0} clicks</span>
                    </div>
                    <div style={s.originalUrl}>{link.original_url}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
                    <button style={s.btnSmall} onClick={() => copyLink(link.short_code)}>
                      {copied === link.short_code ? "✓ Copied" : "Copy"}
                    </button>
                    <button style={{ ...s.btnSmall, color: "#6366f1", borderColor: "#6366f130" }} onClick={() => openAnalytics(link)}>
                      Analytics
                    </button>
                    <button style={{ ...s.btnSmall, color: "#ef4444", borderColor: "#ef444430" }} onClick={() => deleteLink(link.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analytics Panel */}
        {selectedLink && (
          <div style={s.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={s.cardTitle}>📊 Analytics — {host}/{selectedLink.short_code}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{selectedLink.original_url}</div>
              </div>
              <button style={s.btnGhost} onClick={() => setSelectedLink(null)}>Close ✕</button>
            </div>

            {chartData.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b", fontSize: 14 }}>
                No clicks yet — share your link to start tracking!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 13 }}
                    labelStyle={{ color: "#e2e8f0" }}
                    itemStyle={{ color: "#6366f1" }}
                  />
                  <Bar dataKey="clicks" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  authWrap: {
    minHeight: "100vh", background: "#020817",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 20, fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  authCard: {
    background: "#0f172a", border: "1px solid #1e293b",
    borderRadius: 16, padding: "clamp(24px, 5vw, 40px)",
    width: "100%", maxWidth: 420,
  },
  logo: {
    fontSize: 28, fontWeight: 800, color: "#fff",
    marginBottom: 6, letterSpacing: "-0.5px",
  },
  authSub: { fontSize: 14, color: "#64748b", marginBottom: 28 },
  field: { marginBottom: 16 },
  label: {
    display: "block", fontSize: 10, fontWeight: 700,
    letterSpacing: 2, color: "#475569", marginBottom: 8,
  },
  input: {
    width: "100%", background: "#020817",
    border: "1px solid #1e293b", borderRadius: 8,
    padding: "12px 14px", color: "#e2e8f0", fontSize: 14,
    fontFamily: "inherit", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  btnPrimary: {
    width: "100%", padding: "13px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff", border: "none", borderRadius: 8,
    fontSize: 14, fontWeight: 700, cursor: "pointer",
    fontFamily: "inherit", marginTop: 8, transition: "opacity 0.2s",
  },
  btnGhost: {
    padding: "8px 16px", background: "transparent",
    color: "#64748b", border: "1px solid #1e293b",
    borderRadius: 8, fontSize: 13, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit",
  },
  btnSmall: {
    padding: "6px 12px", background: "transparent",
    color: "#94a3b8", border: "1px solid #1e293b",
    borderRadius: 6, fontSize: 12, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
  },
  switchText: { fontSize: 13, color: "#64748b", textAlign: "center", marginTop: 20 },
  switchLink: { color: "#6366f1", cursor: "pointer", fontWeight: 600 },
  errorBox: {
    background: "#ef444415", border: "1px solid #ef444430",
    color: "#f87171", borderRadius: 8, padding: "10px 14px",
    fontSize: 13, marginBottom: 16,
  },
  successBox: {
    background: "#22c55e15", border: "1px solid #22c55e30",
    color: "#4ade80", borderRadius: 8, padding: "10px 14px",
    fontSize: 13, marginBottom: 16,
  },
  dashWrap: {
    minHeight: "100vh", background: "#020817",
    color: "#e2e8f0", fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px clamp(16px, 4vw, 32px)",
    borderBottom: "1px solid #1e293b",
    background: "#020817", position: "sticky", top: 0, zIndex: 10,
    flexWrap: "wrap", gap: 12,
  },
  main: { maxWidth: 860, margin: "0 auto", padding: "32px clamp(16px, 4vw, 32px)" },
  card: {
    background: "#0f172a", border: "1px solid #1e293b",
    borderRadius: 14, padding: "clamp(20px, 4vw, 28px)", marginBottom: 20,
  },
  cardTitle: { fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 16 },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 12, marginBottom: 20,
  },
  statCard: {
    background: "#0f172a", border: "1px solid #1e293b",
    borderRadius: 12, padding: "20px", textAlign: "center",
  },
  statNum: { fontSize: 32, fontWeight: 800, color: "#6366f1", lineHeight: 1 },
  statLabel: { fontSize: 12, color: "#64748b", marginTop: 6, fontWeight: 500 },
  linkRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 12, padding: "14px 16px", background: "#020817",
    borderRadius: 8, flexWrap: "wrap",
  },
  shortUrl: { fontSize: 14, fontWeight: 700, color: "#6366f1" },
  clickBadge: {
    fontSize: 11, fontWeight: 600, color: "#22c55e",
    background: "#22c55e15", border: "1px solid #22c55e25",
    padding: "2px 8px", borderRadius: 20,
  },
  originalUrl: {
    fontSize: 12, color: "#475569", marginTop: 3,
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
    maxWidth: "min(300px, 50vw)",
  },
};

// ── Main App ──────────────────────────────────────────────────────────────────
export default function Home() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (checking) return (
    <div style={{ minHeight: "100vh", background: "#020817", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#6366f1", fontSize: 14 }}>Loading...</div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { border-color: #6366f1 !important; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 2px; }
      `}</style>
      {user ? <Dashboard user={user} /> : <AuthPage />}
    </>
  );
}