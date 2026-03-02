import {
  Container,
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  Paper
} from "@mui/material";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import bg from "../../assets/bg-front.jpg";

export default function LeakageForm() {
  const navigate = useNavigate();
  const locationData = useLocation();

  const selectedLocation = locationData.state?.location || null;

  const [address, setAddress] = useState("");

  // ✅ CORRECT MULTIPLE IMAGE STATE
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [formData, setFormData] = useState({
    constituency: "",
    leakageType: "",
    pipelineType: "",
    days: "",
    hours: "",
    minutes: "",
    pipeSize: "",
    pressure: "",
    plumberName: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!selectedLocation) return;

    const fetchAddress = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedLocation.lat}&lon=${selectedLocation.lng}`
        );
        const data = await res.json();
        setAddress(data.display_name);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAddress();
  }, [selectedLocation]);

  const handleSubmit = async () => {
    try {
      const geoLocation = selectedLocation
        ? {
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
            address: address || "",
          }
        : null;

      const totalMinutes =
        Number(formData.days || 0) * 1440 +
        Number(formData.hours || 0) * 60;

      const estimatedLoss =
        Number(formData.lpm || 0) * totalMinutes;

      await addDoc(collection(db, "leakages"), {
        engineerId: UID,
        constituency: formData.constituency,
        leakageType: formData.leakageType,
        pipelineType: formData.pipelineType,
        durationMinutes: totalMinutes,
        lpm: Number(formData.lpm || 0),
        pressure: formData.pressure,
        diameter: formData.diameter,
        plumberName: formData.plumberName || "Aarth Vajandar",
        location: geoLocation,
        waterLoss: estimatedLoss,

        timestamp: serverTimestamp(),
      });

      navigate("/engineer/success", {
        state: {
          loss: estimatedLoss,
          minutes: totalMinutes,
          location: geoLocation,
        },
      });

    } catch (error) {
      alert("Error saving data: " + error.message);
    }
  };

  return (
    <>
      <Navbar role="engineer" />

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
              background: "rgba(255,255,255,0.95)"
            }}
          >
            <Typography
              variant="h5"
              fontWeight={600}
              letterSpacing={1.5}
              textAlign="center"
              sx={{ mb: 3 }}
            >
              LEAKAGE ENTRY FORM
            </Typography>

            {selectedLocation && (
              <Typography color="green" sx={{ mb: 2 }}>
                📍 {address || "Fetching address..."}
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "left", mt: 2 }}>
              <Button
                variant="contained"
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 2,
                  py: 0.8,
                  backgroundColor: "#4FC3F7",
                  "&:hover": {
                    backgroundColor: "#29B6F6"
                  }
                }}
                onClick={() => navigate("/engineer/map")}
              >
                Mark Location on Map
              </Button>
            </Box>

            <TextField select fullWidth label="Constituency" name="constituency" margin="normal" onChange={handleChange}>
              <MenuItem value="Margao">Margao</MenuItem>
              <MenuItem value="Fatorda">Fatorda</MenuItem>
              <MenuItem value="Benaulim">Benaulim</MenuItem>
            </TextField>

            <TextField select fullWidth label="Leakage Type" name="leakageType" margin="normal" onChange={handleChange}>
              <MenuItem value="Breakdown">Breakdown</MenuItem>
              <MenuItem value="Corrosion">Corrosion</MenuItem>
              <MenuItem value="Manmade">Man-made</MenuItem>
              <MenuItem value="Aging">Aging</MenuItem>
            </TextField>

            <TextField fullWidth label="Pipeline Type (GI / PVC etc)" name="pipelineType" margin="normal" onChange={handleChange} />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField fullWidth label="Days" name="days" margin="normal" onChange={handleChange} />
              <TextField fullWidth label="Hours" name="hours" margin="normal" onChange={handleChange} />
            </Box>

            <TextField fullWidth label="Litres per minute (LPM)" name="lpm" margin="normal" onChange={handleChange} />
            <TextField fullWidth label="Water Pressure" name="pressure" margin="normal" onChange={handleChange} />
            <TextField fullWidth label="Diameter" name="diameter" margin="normal" onChange={handleChange} />
            <TextField fullWidth label="Plumber / Meter Reader Name" name="plumberName" margin="normal" onChange={handleChange} />

            <Typography sx={{ mt: 2, fontWeight: 500 }}>
              Add Image
            </Typography>

            {/* ✅ Modified file input with multiple image preview */}
            <TextField
              fullWidth
              type="file"
              margin="normal"
              inputProps={{ accept: "image/*", multiple: true }}
              onChange={(e) => {
                const files = Array.from(e.target.files);
                if (files.length > 0) {
                  setImageFiles(files);
                  setPreviews(files.map(file => URL.createObjectURL(file)));
                }
              }}
            />

            {previews.length > 0 && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  justifyContent: "center"
                }}
              >
                {previews.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index}`}
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px"
                    }}
                  />
                ))}
              </Box>
            )}

            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                variant="contained"
                size="small"
                onClick={handleSubmit}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  px: 4,
                  py: 1
                }}
              >
                Submit
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}