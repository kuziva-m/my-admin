import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function LoanManager() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    // Fetch loans with Member and Group details
    const { data, error } = await supabase
      .from("loans")
      .select(
        `
        *,
        members (name, phone),
        savings_groups (name)
      `,
      )
      .order("due_date", { ascending: true });

    if (error) console.error(error);
    else setLoans(data || []);
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Loan Portfolio</h2>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Total Outstanding</span>
          <span style={styles.statValue}>
            ${loans.reduce((acc, l) => acc + (l.balance || 0), 0).toFixed(2)}
          </span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Active Loans</span>
          <span style={styles.statValue}>
            {loans.filter((l) => l.status === "active").length}
          </span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statLabel}>At Risk (Overdue)</span>
          <span style={{ ...styles.statValue, color: "#ef4444" }}>
            {
              loans.filter(
                (l) => new Date(l.due_date) < new Date() && l.status !== "paid",
              ).length
            }
          </span>
        </div>
      </div>

      {/* Loan Table */}
      <div style={styles.tableCard}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead
            style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}
          >
            <tr>
              <th style={styles.th}>Member</th>
              <th style={styles.th}>Group</th>
              <th style={styles.th}>Amount Due</th>
              <th style={styles.th}>Due Date</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => {
              const isOverdue =
                new Date(loan.due_date) < new Date() && loan.status !== "paid";
              return (
                <tr key={loan.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={styles.td}>
                    <strong>{loan.members?.name}</strong>
                    <br />
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                      {loan.members?.phone}
                    </span>
                  </td>
                  <td style={styles.td}>{loan.savings_groups?.name}</td>
                  <td style={styles.td}>${loan.balance}</td>
                  <td style={styles.td}>
                    {new Date(loan.due_date).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    {loan.status === "paid" ? (
                      <span
                        style={{
                          ...styles.badge,
                          background: "#dcfce7",
                          color: "#166534",
                        }}
                      >
                        <CheckCircle size={12} /> Paid
                      </span>
                    ) : isOverdue ? (
                      <span
                        style={{
                          ...styles.badge,
                          background: "#fee2e2",
                          color: "#991b1b",
                        }}
                      >
                        <AlertTriangle size={12} /> Overdue
                      </span>
                    ) : (
                      <span
                        style={{
                          ...styles.badge,
                          background: "#eff6ff",
                          color: "#1e40af",
                        }}
                      >
                        <Clock size={12} /> Active
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  statsBar: { display: "flex", gap: 20, marginBottom: 20 },
  stat: {
    background: "white",
    padding: 20,
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    flex: 1,
  },
  statLabel: {
    display: "block",
    fontSize: "0.8rem",
    color: "#64748b",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  statValue: { fontSize: "1.5rem", fontWeight: "bold", color: "#0f172a" },
  tableCard: {
    background: "white",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  th: {
    textAlign: "left",
    padding: "12px 16px",
    fontSize: "0.85rem",
    color: "#64748b",
  },
  td: { padding: "16px", fontSize: "0.9rem", color: "#334155" },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "4px 8px",
    borderRadius: 12,
    fontSize: "0.75rem",
    fontWeight: "bold",
  },
};
