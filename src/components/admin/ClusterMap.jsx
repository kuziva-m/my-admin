import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { supabase } from "../../lib/supabase";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet default icon not showing in React
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function ClusterMap() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    async function getData() {
      const { data } = await supabase.from("savings_groups").select("*");
      if (data) setGroups(data);
    }
    getData();
  }, []);

  return (
    <div
      style={{
        height: "600px",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
      }}
    >
      <MapContainer
        center={[-19.0154, 29.1549]} // Centered on Zimbabwe
        zoom={7}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {groups.map(
          (group) =>
            group.location_lat && (
              <Marker
                key={group.id}
                position={[group.location_lat, group.location_lng]}
              >
                <Popup>
                  <strong>{group.name}</strong>
                  <br />
                  Cluster: {group.cluster_zone}
                  <br />
                  Status: {group.status}
                </Popup>
              </Marker>
            ),
        )}
      </MapContainer>
    </div>
  );
}
