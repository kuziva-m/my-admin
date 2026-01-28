import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { AlertTriangle, CheckCircle, Clock, DollarSign, X } from "lucide-react";

export default function LoanManager() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Repayment Modal State
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("loans")
      .select(`*, members (name, phone), savings_groups (name)`)
      .order("due_date", { ascending: true });

    if (error) console.error(error);
    else setLoans(data || []);
    setLoading(false);
  };

  const handleRepayment = async () => {
    if (!amount || isNaN(amount)) return alert("Please enter a valid amount");
    setProcessing(true);

    const newBalance = parseFloat(selectedLoan.balance) - parseFloat(amount);
    const status = newBalance <= 0 ? "paid" : "active";

    // 1. Update Loan Balance
    const { error } = await supabase
      .from("loans")
      .update({ balance: newBalance, status: status })
      .eq("id", selectedLoan.id);

    // 2. Create Transaction Record (Optional)
    if (!error) {
      const { error: txError } = await supabase.from("transactions").insert({
        member_id: selectedLoan.member_id,
        group_id: selectedLoan.group_id,
        type: "loan_repayment",
        amount: amount,
        cycle_id: "cycle_1",
      });

      if (txError) console.error("Transaction log error:", txError);

      alert("Repayment recorded successfully!");
      setSelectedLoan(null);
      setAmount("");
      fetchLoans();
    } else {
      alert("Error: " + error.message);
    }
    setProcessing(false);
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

      {/* Loan Table - WRAPPED FOR SCROLLING */}
      <div className="table-container">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "800px",
          }}
        >
          <thead
            style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}
          >
            <tr>
              <th style={styles.th}>Member</th>
              <th style={styles.th}>Group</th>
              <th style={styles.th}>Balance</th>
              <th style={styles.th}>Due Date</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
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
                    <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                      {loan.members?.phone}
                    </div>
                  </td>
                  <td style={styles.td}>{loan.savings_groups?.name}</td>
                  <td style={{ ...styles.td, fontWeight: "bold" }}>
                    ${loan.balance?.toFixed(2)}
                  </td>
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
                  <td style={styles.td}>
                    {loan.status !== "paid" && (
                      <button
                        onClick={() => setSelectedLoan(loan)}
                        style={styles.actionBtn}
                      >
                        Repay
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* REPAYMENT MODAL */}
      {selectedLoan && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>Record Repayment</h3>
              <button
                onClick={() => setSelectedLoan(null)}
                style={styles.closeBtn}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.9rem",
                  marginBottom: 5,
                }}
              >
                Member: <strong>{selectedLoan.members?.name}</strong>
              </p>
              <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                Outstanding Balance:{" "}
                <strong style={{ color: "#ef4444" }}>
                  ${selectedLoan.balance}
                </strong>
              </p>
            </div>

            <label style={styles.label}>Repayment Amount ($)</label>
            <div style={styles.inputWrapper}>
              <DollarSign size={16} color="#64748b" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={styles.input}
                placeholder="0.00"
                autoFocus
              />
            </div>

            <button
              onClick={handleRepayment}
              disabled={processing}
              style={styles.payBtn}
            >
              {processing ? "Processing..." : "Confirm Repayment"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  statsBar: { display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 20 },
  stat: {
    background: "white",
    padding: 20,
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    flex: "1 1 200px",
  },
  statLabel: {
    display: "block",
    fontSize: "0.8rem",
    color: "#64748b",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  statValue: { fontSize: "1.5rem", fontWeight: "bold", color: "#0f172a" },
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
  actionBtn: {
    background: "#0f172a",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: "0.8rem",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  modal: {
    background: "white",
    padding: 24,
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#64748b",
  },
  label: {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#0f172a",
    marginBottom: 8,
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: 12,
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    marginBottom: 20,
  },
  input: { border: "none", outline: "none", fontSize: "1.1rem", width: "100%" },
  payBtn: {
    width: "100%",
    background: "#10b981",
    color: "white",
    padding: 12,
    borderRadius: 8,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "1rem",
  },
};
