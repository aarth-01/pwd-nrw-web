import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useState, useRef, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  TextField
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import L from "leaflet";
import bg from "../../assets/bg-front.jpg";

// ===== Fix default marker icon issue =====
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15); // smooth animation
    }
  }, [position, map]);

  return null;
}


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
  const [search, setSearch] = useState("");
  const mapRef = useRef(null);
  const navigate = useNavigate();

  const handleConfirm = () => { //new change
    if (!position) return;
    navigate("/engineer/leakage-form", {
      state: { location: position },
    });
  };

   const handleSearch = async () => {
    if (!search) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${search}`
      );
      const data = await res.json();

      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        setPosition({ lat, lng: lon });

      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar role="engineer" />

      {/* ===== PAGE BACKGROUND (NO BLUR) ===== */}
      <Box
        sx={{
          minHeight: "100vh",
          fontFamily: "'Poppins', sans-serif",
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          position: "relative",

          // ⭐ overlay without blur
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(255,255,255,0.55)"
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>

          {/* ===== CARD (no glass blur) ===== */}
          <Paper
            elevation={10}
            sx={{
              p: 4,
              borderRadius: 4,
              background: "rgba(255,255,255,0.95)",
              textAlign: "center"
            }}
          >
            <Typography
              variant="h5"
              fontWeight={600}
              letterSpacing={1.2}
              gutterBottom
            >
              Mark Leakage Location
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search location (e.g. Margao, Goa)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="outlined" onClick={handleSearch}>
                Search
              </Button>
            </Box>

            {/* ===== MAP ===== */}
            <Box
              sx={{
                mt: 2,
                borderRadius: 3,
                overflow: "hidden"
              }}
            >
              <MapContainer
                center={[15.2993, 74.124]}
                zoom={12}
                style={{ height: "420px", width: "100%" }}
                whenCreated={(map) => (mapRef.current = map)}
              >
                <TileLayer
                  attribution="© OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker setPosition={setPosition} />
                <RecenterMap position={position} />
                {position && <Marker position={position} />}
              </MapContainer>
            </Box>

            <Button
              variant="contained"
              sx={{
                mt: 3,
                borderRadius: 2,
                fontWeight: 600,
                px: 4
              }}
              disabled={!position}
              onClick={handleConfirm}
            >
              Confirm Location
            </Button>
          </Paper>
        </Container>
      </Box>
    </>
  );
}