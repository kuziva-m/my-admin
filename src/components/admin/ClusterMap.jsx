import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { supabase } from "../../lib/supabase";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Icons setup (omitted for brevity, assume standard Leaflet setup)
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Mock Data incase DB is empty
const MOCK_LOCATIONS = [
  {
    id: 1,
    name: "Bulawayo Cluster",
    lat: -20.14,
    lng: 28.58,
    status: "saturated",
  },
  {
    id: 2,
    name: "Waterfalls Cluster",
    lat: -17.88,
    lng: 31.02,
    status: "active",
  },
  {
    id: 3,
    name: "Bindura Zone",
    lat: -17.3,
    lng: 31.33,
    status: "underserved",
  },
];

export default function ClusterMap() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    async function getData() {
      const { data } = await supabase.from("savings_groups").select("*");
      if (!data || data.length === 0) setGroups(MOCK_LOCATIONS);
      else setGroups(data);
    }
    getData();
  }, []);

  // RFB Req: Saturated vs Underserved Zones
  const getZoneColor = (status) => {
    if (status === "underserved") return "#ef4444"; // Red for attention
    if (status === "saturated") return "#10b981"; // Green for good coverage
    return "#3b82f6"; // Blue for standard
  };

  return (
    <div
      style={{
        height: "600px",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        position: "relative",
      }}
    >
      {/* Legend Overlay */}
      <div style={styles.legend}>
        <h4>Zone Intelligence</h4>
        <div style={styles.legendItem}>
          <span style={{ ...styles.dot, background: "#10b981" }}></span>{" "}
          Saturated (Stable)
        </div>
        <div style={styles.legendItem}>
          <span style={{ ...styles.dot, background: "#ef4444" }}></span>{" "}
          Underserved (High Priority)
        </div>
        <div style={styles.legendItem}>
          <span style={{ ...styles.dot, background: "#3b82f6" }}></span> Active
          Cluster
        </div>
      </div>

      <MapContainer
        center={[-19.0154, 29.1549]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {groups.map((group) => (
          <div key={group.id}>
            {/* Intelligence Overlay Circle */}
            <Circle
              center={[
                group.lat || group.location_lat || 0,
                group.lng || group.location_lng || 0,
              ]}
              pathOptions={{
                color: getZoneColor(group.status),
                fillColor: getZoneColor(group.status),
                fillOpacity: 0.2,
              }}
              radius={5000}
            />
            <Marker
              position={[
                group.lat || group.location_lat || 0,
                group.lng || group.location_lng || 0,
              ]}
            >
              <Popup>
                <strong>{group.name}</strong>
                <br />
                Zone Status:{" "}
                <span
                  style={{
                    color: getZoneColor(group.status),
                    fontWeight: "bold",
                  }}
                >
                  {(group.status || "active").toUpperCase()}
                </span>
              </Popup>
            </Marker>
          </div>
        ))}
      </MapContainer>
    </div>
  );
}

const styles = {
  legend: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1000,
    background: "white",
    padding: 15,
    borderRadius: 8,
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: "0.85rem",
    marginBottom: 5,
  },
  dot: { width: 10, height: 10, borderRadius: "50%", display: "block" },
};
