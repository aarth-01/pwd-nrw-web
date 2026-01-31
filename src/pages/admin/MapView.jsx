import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Container, Typography } from "@mui/material";
import Navbar from "../../components/Navbar";
import { mockLeakages } from "../../data/mockLeakages";
import L from "leaflet";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function AdminMapView() {
  return (
    <>
      <Navbar role="admin" />
      <Container sx={{ mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Leakage Locations – Constituency View
        </Typography>

        <MapContainer
          center={[15.2993, 74.124]}
          zoom={11}
          style={{ height: "450px", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {mockLeakages.map((item) => (
            <Marker key={item.id} position={item.location}>
              <Popup>
                <b>Constituency:</b> {item.constituency} <br />
                <b>Leakage Type:</b> {item.leakageType} <br />
                <b>Plumber:</b> {item.plumber}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Container>
    </>
  );
}
