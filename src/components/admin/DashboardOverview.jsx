import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  Users,
  AlertTriangle,
  DollarSign,
  PieChart,
  Lock,
  UserMinus,
} from "lucide-react";

export default function DashboardOverview({ role }) {
  const [metrics, setMetrics] = useState({
    totalSavings: 28450,
    activeLoans: 12500,
    par: 3,
    beneficiaries: 142,
    retentionRate: 94, // RFB Req
    shareOutReady: 4500, // RFB Req
  });

  const savingsData = [
    { name: "Sep", amount: 12000 },
    { name: "Oct", amount: 15500 },
    { name: "Nov", amount: 19000 },
    { name: "Dec", amount: 24800 },
    { name: "Jan", amount: 28450 },
  ];

  const locationData = [
    { name: "Bulawayo", groups: 12 },
    { name: "Waterfalls", groups: 8 },
    { name: "Bindura", groups: 5 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* RFB Req: Role Specific Header */}
      <div
        style={{
          background: role === "Director" ? "#1e293b" : "#3b82f6",
          color: "white",
          padding: 15,
          borderRadius: 8,
        }}
      >
        <strong>{role} Dashboard:</strong>{" "}
        {role === "Director"
          ? "Strategic Overview & High Level Risk"
          : "Operational Field View"}
      </div>

      <div style={styles.grid}>
        <StatCard
          title="Total Savings"
          value={`$${metrics.totalSavings.toLocaleString()}`}
          icon={DollarSign}
          color="blue"
        />
        <StatCard
          title="Active Loans"
          value={`$${metrics.activeLoans.toLocaleString()}`}
          icon={TrendingUp}
          color="indigo"
        />
        {/* RFB: Share-out Summary */}
        <StatCard
          title="Share-out Ready"
          value={`$${metrics.shareOutReady.toLocaleString()}`}
          sub="Funds Available"
          icon={Lock}
          color="green"
        />
        {/* RFB: Dropout/Retention */}
        <StatCard
          title="Retention Rate"
          value={`${metrics.retentionRate}%`}
          sub="6% Dropout YTD"
          icon={UserMinus}
          color="orange"
        />
      </div>

      <div style={styles.chartGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Savings Accumulation Trend</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={savingsData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#005492"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Active Groups by Location</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip cursor={{ fill: "#f1f5f9" }} />
                <Bar
                  dataKey="groups"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, icon: Icon, color }) {
  const colors = {
    blue: { bg: "#eff6ff", text: "#1d4ed8" },
    indigo: { bg: "#e0e7ff", text: "#4338ca" },
    green: { bg: "#f0fdf4", text: "#15803d" },
    orange: { bg: "#fff7ed", text: "#c2410c" },
  };

  return (
    <div style={styles.card}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <div>
          <span style={styles.label}>{title}</span>
          <div style={styles.value}>{value}</div>
          {sub && <div style={styles.sub}>{sub}</div>}
        </div>
        <div
          style={{
            ...styles.iconBox,
            background: colors[color]?.bg || "#f1f5f9",
            color: colors[color]?.text || "#64748b",
          }}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  chartCard: {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
  },
  value: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#0f172a",
    marginTop: "8px",
  },
  sub: { fontSize: "0.85rem", color: "#64748b", marginTop: "4px" },
  iconBox: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  chartTitle: { margin: "0 0 20px 0", color: "#0f172a", fontSize: "1.1rem" },
};
