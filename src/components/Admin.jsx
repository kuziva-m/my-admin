import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  Users,
  FileText,
  LogOut,
  MapPin,
  Settings,
  LayoutDashboard,
  // Heart icon removed as we are using the real logo now
} from "lucide-react";

// Components
import DashboardOverview from "./admin/DashboardOverview";
import GroupManager from "./admin/GroupManager";
import LoanManager from "./admin/LoanManager";
import MemberManager from "./admin/MemberManager";
import ClusterMap from "./admin/ClusterMap";
import SettingsManager from "./admin/SettingsManager";

export default function Admin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setAuthLoading(false);
    if (error) alert(error.message);
  };

  const handleLogout = () => supabase.auth.signOut();

  // --- SOS VSLA MENU STRUCTURE ---
  const MENU_ITEMS = [
    { id: "dashboard", label: "Program Overview", icon: LayoutDashboard },
    { id: "groups", label: "VSLA Groups", icon: Users },
    { id: "loans", label: "Internal Lending", icon: FileText },
    { id: "members", label: "Caregivers & Youth", icon: Users },
    { id: "map", label: "Location GIS", icon: MapPin },
    { id: "settings", label: "Config", icon: Settings },
  ];

  if (loading) return <div style={styles.centerScreen}>Loading System...</div>;

  if (!session) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            {/* UPDATED: Real Logo for Login Screen */}
            <img
              src="/logo.jpg"
              alt="SOS Children's Villages"
              style={{ height: "80px", marginBottom: "16px" }}
            />
            <h2
              style={{
                color: "#005492",
                margin: "0 0 10px 0",
                fontSize: "1.5rem",
              }}
            >
              SOS VSLA Portal
            </h2>
            <p
              style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.5 }}
            >
              Village Savings & Lending MIS
              <br />
              Zimbabwe National Office
            </p>
          </div>
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="email"
              required
              placeholder="admin@sos-zimbabwe.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <button disabled={authLoading} style={styles.submitBtn}>
              {authLoading ? "Authenticating..." : "Login to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Navbar with SOS Blue */}
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <div style={styles.logoSection}>
            {/* UPDATED: Navbar Logo container for cohesiveness on blue background */}
            <div style={styles.navLogoContainer}>
              <img src="/logo.jpg" alt="SOS Logo" style={{ height: "28px" }} />
            </div>
            <span>SOS VSLA MIS</span>
          </div>

          <div className="desktop-nav" style={styles.desktopNav}>
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  ...styles.navLink,
                  background:
                    activeTab === item.id
                      ? "rgba(255,255,255,0.15)"
                      : "transparent",
                  color: "white",
                  fontWeight: activeTab === item.id ? "600" : "400",
                }}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>

          <button onClick={handleLogout} style={styles.logoutBtn}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        {activeTab === "dashboard" && <DashboardOverview />}
        {activeTab === "groups" && <GroupManager />}
        {activeTab === "loans" && <LoanManager />}
        {activeTab === "members" && <MemberManager />}
        {activeTab === "map" && <ClusterMap />}
        {activeTab === "settings" && <SettingsManager />}
      </main>
    </div>
  );
}

const styles = {
  centerScreen: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#64748b",
    fontWeight: 500,
  },
  loginContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f5f9",
  },
  loginCard: {
    background: "white",
    padding: "48px",
    borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "440px",
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  input: {
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s",
  },
  submitBtn: {
    padding: "14px",
    background: "#005492",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    fontWeight: "bold",
    fontSize: "1rem",
    transition: "background 0.2s",
  },

  // Navbar Styles updated for logo
  navbar: {
    background: "#005492",
    color: "white",
    height: "70px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  navContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoSection: {
    display: "flex",
    gap: "12px",
    fontWeight: "700",
    alignItems: "center",
    fontSize: "1.25rem",
    letterSpacing: "-0.5px",
  },
  navLogoContainer: {
    background: "white",
    padding: "4px 8px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
  },

  desktopNav: { display: "flex", gap: "10px" },
  navLink: {
    display: "flex",
    gap: "10px",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    fontSize: "0.95rem",
    transition: "all 0.2s",
    alignItems: "center",
  },
  logoutBtn: {
    display: "flex",
    gap: "8px",
    padding: "10px 16px",
    background: "rgba(0,0,0,0.2)",
    color: "white",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    alignItems: "center",
    fontWeight: 500,
    transition: "background 0.2s",
  },
};
