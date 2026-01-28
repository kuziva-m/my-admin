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
import { TrendingUp, Users, AlertTriangle, DollarSign } from "lucide-react";

export default function DashboardOverview() {
  const [metrics, setMetrics] = useState({
    totalSavings: 0,
    activeLoans: 0,
    par: 0,
    beneficiaries: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      // 1. Get Beneficiaries Count
      const { count: memberCount } = await supabase
        .from("members")
        .select("*", { count: "exact", head: true });

      // 2. Get Loan Stats
      const { data: loans } = await supabase
        .from("loans")
        .select("balance, status, due_date");
      const totalOutstanding =
        loans?.reduce((acc, l) => acc + (l.balance || 0), 0) || 0;
      const riskyLoans =
        loans?.filter(
          (l) => new Date(l.due_date) < new Date() && l.status !== "paid",
        ).length || 0;

      // 3. Mock Total Savings for Demo (since we don't have full transaction history yet)
      const totalSavings = 28450;

      setMetrics({
        totalSavings,
        activeLoans: totalOutstanding,
        par: riskyLoans,
        beneficiaries: memberCount || 0,
      });
    }
    fetchStats();
  }, []);

  // DEMO DATA: Tailored to SOS Locations
  const savingsData = [
    { name: "Sep", amount: 12000 },
    { name: "Oct", amount: 15500 },
    { name: "Nov", amount: 19000 },
    { name: "Dec", amount: 24800 },
    { name: "Jan", amount: 28450 },
  ];

  // DEMO DATA: Location Breakdown
  const locationData = [
    { name: "Bulawayo", groups: 12 },
    { name: "Waterfalls", groups: 8 },
    { name: "Bindura", groups: 5 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* TOP CARDS */}
      <div style={styles.grid}>
        <StatCard
          title="Total VSLA Savings"
          value={`$${metrics.totalSavings.toLocaleString()}`}
          icon={DollarSign}
          color="blue"
        />
        <StatCard
          title="Internal Loans Active"
          value={`$${metrics.activeLoans.toLocaleString()}`}
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title="Portfolio at Risk"
          value={metrics.par}
          sub="Loans Overdue > 30 Days"
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Total Beneficiaries"
          value={metrics.beneficiaries}
          icon={Users}
          color="green"
        />
      </div>

      {/* CHARTS SECTION */}
      <div style={styles.chartGrid}>
        {/* Savings Growth Chart */}
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
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#005492"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Breakdown */}
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
                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  contentStyle={{ borderRadius: 8 }}
                />
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

// ... StatCard and styles remain the same as previous (omitted for brevity)
function StatCard({ title, value, sub, icon: Icon, color }) {
  const colors = {
    blue: { bg: "#eff6ff", text: "#1d4ed8" },
    indigo: { bg: "#e0e7ff", text: "#4338ca" },
    red: { bg: "#fef2f2", text: "#b91c1c" },
    green: { bg: "#f0fdf4", text: "#15803d" },
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
            background: colors[color].bg,
            color: colors[color].text,
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
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
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
    letterSpacing: "0.5px",
  },
  value: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#0f172a",
    marginTop: "8px",
  },
  sub: {
    fontSize: "0.85rem",
    color: "#ef4444",
    marginTop: "4px",
    fontWeight: "500",
  },
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
