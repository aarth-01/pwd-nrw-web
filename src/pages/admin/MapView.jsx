import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Box,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import L from "leaflet";
import bg from "../../assets/LBB.jpg";
import "leaflet/dist/leaflet.css";

/* FIX marker icon issue */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

/* Recenter Map */
function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position && Array.isArray(position)) {
      map.flyTo(position, 14);
    }
  }, [position, map]);

  return null;
}

export default function AdminMapView() {
  const [selectedConstituency, setSelectedConstituency] = useState("All");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [leakages, setLeakages] = useState([]);
  const [search, setSearch] = useState("");
  const [searchPosition, setSearchPosition] = useState(null);

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
        console.log("Error:", error);
      }
    };

    fetchLeakages();
  }, []);

  const filteredLeakages = leakages.filter((item) => {
    const constituencyMatch =
      selectedConstituency === "All" ||
      item.constituency === selectedConstituency;

    let itemDate = null;

    if (item.timestamp?.toDate) {
      itemDate = item.timestamp.toDate();
    }

    let dateMatch = true;

    if (fromDate && itemDate) {
      dateMatch = itemDate >= new Date(fromDate);
    }

    if (toDate && itemDate) {
      dateMatch = dateMatch && itemDate <= new Date(toDate);
    }

    return constituencyMatch && dateMatch;
  });

  const handleSearch = async () => {
    if (!search.trim()) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${search}`
      );

      const data = await res.json();

      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        setSearchPosition([lat, lon]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar role="admin" />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          pt: { xs: 10, md: 4 },
          pb: 4,
          pl: { md: "260px" },
        }}
      >
        <Container maxWidth="lg">

          {/* TITLE */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.95)",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ textAlign: { xs: "center", md: "left" } }}
            >
              Leakage Locations – Constituency View
            </Typography>
          </Paper>

          {/* FILTERS */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.95)",
            }}
          >
            <Grid container spacing={2}>

              {/* Area */}
              <Grid item xs={4}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Area"
                  value={selectedConstituency}
                  onChange={(e) => setSelectedConstituency(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Margao">Margao</MenuItem>
                  <MenuItem value="Fatorda">Fatorda</MenuItem>
                  <MenuItem value="Benaulim">Benaulim</MenuItem>
                </TextField>
              </Grid>

              {/* From */}
              <Grid item xs={4}>
                <TextField
                  type="date"
                  fullWidth
                  size="small"
                  label="From"
                  InputLabelProps={{ shrink: true }}
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </Grid>

              {/* To */}
              <Grid item xs={4}>
                <TextField
                  type="date"
                  fullWidth
                  size="small"
                  label="To"
                  InputLabelProps={{ shrink: true }}
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </Grid>

            </Grid>
          </Paper>

          {/* SEARCH */}
          <Paper
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.95)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Search location (Margao, Goa)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Button
                variant="outlined"
                onClick={handleSearch}
                sx={{ minWidth: "120px" }}
              >
                SEARCH
              </Button>
            </Box>
          </Paper>

          {/* MAP */}
          <Paper
            sx={{
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Box sx={{ height: "500px", width: "100%" }}>
              <MapContainer
                center={[15.2993, 74.124]}
                zoom={11}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution="© OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <RecenterMap position={searchPosition} />

                {filteredLeakages
                  .filter(
                    (item) =>
                      item.location?.lat &&
                      item.location?.lng
                  )
                  .map((item) => (
                    <Marker
                      key={item.id}
                      position={[
                        parseFloat(item.location.lat),
                        parseFloat(item.location.lng),
                      ]}
                    >
                      <Popup>
                        <b>Constituency:</b> {item.constituency} <br />
                        <b>Leakage:</b> {item.leakageType} <br />
                        <b>Engineer:</b> {item.plumberName}
                      </Popup>
                    </Marker>
                  ))}
              </MapContainer>
            </Box>
          </Paper>

        </Container>
      </Box>
    </>
  );
}
