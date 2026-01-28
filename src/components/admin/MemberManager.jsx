import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Users, Search } from "lucide-react";

export default function MemberManager() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    const { data } = await supabase
      .from("members")
      .select(`*, savings_groups (name)`)
      .order("name", { ascending: true });
    if (data) setMembers(data);
  }

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
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h2>Beneficiaries</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "white",
            padding: "0 10px",
            border: "1px solid #cbd5e1",
            borderRadius: 8,
          }}
        >
          <Search size={16} color="#94a3b8" />
          <input
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "none", padding: 10, outline: "none", width: 200 }}
          />
        </div>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
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
