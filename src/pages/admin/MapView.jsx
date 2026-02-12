import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import L from "leaflet";
import bg from "../../assets/LBB.jpg";

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
  const [leakages, setLeakages] = useState([]);

  /* 🔥 Fetch Firestore Data */
  useEffect(() => {
    const fetchLeakages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "leakages"));

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLeakages(data);
      } catch (error) {
        console.log("Error fetching leakages:", error);
      }
    };

    fetchLeakages();
  }, []);

  /* 🔍 Filtering Logic */
  const filteredLeakages = leakages.filter((item) => {
    const constituencyMatch =
      selectedConstituency === "All" ||
      item.constituency === selectedConstituency;

    const itemDate = item.timestamp?.toDate?.()
      ? item.timestamp.toDate().toISOString().split("T")[0]
      : "";

    const dateMatch = !selectedDate || itemDate === selectedDate;

    return constituencyMatch && dateMatch;
  });

  return (
    <>
      <Navbar role="admin" />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          {/* Title */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.95)",
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              Leakage Locations – Constituency View
            </Typography>
          </Paper>

          {/* Filters */}
          <Paper
            elevation={2}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.95)",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label="Constituency"
                  value={selectedConstituency}
                  onChange={(e) =>
                    setSelectedConstituency(e.target.value)
                  }
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
                  onChange={(e) =>
                    setSelectedDate(e.target.value)
                  }
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Map */}
          <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <MapContainer
              center={[15.2993, 74.124]}
              zoom={11}
              style={{ height: "500px", width: "100%" }}
            >
              <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {filteredLeakages.map((item) => (
                <Marker
                  key={item.id}
                  position={[
                    item.location?.lat,
                    item.location?.lng,
                  ]}
                >
                  <Popup>
                    <b>Constituency:</b> {item.constituency} <br />
                    <b>Leakage Type:</b> {item.leakageType} <br />
                    <b>Engineer:</b> {item.plumberName} <br />
                    <b>Address:</b> {item.location?.address}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
