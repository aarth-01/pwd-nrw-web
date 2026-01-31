import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import { useState } from "react";
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
  const [selectedConstituency, setSelectedConstituency] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");

  const filteredLeakages = mockLeakages.filter((item) => {
    const constituencyMatch =
      selectedConstituency === "All" ||
      item.constituency === selectedConstituency;

    const dateMatch =
      !selectedDate || item.date === selectedDate;

    return constituencyMatch && dateMatch;
  });

  return (
    <>
      <Navbar role="admin" />
      <Container sx={{ mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Leakage Locations – Constituency View
        </Typography>

        {/* 🔍 FILTER CONTROLS */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Constituency"
              value={selectedConstituency}
              onChange={(e) => setSelectedConstituency(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Margao">Margao</MenuItem>
              <MenuItem value="Fatorda">Fatorda</MenuItem>
              <MenuItem value="Benaulim">Benaulim</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              type="date"
              fullWidth
              label="Date"
              InputLabelProps={{ shrink: true }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Grid>
        </Grid>

        {/* 🗺️ MAP */}
        <MapContainer
          center={[15.2993, 74.124]}
          zoom={11}
          style={{ height: "450px", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredLeakages.map((item) => (
            <Marker key={item.id} position={item.location}>
              <Popup>
                <b>Constituency:</b> {item.constituency} <br />
                <b>Leakage Type:</b> {item.leakageType} <br />
                <b>Plumber:</b> {item.plumber} <br />
                <b>Date:</b> {item.date}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Container>
    </>
  );
}
