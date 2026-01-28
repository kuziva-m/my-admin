import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Users, Search, AlertOctagon, Download } from "lucide-react";

// Mock Data for Demo
const MOCK_MEMBERS = [
  {
    id: 1,
    name: "Sarah Moyo",
    national_id: "63-1234567-T-07",
    risk_status: "low",
    savings_groups: { name: "Siyaphambili" },
  },
  {
    id: 2,
    name: "Tendai Gava",
    national_id: "63-2345678-F-22",
    risk_status: "low",
    savings_groups: { name: "Tashinga" },
  },
  {
    id: 3,
    name: "Grace Ndlovu",
    national_id: "08-9876543-X-12",
    risk_status: "high",
    savings_groups: { name: "Siyaphambili" },
  },
  {
    id: 4,
    name: "Peter Banda",
    national_id: "59-1122334-P-59",
    risk_status: "low",
    savings_groups: { name: "Simuka" },
  },
  {
    id: 5,
    name: "Sarah Moyo",
    national_id: "63-1234567-T-07",
    risk_status: "medium",
    savings_groups: { name: "Budiriro" },
  }, // Duplicate for demo
];

export default function MemberManager() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [duplicates, setDuplicates] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    const { data } = await supabase
      .from("members")
      .select(`*, savings_groups (name)`)
      .order("name", { ascending: true });

    if (!data || data.length === 0) setMembers(MOCK_MEMBERS);
    else setMembers(data);
  }

  // RFB Req: Duplicate Detection
  const checkDuplicates = () => {
    const seen = new Set();
    const dups = [];
    members.forEach((m) => {
      if (seen.has(m.national_id)) dups.push(m);
      seen.add(m.national_id);
    });
    setDuplicates(dups);
    if (dups.length > 0)
      alert(
        `Found ${dups.length} potential duplicate records based on National ID.`,
      );
    else alert("No duplicates found in current registry.");
  };

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.savings_groups?.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h2>Beneficiaries</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={checkDuplicates} style={styles.actionBtn}>
            <AlertOctagon size={16} /> Check Duplicates
          </button>
          <button
            onClick={() => alert("Downloading CSV...")}
            style={styles.outlineBtn}
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {duplicates.length > 0 && (
        <div style={styles.alertBox}>
          <strong>Alert:</strong> {duplicates.length} duplicate National IDs
          detected. Please review records for{" "}
          {duplicates.map((d) => d.name).join(", ")}.
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "white",
          padding: "0 10px",
          border: "1px solid #cbd5e1",
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <Search size={16} color="#94a3b8" />
        <input
          placeholder="Search by Name or Group..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            border: "none",
            padding: 10,
            outline: "none",
            width: "100%",
          }}
        />
      </div>

      <div className="table-container">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            minWidth: "600px",
          }}
        >
          <thead
            style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}
          >
            <tr>
              <th
                style={{ padding: 16, color: "#64748b", fontSize: "0.85rem" }}
              >
                Name
              </th>
              <th
                style={{ padding: 16, color: "#64748b", fontSize: "0.85rem" }}
              >
                Group
              </th>
              <th
                style={{ padding: 16, color: "#64748b", fontSize: "0.85rem" }}
              >
                National ID
              </th>
              <th
                style={{ padding: 16, color: "#64748b", fontSize: "0.85rem" }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: 16 }}>{m.name}</td>
                <td style={{ padding: 16 }}>{m.savings_groups?.name}</td>
                <td style={{ padding: 16, fontFamily: "monospace" }}>
                  {m.national_id}
                </td>
                <td style={{ padding: 16 }}>
                  <span
                    style={{
                      background:
                        m.risk_status === "high" ? "#fee2e2" : "#f1f5f9",
                      color: m.risk_status === "high" ? "#ef4444" : "#64748b",
                      padding: "4px 8px",
                      borderRadius: 4,
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                    }}
                  >
                    {m.risk_status?.toUpperCase() || "LOW"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  actionBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 500,
  },
  outlineBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "white",
    color: "#0f172a",
    border: "1px solid #cbd5e1",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 500,
  },
  alertBox: {
    background: "#fef2f2",
    color: "#b91c1c",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: "0.9rem",
    border: "1px solid #fecaca",
  },
};
