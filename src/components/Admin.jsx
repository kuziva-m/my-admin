import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  Users,
  FileText,
  LogOut,
  MapPin,
  Settings,
  LayoutDashboard,
  FileDown,
  ChevronDown,
  User,
  Shield,
  Bell,
} from "lucide-react";

// Components
import DashboardOverview from "./admin/DashboardOverview";
import GroupManager from "./admin/GroupManager";
import LoanManager from "./admin/LoanManager";
import MemberManager from "./admin/MemberManager";
import ClusterMap from "./admin/ClusterMap";
import SettingsManager from "./admin/SettingsManager";
import ReportsManager from "./admin/ReportsManager";

export default function Admin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  // UI States
  const [isProfileOpen, setProfileOpen] = useState(false); // Toggle for Profile Dropdown

  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
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

  const handleDemoLogin = () => {
    setSession({ user: { email: "demo@sos-zimbabwe.org", id: "demo-123" } });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfileOpen(false);
  };

  const MENU_ITEMS = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "groups", label: "VSLA Groups", icon: Users },
    { id: "loans", label: "Lending", icon: FileText },
    { id: "members", label: "Beneficiaries", icon: Users },
    { id: "map", label: "Map", icon: MapPin },
    { id: "reports", label: "Reports", icon: FileDown },
    { id: "settings", label: "Config", icon: Settings },
  ];

  if (loading) return <div style={styles.centerScreen}>Loading System...</div>;

  // --- LOGIN SCREEN ---
  if (!session) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <img
              src="/logo.jpg"
              alt="SOS Logo"
              style={{
                height: "80px",
                marginBottom: "16px",
                objectFit: "contain",
              }}
              onError={(e) => (e.target.style.display = "none")}
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

          <div
            style={{
              marginTop: 20,
              paddingTop: 20,
              borderTop: "1px solid #f1f5f9",
              textAlign: "center",
            }}
          >
            <button onClick={handleDemoLogin} style={styles.demoBtn}>
              Enter Demo Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        paddingBottom: "80px",
      }}
    >
      {" "}
      {/* Added paddingBottom for mobile nav */}
      {/* DESKTOP HEADER */}
      <header className="desktop-only" style={styles.header}>
        <div style={styles.headerContent}>
          {/* Branding */}
          <div style={styles.brandSection}>
            <div style={styles.logoBox}>
              <img
                src="/logo.jpg"
                alt="SOS"
                style={{ height: "32px" }}
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
            <div style={styles.brandText}>
              <span
                style={{ fontWeight: 700, fontSize: "1.2rem", color: "white" }}
              >
                SOS VSLA
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#bfdbfe",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                }}
              >
                Zimbabwe
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav style={styles.navLinks}>
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  ...styles.navItem,
                  background:
                    activeTab === item.id
                      ? "rgba(255,255,255,0.15)"
                      : "transparent",
                  opacity: activeTab === item.id ? 1 : 0.8,
                }}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Profile & Actions */}
          <div style={styles.userSection}>
            <div
              style={styles.userProfile}
              onClick={() => setProfileOpen(!isProfileOpen)}
            >
              <div style={styles.avatar}>
                <User size={18} color="#005492" />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingRight: 4,
                }}
              >
                <span
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  Admin User
                </span>
                <span
                  style={{ fontSize: "0.75rem", opacity: 0.9, lineHeight: 1.2 }}
                >
                  Director Role
                </span>
              </div>
              <ChevronDown
                size={16}
                style={{
                  marginLeft: 8,
                  opacity: 0.8,
                  transform: isProfileOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "0.2s",
                }}
              />
            </div>

            {/* DROPDOWN MENU */}
            {isProfileOpen && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownHeader}>User Account</div>
                <button style={styles.dropdownItem}>
                  <User size={14} /> My Profile
                </button>
                <button style={styles.dropdownItem}>
                  <Bell size={14} /> Notifications
                </button>
                <button style={styles.dropdownItem}>
                  <Shield size={14} /> Privacy
                </button>
                <div style={styles.dropdownDivider}></div>
                <button
                  onClick={handleLogout}
                  style={{ ...styles.dropdownItem, color: "#ef4444" }}
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* MOBILE HEADER (Simple Brand Only) */}
      <div className="mobile-only" style={styles.mobileHeader}>
        <div style={styles.brandSection}>
          <div style={styles.logoBox}>
            <img
              src="/logo.jpg"
              alt="SOS"
              style={{ height: "24px" }}
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
          <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "white" }}>
            SOS VSLA
          </span>
        </div>
        <div
          onClick={() => setProfileOpen(!isProfileOpen)}
          style={{ color: "white", cursor: "pointer" }}
        >
          <User size={24} />
        </div>
      </div>
      {/* MOBILE DROPDOWN (If header user icon clicked) */}
      {isProfileOpen && (
        <div
          className="mobile-only"
          style={{ ...styles.dropdown, top: 60, right: 10 }}
        >
          <button
            onClick={handleLogout}
            style={{ ...styles.dropdownItem, color: "#ef4444" }}
          >
            Logout
          </button>
        </div>
      )}
      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="mobile-only" style={styles.bottomNav}>
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              ...styles.bottomNavItem,
              color: activeTab === item.id ? "#005492" : "#94a3b8",
              fontWeight: activeTab === item.id ? "600" : "400",
            }}
          >
            <div
              style={{
                marginBottom: 4,
                background: activeTab === item.id ? "#eff6ff" : "transparent",
                padding: 6,
                borderRadius: 20,
              }}
            >
              <item.icon
                size={20}
                strokeWidth={activeTab === item.id ? 2.5 : 2}
              />
            </div>
            <span style={{ fontSize: "0.65rem" }}>{item.label}</span>
          </button>
        ))}
      </nav>
      {/* Main Content */}
      <main style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        {activeTab === "dashboard" && <DashboardOverview />}
        {activeTab === "groups" && <GroupManager />}
        {activeTab === "loans" && <LoanManager />}
        {activeTab === "members" && <MemberManager />}
        {activeTab === "map" && <ClusterMap />}
        {activeTab === "reports" && <ReportsManager />}
        {activeTab === "settings" && <SettingsManager />}
      </main>
    </div>
  );
}

const styles = {
  // HEADER (DESKTOP) - INCREASED HEIGHT
  header: {
    background: "#005492", // SOS Blue
    color: "white",
    height: "80px", // Increased from 72px
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
  },
  brandSection: { display: "flex", alignItems: "center", gap: 12 },
  logoBox: {
    background: "white",
    padding: "4px 6px",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
  },
  brandText: { display: "flex", flexDirection: "column", lineHeight: 1 },

  navLinks: { display: "flex", gap: 6, height: "100%", alignItems: "center" },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    color: "white",
    fontSize: "0.9rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    height: "40px",
  },

  userSection: { display: "flex", alignItems: "center", position: "relative" },
  userProfile: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
    background: "rgba(255,255,255,0.1)",
    padding: "8px 16px", // Increased padding
    borderRadius: 40,
    transition: "background 0.2s",
    userSelect: "none",
  },
  avatar: {
    width: 32,
    height: 32,
    background: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // DROPDOWN MENU
  dropdown: {
    position: "absolute",
    top: "60px",
    right: 0,
    background: "white",
    borderRadius: 12,
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
    width: "200px",
    padding: "8px",
    zIndex: 2000,
    border: "1px solid #e2e8f0",
    color: "#0f172a",
  },
  dropdownHeader: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#94a3b8",
    padding: "8px 12px",
    textTransform: "uppercase",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "10px 12px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    borderRadius: 8,
    fontSize: "0.9rem",
    color: "#334155",
    textAlign: "left",
    transition: "background 0.1s",
  },
  dropdownDivider: { height: 1, background: "#f1f5f9", margin: "4px 0" },

  // MOBILE STYLES
  mobileHeader: {
    background: "#005492",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  bottomNav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "white",
    height: "70px", // Tall enough for touch
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    boxShadow: "0 -4px 20px rgba(0,0,0,0.05)",
    zIndex: 2000,
    borderTop: "1px solid #f1f5f9",
    paddingBottom: "safe-area-inset-bottom", // For iPhones
  },
  bottomNavItem: {
    background: "transparent",
    border: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flex: 1,
    height: "100%",
  },

  // Login Styles
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
};
