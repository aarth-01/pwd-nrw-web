import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import Navbar from "../../components/Navbar";

// 🔥 Fix default marker issue
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function MapView() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const snapshot = await getDocs(collection(db, "leakages"));

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }

      setLoading(false);
    };

    fetchLocations();
  }, []);

  return (
    <>
      <Navbar role="admin" />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Leakage Map
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: "600px", width: "100%" }}>
            <MapContainer
              center={[15.2993, 74.124]}
              zoom={11}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {locations.map((loc) => (
                <Marker
                  key={loc.id}
                  position={[
                    parseFloat(loc.latitude),
                    parseFloat(loc.longitude),
                  ]}
                >
                  <Popup>
                    <strong>Address:</strong> {loc.address}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Box>
        )}
      </Container>
    </>
  );
}