import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap
} from "react-leaflet";
import { useState, useRef, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  TextField,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import L from "leaflet";
import bg from "../../assets/bg-front.jpg";

/* ===== Fix Leaflet Marker Icons ===== */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

/* ===== Smooth Recenter ===== */
function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position, map]);

  return null;
}

/* ===== Click Marker ===== */
function LocationMarker({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
}

export default function MapView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [position, setPosition] = useState(null);
  const [search, setSearch] = useState("");

  const mapRef = useRef(null);
  const navigate = useNavigate();

  /* ===== Confirm Location ===== */
  const handleConfirm = () => {
    if (!position) return;

    navigate("/engineer/leakage-form", {
      state: { location: position },
    });
  };

  /* ===== Search Location ===== */
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

  /* ================= MOBILE VERSION ================= */

  if (isMobile) {
    return (
      <>
        <Navbar role="engineer" />

        <Box
          sx={{
            height: "100vh",   // ✅ fixed (removed dvh)
            width: "100%",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* MAP */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 1
            }}
          >
            <MapContainer
              center={[15.2993, 74.124]}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
              whenCreated={(map) => {
                mapRef.current = map;
              }}
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

          {/* SEARCH BAR */}
          <Box
            sx={{
              position: "absolute",
              top: 80,
              left: 16,
              right: 16,
              zIndex: 2000,
              display: "flex",
              gap: 1
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />
            <Button variant="contained" onClick={handleSearch}>
              Go
            </Button>
          </Box>

          {/* CONFIRM BUTTON - FIXED POSITION */}
          <Box
            sx={{
              position: "fixed",   // ✅ important
              bottom: 20,
              left: 16,
              right: 16,
              zIndex: 9999
            }}
          >
            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={!position}
              onClick={handleConfirm}
              sx={{
                py: 1.8,
                borderRadius: 3,
                fontWeight: 600,
                boxShadow: "0 8px 20px rgba(0,0,0,0.35)"
              }}
            >
              Confirm Location
            </Button>
          </Box>
        </Box>
      </>
    );
  }

  /* ================= DESKTOP VERSION ================= */

  return (
    <>
      <Navbar role="engineer" />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(255,255,255,0.55)"
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Paper
            elevation={10}
            sx={{
              p: 4,
              borderRadius: 4,
              background: "rgba(255,255,255,0.95)",
              textAlign: "center"
            }}
          >
            <Typography variant="h5" gutterBottom>
              Mark Leakage Location
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search location"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="outlined" onClick={handleSearch}>
                Search
              </Button>
            </Box>

            <Box sx={{ borderRadius: 3, overflow: "hidden" }}>
              <MapContainer
                center={[15.2993, 74.124]}
                zoom={12}
                style={{ height: "420px", width: "100%" }}
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
              sx={{ mt: 3 }}
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