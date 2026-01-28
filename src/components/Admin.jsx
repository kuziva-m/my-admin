import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  Users,
  FileText,
  LogOut,
  MapPin,
  Settings,
  LayoutDashboard,
  Menu,
  X,
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
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setSession(session);
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

  // --- NEW: BYPASS DATABASE FOR DEMO ---
  const handleDemoLogin = () => {
    setSession({ user: { email: "demo@sos-zimbabwe.org", id: "demo-123" } });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const MENU_ITEMS = [
    { id: "dashboard", label: "Program Overview", icon: LayoutDashboard },
    { id: "groups", label: "VSLA Groups", icon: Users },
    { id: "loans", label: "Internal Lending", icon: FileText },
    { id: "members", label: "Caregivers & Youth", icon: Users },
    { id: "map", label: "Location GIS", icon: MapPin },
    { id: "settings", label: "Config", icon: Settings },
  ];

  if (loading) return <div style={styles.centerScreen}>Loading System...</div>;

  // --- LOGIN SCREEN ---
  if (!session) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            {/* Make sure logo.png is in your /public folder */}
            <img
              src="/logo.png"
              alt="SOS Logo"
              style={{
                height: "80px",
                marginBottom: "16px",
                objectFit: "contain",
              }}
              onError={(e) => (e.target.style.display = "none")} // Hides if missing
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

          {/* DEMO BUTTON */}
          <div
            style={{
              marginTop: 20,
              paddingTop: 20,
              borderTop: "1px solid #f1f5f9",
              textAlign: "center",
            }}
          >
            <p
              style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: 10 }}
            >
              For Proposal Review Only
            </p>
            <button onClick={handleDemoLogin} style={styles.demoBtn}>
              Enter Demo Mode (No Database)
            </button>
          </div>
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
            <div style={styles.navLogoContainer}>
              <img
                src="/logo.png"
                alt="SOS Logo"
                style={{ height: "28px" }}
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
            <span style={{ whiteSpace: "nowrap" }}>SOS VSLA MIS</span>
          </div>

          {/* Desktop Nav */}
          <div className="desktop-only" style={styles.desktopNav}>
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
                  fontWeight: activeTab === item.id ? "600" : "400",
                }}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="mobile-only"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <button
              onClick={handleLogout}
              style={styles.logoutBtn}
              className="desktop-only"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div style={styles.mobileMenu}>
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  ...styles.mobileNavLink,
                  background: activeTab === item.id ? "#1e293b" : "transparent",
                }}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              style={{ ...styles.mobileNavLink, color: "#ef4444" }}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
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
  },
  loginContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f5f9",
    padding: 20,
  },
  loginCard: {
    background: "white",
    padding: "40px",
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
  },
  demoBtn: {
    padding: "10px",
    background: "white",
    color: "#64748b",
    borderRadius: "8px",
    cursor: "pointer",
    border: "1px solid #cbd5e1",
    fontWeight: "600",
    fontSize: "0.9rem",
    width: "100%",
  },

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
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 20px",
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
    fontSize: "1.2rem",
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
    color: "white",
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
  },

  mobileMenu: {
    position: "absolute",
    top: "70px",
    left: 0,
    right: 0,
    background: "#0f172a",
    padding: 10,
    display: "flex",
    flexDirection: "column",
    gap: 5,
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
  },
  mobileNavLink: {
    display: "flex",
    gap: 12,
    padding: 16,
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "1rem",
    alignItems: "center",
    cursor: "pointer",
    textAlign: "left",
    borderRadius: 8,
  },
};
