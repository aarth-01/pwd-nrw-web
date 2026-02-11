import {
  Container,
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  Paper
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import bg from "../../assets/bg-front.jpg";

export default function LeakageForm() {
  const navigate = useNavigate();
  const locationData = useLocation();

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

  const handleSubmit = () => {
    const geoLocation = locationData.state?.location || null;

    const totalMinutes =
      Number(formData.days) * 1440 +
      Number(formData.hours) * 60 +
      Number(formData.minutes);

    const estimatedLoss = totalMinutes * 50;

    navigate("/engineer/success", {
      state: {
        loss: estimatedLoss,
        minutes: totalMinutes,
        location: geoLocation,
      },
    });
  };

  return (
    <>
      <Navbar role="engineer" />

      {/* ===== PAGE BACKGROUND ===== */}
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

          // ⭐ overlay WITHOUT blur
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(255,255,255,0.55)" // lighter overlay, no blur
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>

          {/* ===== CARD ===== */}
          <Paper
            elevation={10}
            sx={{
              p: 4,
              borderRadius: 4,
              background: "rgba(255,255,255,0.95)" // solid clean look
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

            <TextField
              fullWidth
              label="Pipeline Type (GI / PVC etc)"
              name="pipelineType"
              margin="normal"
              onChange={handleChange}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField fullWidth label="Days" name="days" margin="normal" onChange={handleChange} />
              <TextField fullWidth label="Hours" name="hours" margin="normal" onChange={handleChange} />
              <TextField fullWidth label="Minutes" name="minutes" margin="normal" onChange={handleChange} />
            </Box>

            <TextField fullWidth label="Litres per minute (LPM)" name="pipeSize" margin="normal" onChange={handleChange} />
            <TextField fullWidth label="Water Pressure" name="pressure" margin="normal" onChange={handleChange} />
            <TextField fullWidth label="Plumber / Meter Reader Name" name="plumberName" margin="normal" onChange={handleChange} />

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button fullWidth variant="outlined" sx={{ borderRadius: 2 }}>
                Mark Location on Map
              </Button>

              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                sx={{ borderRadius: 2, fontWeight: 600 }}
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