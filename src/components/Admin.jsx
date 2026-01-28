import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  Users,
  FileText,
  LogOut,
  MapPin,
  BarChart,
  Settings,
  Atom,
  ArrowRight,
  Lock,
  Menu,
  X,
  LayoutDashboard,
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
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // --- NGO MIS MENU STRUCTURE ---
  const MENU_ITEMS = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "groups", label: "Savings Groups", icon: Users },
    { id: "loans", label: "Loan Portfolio", icon: FileText },
    { id: "members", label: "Beneficiaries", icon: Users },
    { id: "map", label: "GIS Cluster Map", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (loading) return <div style={styles.centerScreen}>Loading...</div>;

  if (!session) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <h2 style={{ color: "#0f172a" }}>Chiedza MIS Portal</h2>
            <p style={{ color: "#64748b" }}>
              Secure Access for Staff & Directors
            </p>
          </div>
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="email"
              required
              placeholder="staff@chiedza.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <button disabled={authLoading} style={styles.submitBtn}>
              {authLoading ? "Verifying..." : "Access Portal"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <div style={styles.logoSection}>
            <Atom size={24} color="white" />
            <span>Chiedza MIS</span>
          </div>

          <div className="desktop-nav" style={styles.desktopNav}>
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  ...styles.navLink,
                  background: activeTab === item.id ? "#1e293b" : "transparent",
                  color: activeTab === item.id ? "white" : "#94a3b8",
                }}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </div>

          <button onClick={handleLogout} style={styles.logoutBtn}>
            <LogOut size={16} /> Logout
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
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1" },
  submitBtn: {
    padding: "12px",
    background: "#0f172a",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    fontWeight: "bold",
  },
  navbar: { background: "#0f172a", color: "white", height: "64px" },
  navContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoSection: { display: "flex", gap: "10px", fontWeight: "bold" },
  desktopNav: { display: "flex", gap: "5px" },
  navLink: {
    display: "flex",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
    fontSize: "0.9rem",
  },
  logoutBtn: {
    display: "flex",
    gap: "6px",
    padding: "8px 12px",
    background: "#ef4444",
    color: "white",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
};
