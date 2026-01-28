import { useState } from "react";
import { Save, Shield, Bell } from "lucide-react";

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    currency: "USD",
    interestRate: 10,
    riskThreshold: 30,
    emailAlerts: true,
  });

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <h2 style={{ marginBottom: "24px" }}>System Settings</h2>

      {/* Configuration Card */}
      <div style={styles.card}>
        <div style={styles.header}>
          <Shield size={20} color="#0f172a" />
          <h3>Risk & Finance Configuration</h3>
        </div>

        <div style={styles.row}>
          <label style={styles.label}>Base Currency</label>
          <select
            value={settings.currency}
            onChange={(e) => handleChange("currency", e.target.value)}
            style={styles.select}
          >
            <option value="USD">USD ($)</option>
            <option value="ZWG">ZWG</option>
            <option value="ZAR">ZAR (R)</option>
          </select>
        </div>

        <div style={styles.row}>
          <label style={styles.label}>Default Loan Interest Rate (%)</label>
          <input
            type="number"
            value={settings.interestRate}
            onChange={(e) => handleChange("interestRate", e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.row}>
          <label style={styles.label}>Portfolio at Risk Threshold (Days)</label>
          <input
            type="number"
            value={settings.riskThreshold}
            onChange={(e) => handleChange("riskThreshold", e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      {/* Notifications Card */}
      <div style={styles.card}>
        <div style={styles.header}>
          <Bell size={20} color="#0f172a" />
          <h3>Notifications</h3>
        </div>

        <div style={styles.row}>
          <label style={styles.label}>Email Alerts for Overdue Loans</label>
          <input
            type="checkbox"
            checked={settings.emailAlerts}
            onChange={(e) => handleChange("emailAlerts", e.target.checked)}
            style={{ width: 20, height: 20 }}
          />
        </div>
      </div>

      <button
        onClick={() => alert("Settings Saved (Demo)")}
        style={styles.saveBtn}
      >
        <Save size={18} /> Save Changes
      </button>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginBottom: "24px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "10px",
  },
  row: { marginBottom: "16px" },
  label: {
    display: "block",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#64748b",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "1rem",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "1rem",
    background: "white",
  },
  saveBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#0f172a",
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
  },
};
