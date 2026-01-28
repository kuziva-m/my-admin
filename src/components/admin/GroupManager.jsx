import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Plus, MapPin, Users, Loader } from "lucide-react";

export default function GroupManager() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [newName, setNewName] = useState("");
  const [newCluster, setNewCluster] = useState("");
  const [newLat, setNewLat] = useState("");
  const [newLng, setNewLng] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    // Fetch groups and count members
    const { data, error } = await supabase
      .from("savings_groups")
      .select(`*, members(count)`)
      .order("name", { ascending: true });

    if (error) console.error(error);
    else setGroups(data || []);
    setLoading(false);
  };

  const handleCreateGroup = async () => {
    if (!newName || !newCluster) return alert("Name and Cluster are required");

    const { error } = await supabase.from("savings_groups").insert({
      name: newName,
      cluster_zone: newCluster,
      location_lat: parseFloat(newLat) || 0,
      location_lng: parseFloat(newLng) || 0,
      status: "active",
    });

    if (error) alert(error.message);
    else {
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
          marginBottom: 20,
        }}
      >
        <h2>Savings Groups</h2>
        <button onClick={() => setIsAdding(!isAdding)} style={styles.addBtn}>
          <Plus size={16} /> New Group
        </button>
      </div>

      {isAdding && (
        <div style={styles.formCard}>
          <h3>Register New Group</h3>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <input
              placeholder="Group Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={styles.input}
            />
            <input
              placeholder="Cluster/Zone"
              value={newCluster}
              onChange={(e) => setNewCluster(e.target.value)}
              style={styles.input}
            />
            <input
              placeholder="Latitude (e.g -19.01)"
              value={newLat}
              onChange={(e) => setNewLat(e.target.value)}
              style={styles.input}
            />
            <input
              placeholder="Longitude (e.g 29.15)"
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
                  <Users size={14} /> {group.members?.[0]?.count || 0} Members
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
    background: "#0f172a",
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
};
