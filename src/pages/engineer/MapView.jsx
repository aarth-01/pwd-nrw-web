import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import L from "leaflet";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationMarker({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
}

export default function MapView() {
  const [position, setPosition] = useState(null);
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/engineer/leakage-form", {
      state: { location: position },
    });
  };

  return (
    <>
      <Navbar role="engineer" />
      <Container sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Mark Leakage Location
        </Typography>

        <MapContainer
          center={[15.2993, 74.124]}
          zoom={12}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker setPosition={setPosition} />
          {position && <Marker position={position} />}
        </MapContainer>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          disabled={!position}
          onClick={handleConfirm}
        >
          Confirm Location
        </Button>
      </Container>
    </>
  );
}
