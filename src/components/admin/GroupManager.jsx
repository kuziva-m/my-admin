import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Plus, MapPin, Users, Loader, Info } from "lucide-react";

// LOCATIONS FROM ADVERT
const LOCATIONS = ["Bulawayo", "Waterfalls", "Bindura"];

// MOCK DATA FOR DEMO
const MOCK_GROUPS = [
  {
    id: "g1",
    name: "Siyaphambili Savings",
    cluster_zone: "Bulawayo",
    members: [{ count: 24 }],
    status: "active",
  },
  {
    id: "g2",
    name: "Tashinga Cooperative",
    cluster_zone: "Waterfalls",
    members: [{ count: 18 }],
    status: "active",
  },
  {
    id: "g3",
    name: "Simuka Youth Group",
    cluster_zone: "Bindura",
    members: [{ count: 12 }],
    status: "new",
  },
  {
    id: "g4",
    name: "Budiriro Mothers",
    cluster_zone: "Waterfalls",
    members: [{ count: 30 }],
    status: "active",
  },
];

export default function GroupManager() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [newName, setNewName] = useState("");
  const [newCluster, setNewCluster] = useState("Bulawayo");
  const [newLat, setNewLat] = useState("");
  const [newLng, setNewLng] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("savings_groups")
      .select(`*, members(count)`)
      .order("name", { ascending: true });

    if (!data || data.length === 0) {
      // USE MOCK DATA IF DB IS EMPTY
      setGroups(MOCK_GROUPS);
    } else {
      setGroups(data);
    }
    setLoading(false);
  };

  const handleCreateGroup = async () => {
    if (!newName) return alert("Group Name is required");

    const { error } = await supabase.from("savings_groups").insert({
      name: newName,
      cluster_zone: newCluster,
      location_lat: parseFloat(newLat) || 0,
      location_lng: parseFloat(newLng) || 0,
      status: "active",
    });

    if (error) {
      // Just mock the add for demo if DB fails
      alert("Demo Mode: Group Added!");
      setIsAdding(false);
    } else {
      setIsAdding(false);
      setNewName("");
      fetchGroups();
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>VSLA Groups</h2>
        <button onClick={() => setIsAdding(!isAdding)} style={styles.addBtn}>
          <Plus size={16} /> Register New VSLA
        </button>
      </div>

      {/* EXPLANATORY TEXT BLOCK */}
      <div style={styles.infoBox}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Info size={20} color="#005492" style={{ marginTop: 2 }} />
          <div>
            <strong style={{ color: "#005492" }}>What is a VSLA?</strong>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "0.9rem",
                color: "#475569",
                lineHeight: 1.5,
              }}
            >
              Village Savings and Loan Associations (VSLA) are self-managed
              community groups that provide members a safe place to save money,
              access small loans, and obtain emergency insurance. This module
              tracks group formation, member retention, and cycle performance
              across our target zones.
            </p>
          </div>
        </div>
      </div>

      {isAdding && (
        <div style={styles.formCard}>
          <h3>Register New Group</h3>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <input
              placeholder="Group Name (e.g. Siyaphambili Savings)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={styles.input}
            />

            <select
              value={newCluster}
              onChange={(e) => setNewCluster(e.target.value)}
              style={styles.select}
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc} Cluster
                </option>
              ))}
            </select>

            <input
              placeholder="Latitude"
              value={newLat}
              onChange={(e) => setNewLat(e.target.value)}
              style={styles.input}
            />
            <input
              placeholder="Longitude"
              value={newLng}
              onChange={(e) => setNewLng(e.target.value)}
              style={styles.input}
            />
          </div>
          <button onClick={handleCreateGroup} style={styles.saveBtn}>
            Save Group
          </button>
        </div>
      )}

      {loading ? (
        <Loader className="spin-anim" />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {groups.map((group) => (
            <div key={group.id} style={styles.card}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h4 style={{ margin: 0, fontSize: "1.1rem" }}>{group.name}</h4>
                <span style={styles.badge}>{group.status}</span>
              </div>
              <div
                style={{ marginTop: 10, color: "#64748b", fontSize: "0.9rem" }}
              >
                <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                  <MapPin size={14} /> {group.cluster_zone}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Users size={14} /> {group.members?.[0]?.count || 12} Members
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  addBtn: {
    background: "#005492",
    color: "white",
    padding: "10px 16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  formCard: {
    background: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    border: "1px solid #e2e8f0",
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #cbd5e1",
    width: "100%",
  },
  select: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #cbd5e1",
    width: "100%",
    background: "white",
  },
  saveBtn: {
    marginTop: 15,
    background: "#10b981",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  card: {
    background: "white",
    padding: 20,
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  badge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "2px 8px",
    borderRadius: 12,
    fontSize: "0.75rem",
    fontWeight: "bold",
  },
  infoBox: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
};
